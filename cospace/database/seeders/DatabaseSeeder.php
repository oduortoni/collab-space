<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'lynk',
            'email' => 'lynk@mail.com',
            'password' => 'abcdeF1@',
        ]);

        $this->call([
            ProjectRoleSeeder::class,
            ProjectSeeder::class,
        ]);
    }
}
