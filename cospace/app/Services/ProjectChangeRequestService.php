<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectChangeRequest;
use App\Models\ProjectAuditLog;
use App\Models\User;

class ProjectChangeRequestService
{
    public function createChangeRequest(
        Project $project,
        User $user,
        string $fieldName,
        mixed $newValue,
        string $reason
    ): ProjectChangeRequest {
        $changeRequest = $project->changeRequests()->create([
            'requested_by' => $user->id,
            'field_name' => $fieldName,
            'old_value' => $project->{$fieldName},
            'new_value' => $newValue,
            'reason' => $reason,
            'status' => 'pending',
        ]);

        ProjectAuditLog::log(
            $project,
            $user,
            'change_requested',
            null,
            $changeRequest->toArray(),
            "Change request created for {$fieldName}"
        );

        return $changeRequest;
    }

    public function approveChangeRequest(
        ProjectChangeRequest $changeRequest,
        User $reviewer,
        ?string $notes = null
    ): void {
        if (!$changeRequest->isPending()) {
            throw new \InvalidArgumentException('Change request is not pending');
        }

        $project = $changeRequest->project;
        $oldValue = $project->{$changeRequest->field_name};

        $changeRequest->approve($reviewer, $notes);
        $project->update([$changeRequest->field_name => $changeRequest->new_value]);

        ProjectAuditLog::log(
            $project,
            $reviewer,
            'change_approved',
            [$changeRequest->field_name => $oldValue],
            [$changeRequest->field_name => $changeRequest->new_value],
            "Change request approved: {$changeRequest->reason}"
        );
    }

    public function rejectChangeRequest(
        ProjectChangeRequest $changeRequest,
        User $reviewer,
        ?string $notes = null
    ): void {
        if (!$changeRequest->isPending()) {
            throw new \InvalidArgumentException('Change request is not pending');
        }

        $changeRequest->reject($reviewer, $notes);

        ProjectAuditLog::log(
            $changeRequest->project,
            $reviewer,
            'change_rejected',
            null,
            $changeRequest->toArray(),
            "Change request rejected: {$changeRequest->reason}"
        );
    }
}