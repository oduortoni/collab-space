<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        // Create a default user and attach projects
        $user = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
        ]);

        Project::factory(5)->create([
            'user_id' => $user->id,
        ]);

        // Create some random users with projects
        User::factory(3)->create()->each(function ($user) {
            Project::factory(rand(1, 4))->create([
                'user_id' => $user->id,
            ]);
        });
    }
}
