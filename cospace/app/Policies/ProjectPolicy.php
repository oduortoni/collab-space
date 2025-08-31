<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function view(?User $user, Project $project): bool
    {
        // Allow access if project is public
        if ($project->is_public) {
            return true;
        }

        // Allow access if user is authenticated and owns the project
        if ($user && $project->isOwner($user)) {
            return true;
        }

        // Allow access if user is a member of the project
        return $user && $project->hasMember($user);
    }

    public function update(User $user, Project $project): bool
    {
        return $project->canUserEdit($user);
    }

    public function delete(User $user, Project $project): bool
    {
        return $project->isOwner($user) || ($project->canUserManageMembers($user) && $project->canUserEdit($user));
    }

    public function manageMembers(User $user, Project $project): bool
    {
        return $project->canUserManageMembers($user);
    }

    public function approveChanges(User $user, Project $project): bool
    {
        return $project->canUserApproveChanges($user);
    }

    public function viewAuditLogs(User $user, Project $project): bool
    {
        // Owner and admins can view audit logs
        if ($project->isOwner($user)) {
            return true;
        }

        $role = $project->getMemberRole($user);
        return $role && in_array('view_audit_logs', $role->permissions ?? []);
    }

    public function inviteMembers(User $user, Project $project): bool
    {
        return $project->canUserManageMembers($user);
    }

    public function removeMembers(User $user, Project $project): bool
    {
        return $project->canUserManageMembers($user);
    }
}
