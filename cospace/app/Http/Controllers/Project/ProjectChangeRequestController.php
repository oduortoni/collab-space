<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectChangeRequest;
use App\Models\ProjectAuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Src\Project\Services\ProjectChangeRequestService;

class ProjectChangeRequestController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private ProjectChangeRequestService $changeRequestService
    ) {}

    public function index(string $id)
    {
        $project = Project::findOrFail($id);
        $this->authorize('view', $project);

        $changeRequests = $project->changeRequests()
            ->with(['requester', 'reviewer'])
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Project/ChangeRequests/Index', [
            'project' => $project,
            'changeRequests' => $changeRequests,
        ]);
    }

    public function store(Request $request, string $id): RedirectResponse
    {
        $project = Project::findOrFail($id);
        
        // For public projects, any authenticated user can propose changes
        // For private projects, only members can propose changes
        if (!$project->is_public) {
            $this->authorize('view', $project);
        }

        $validated = $request->validate([
            'field_name' => 'required|string|in:title,description,gif_url,repo_url,is_public',
            'new_value' => 'required|string',
            'reason' => 'nullable|string|max:500',
        ]);
        
        // Only project owner can change visibility
        if ($validated['field_name'] === 'is_public' && !$project->isOwner($request->user())) {
            return redirect()->back()->withErrors(['field_name' => 'Only the project owner can change visibility.']);
        }

        // Get current value
        $oldValue = $project->{$validated['field_name']};

        // If user can edit directly (owner or admin), apply the change immediately
        if ($project->canUserApproveChanges($request->user())) {
            $project->update([$validated['field_name'] => $validated['new_value']]);

            ProjectAuditLog::log(
                $project,
                $request->user(),
                'updated',
                [$validated['field_name'] => $oldValue],
                [$validated['field_name'] => $validated['new_value']],
                $validated['reason'] ?? 'Direct edit by authorized user'
            );

            return redirect()->back()->with('message', 'Project updated successfully!');
        }

        // Otherwise, create a change request
        $changeRequest = ProjectChangeRequest::create([
            'project_id' => $project->id,
            'requested_by' => $request->user()->id,
            'field_name' => $validated['field_name'],
            'old_value' => $oldValue,
            'new_value' => $validated['new_value'],
            'reason' => $validated['reason'],
        ]);

        // Log the change request
        ProjectAuditLog::log(
            $project,
            $request->user(),
            'change_requested',
            null,
            [
                'change_request_id' => $changeRequest->id,
                'field' => $validated['field_name'],
                'new_value' => $validated['new_value']
            ],
            $validated['reason']
        );

        return redirect()->back()->with('message', 'Change request submitted for approval!');
    }

    public function approve(Request $request, string $id, ProjectChangeRequest $changeRequest): RedirectResponse
    {
        $project = Project::findOrFail($id);
        $this->authorize('approveChanges', $project);

        if (!$changeRequest->isPending()) {
            return redirect()->back()->withErrors(['change_request' => 'This change request has already been reviewed.']);
        }

        $notes = $request->input('notes');

        // Apply the change
        $project->update([$changeRequest->field_name => $changeRequest->new_value]);

        // Approve the change request
        $changeRequest->approve($request->user(), $notes);

        // Log the approval
        ProjectAuditLog::log(
            $project,
            $request->user(),
            'change_approved',
            [$changeRequest->field_name => $changeRequest->old_value],
            [$changeRequest->field_name => $changeRequest->new_value],
            "Approved change request #{$changeRequest->id}: {$notes}"
        );

        return redirect()->back()->with('message', 'Change request approved and applied!');
    }

    public function reject(Request $request, string $id, ProjectChangeRequest $changeRequest): RedirectResponse
    {
        $project = Project::findOrFail($id);
        $this->authorize('approveChanges', $project);

        if (!$changeRequest->isPending()) {
            return redirect()->back()->withErrors(['change_request' => 'This change request has already been reviewed.']);
        }

        $notes = $request->input('notes');

        // Reject the change request
        $changeRequest->reject($request->user(), $notes);

        // Log the rejection
        ProjectAuditLog::log(
            $project,
            $request->user(),
            'change_rejected',
            null,
            ['change_request_id' => $changeRequest->id],
            "Rejected change request #{$changeRequest->id}: {$notes}"
        );

        return redirect()->back()->with('message', 'Change request rejected!');
    }
}
