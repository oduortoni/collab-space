<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'gif_url',
        'repo_url',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function changeRequests(): HasMany
    {
        return $this->hasMany(ProjectChangeRequest::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(ProjectAuditLog::class);
    }

    public function getOwner(): User
    {
        return $this->user;
    }

    public function isOwner(User $user): bool
    {
        return $this->user_id === $user->id;
    }

    public function getMemberRole(User $user): ?ProjectRole
    {
        $member = $this->members()->where('user_id', $user->id)->first();
        return $member?->role;
    }

    public function hasMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    public function addMember(User $user, ProjectRole $role, User $invitedBy): ProjectMember
    {
        return $this->members()->create([
            'user_id' => $user->id,
            'project_role_id' => $role->id,
            'invited_by' => $invitedBy->id,
            'joined_at' => now(),
        ]);
    }

    public function removeMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->delete() > 0;
    }

    public function getAdmins(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->members()
            ->whereHas('role', function ($query) {
                $query->whereJsonContains('permissions', 'manage_members');
            })
            ->with('user')
            ->get()
            ->pluck('user');
    }

    public function canUserEdit(User $user): bool
    {
        // Owner can always edit
        if ($this->isOwner($user)) {
            return true;
        }

        // Check if user is a member with edit permissions
        $role = $this->getMemberRole($user);
        return $role && $role->canEdit();
    }

    public function canUserApproveChanges(User $user): bool
    {
        // Owner can always approve
        if ($this->isOwner($user)) {
            return true;
        }

        // Check if user is a member with approval permissions
        $role = $this->getMemberRole($user);
        return $role && $role->canApproveChanges();
    }

    public function canUserManageMembers(User $user): bool
    {
        // Owner can always manage members
        if ($this->isOwner($user)) {
            return true;
        }

        // Check if user is a member with member management permissions
        $role = $this->getMemberRole($user);
        return $role && $role->canManageMembers();
    }
}
