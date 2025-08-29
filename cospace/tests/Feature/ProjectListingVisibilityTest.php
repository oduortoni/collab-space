<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectListingVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_see_public_projects_from_other_users(): void
    {
        // Create two users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // User1 creates a public project
        $publicProject = Project::factory()->create([
            'user_id' => $user1->id,
            'is_public' => true,
        ]);

        // User1 creates a private project
        $privateProject = Project::factory()->create([
            'user_id' => $user1->id,
            'is_public' => false,
        ]);

        // User2 logs in and visits the projects index
        $response = $this->actingAs($user2)->get(route('projects.index'));

        $response->assertOk();
        
        // User2 should see the public project
        $response->assertSee($publicProject->title);
        
        // User2 should NOT see the private project
        $response->assertDontSee($privateProject->title);
    }

    public function test_user_can_see_own_private_projects(): void
    {
        $user = User::factory()->create();

        // User creates a private project
        $privateProject = Project::factory()->create([
            'user_id' => $user->id,
            'is_public' => false,
        ]);

        // User visits the projects index
        $response = $this->actingAs($user)->get(route('projects.index'));

        $response->assertOk();
        
        // User should see their own private project
        $response->assertSee($privateProject->title);
    }

    public function test_unauthenticated_user_can_see_public_projects(): void
    {
        $user = User::factory()->create();

        // Create a public project
        $publicProject = Project::factory()->create([
            'user_id' => $user->id,
            'is_public' => true,
        ]);

        // Create a private project
        $privateProject = Project::factory()->create([
            'user_id' => $user->id,
            'is_public' => false,
        ]);

        // Unauthenticated user visits the projects index
        $response = $this->get(route('projects.index'));

        $response->assertOk();
        
        // Should see the public project
        $response->assertSee($publicProject->title);
        
        // Should NOT see the private project
        $response->assertDontSee($privateProject->title);
    }
}
