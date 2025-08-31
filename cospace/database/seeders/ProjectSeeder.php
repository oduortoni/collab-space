<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'lynk@mail.com')->first();

        Project::factory(5)->create([
            'user_id' => $user->id,
        ]);
    }
}
