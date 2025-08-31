<?php

namespace Database\Seeders;

use App\Models\ProjectRole;
use Illuminate\Database\Seeder;

class ProjectRoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'Full access to project management, member management, and change approval',
                'permissions' => [
                    'view_project',
                    'edit_project',
                    'delete_project',
                    'manage_members',
                    'approve_changes',
                    'view_audit_logs',
                ],
            ],
            [
                'name' => 'editor',
                'display_name' => 'Editor',
                'description' => 'Can edit project details but changes require approval',
                'permissions' => [
                    'view_project',
                    'edit_project',
                    'view_audit_logs',
                ],
            ],
            [
                'name' => 'viewer',
                'display_name' => 'Viewer',
                'description' => 'Can only view the project',
                'permissions' => [
                    'view_project',
                ],
            ],
        ];

        foreach ($roles as $role) {
            ProjectRole::create($role);
        }
    }
}
