<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectRole extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'permissions',
    ];

    protected $casts = [
        'permissions' => 'array',
    ];

    public function projectMembers(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->permissions ?? []);
    }

    public function canEdit(): bool
    {
        return $this->hasPermission('edit_project');
    }

    public function canDelete(): bool
    {
        return $this->hasPermission('delete_project');
    }

    public function canManageMembers(): bool
    {
        return $this->hasPermission('manage_members');
    }

    public function canApproveChanges(): bool
    {
        return $this->hasPermission('approve_changes');
    }
}
