<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectVisibilityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a mock HTTP client that simulates successful responses
        $mock = new MockHandler([
            new Response(200, ['Content-Type' => 'application/json']), // GitHub repo validation
            new Response(200, ['Content-Type' => 'image/gif']),       // Image validation
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $mockClient = new GuzzleClient(['handler' => $handlerStack]);
        
        // Bind the mock client to the container
        $this->app->instance(GuzzleClient::class, $mockClient);
    }

    public function test_public_project_can_be_viewed_by_anyone(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create([
            'user_id' => $user->id,
            'is_public' => true,
        ]);

        // Unauthenticated user can view public project
        $response = $this->get(route('projects.show', $project));
        $response->assertOk();
        $response->assertSee($project->title);

        // Different authenticated user can view public project
        $otherUser = User::factory()->create();
        $response = $this->actingAs($otherUser)->get(route('projects.show', $project));
        $response->assertOk();
        $response->assertSee($project->title);
    }

    public function test_private_project_cannot_be_viewed_by_others(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create([
            'user_id' => $user->id,
            'is_public' => false,
        ]);

        // Unauthenticated user cannot view private project
        $response = $this->get(route('projects.show', $project));
        $response->assertForbidden();

        // Different authenticated user cannot view private project
        $otherUser = User::factory()->create();
        $response = $this->actingAs($otherUser)->get(route('projects.show', $project));
        $response->assertForbidden();

        // Owner can view private project
        $response = $this->actingAs($user)->get(route('projects.show', $project));
        $response->assertOk();
        $response->assertSee($project->title);
    }

    public function test_owner_can_toggle_project_visibility(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create([
            'user_id' => $user->id,
            'is_public' => false,
        ]);

        // Make project public
        $response = $this->actingAs($user)->put(route('projects.update', $project), [
            'title' => $project->title,
            'description' => $project->description,
            'is_public' => true,
        ]);

        $response->assertRedirect(route('projects.show', $project));
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'is_public' => true,
        ]);

        // Make project private again
        $response = $this->actingAs($user)->put(route('projects.update', $project), [
            'title' => $project->title,
            'description' => $project->description,
            'is_public' => false,
        ]);

        $response->assertRedirect(route('projects.show', $project));
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'is_public' => false,
        ]);
    }
}
