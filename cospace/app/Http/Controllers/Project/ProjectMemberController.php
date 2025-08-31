<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\ProjectRole;
use App\Models\User;
use App\Models\ProjectAuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ProjectMemberController extends Controller
{
    use AuthorizesRequests;

    public function index(string $id)
    {
        $project = Project::findOrFail($id);
        $this->authorize('view', $project);

        $members = $project->members()->with(['user', 'role', 'invitedBy'])->get();
        $availableRoles = ProjectRole::all();

        return inertia('Project/Members/Index', [
            'project' => $project,
            'members' => $members,
            'roles' => $availableRoles,
        ]);
    }

    public function store(Request $request, string $id): RedirectResponse
    {
        $project = Project::findOrFail($id);
        $this->authorize('inviteMembers', $project);

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'role_id' => 'required|exists:project_roles,id',
        ]);

        $user = User::where('email', $validated['email'])->first();
        $role = ProjectRole::find($validated['role_id']);

        // Check if user is already a member
        if ($project->hasMember($user)) {
            return redirect()->back()->withErrors(['email' => 'User is already a member of this project.']);
        }

        // Add member to project
        $member = $project->addMember($user, $role, $request->user());

        // Log the action
        ProjectAuditLog::log(
            $project,
            $request->user(),
            'member_added',
            null,
            ['member_id' => $member->id, 'role' => $role->name],
            "Invited {$user->name} as {$role->display_name}"
        );

        return redirect()->back()->with('message', 'Member invited successfully!');
    }

    public function update(Request $request, string $id, ProjectMember $member): RedirectResponse
    {
        $project = Project::findOrFail($id);
        $this->authorize('manageMembers', $project);

        $validated = $request->validate([
            'role_id' => 'required|exists:project_roles,id',
        ]);

        $oldRole = $member->role;
        $newRole = ProjectRole::find($validated['role_id']);

        $member->update(['project_role_id' => $validated['role_id']]);

        // Log the action
        ProjectAuditLog::log(
            $project,
            $request->user(),
            'member_role_updated',
            ['role' => $oldRole->name],
            ['role' => $newRole->name],
            "Changed {$member->user->name}'s role from {$oldRole->display_name} to {$newRole->display_name}"
        );

        return redirect()->back()->with('message', 'Member role updated successfully!');
    }

    public function destroy(Request $request, string $id, ProjectMember $member): RedirectResponse
    {
        $project = Project::findOrFail($id);
        $this->authorize('removeMembers', $project);

        // Prevent removing the project owner
        if ($project->isOwner($member->user)) {
            return redirect()->back()->withErrors(['member' => 'Cannot remove the project owner.']);
        }

        $memberName = $member->user->name;
        $member->delete();

        // Log the action
        ProjectAuditLog::log(
            $project,
            $request->user(),
            'member_removed',
            ['member_id' => $member->id],
            null,
            "Removed {$memberName} from project"
        );

        return redirect()->back()->with('message', 'Member removed successfully!');
    }
}
