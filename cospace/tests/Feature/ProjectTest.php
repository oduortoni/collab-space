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

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a mock HTTP client that simulates successful responses
        $mock = new MockHandler([
            // Mock responses for create test (image validation + GitHub)
            new Response(200, ['Content-Type' => 'image/gif']),       // Image validation
            new Response(200, ['Content-Type' => 'application/json']), // GitHub repo validation
            
            // Mock responses for update test (image validation + GitHub)
            new Response(200, ['Content-Type' => 'image/gif']),       // Image validation
            new Response(200, ['Content-Type' => 'application/json']), // GitHub repo validation
            
            // Additional responses for any other requests
            new Response(200, ['Content-Type' => 'image/gif']),
            new Response(200, ['Content-Type' => 'application/json']),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $mockClient = new GuzzleClient(['handler' => $handlerStack]);
        
        // Bind the mock client to the container
        $this->app->instance(GuzzleClient::class, $mockClient);
    }

    public function test_user_can_create_a_project(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->post(route('projects.store'), [
                'title' => 'Test Project',
                'description' => 'A small test project',
                'gif_url' => 'https://example.com/demo.gif',
                'repo_url' => 'https://github.com/example/repo',
            ]);

        $response->assertRedirect(route('projects.show', ['id' => 1]));
        $this->assertDatabaseHas('projects', ['title' => 'Test Project']);
    }

    public function test_user_can_update_project(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->put(route('projects.update', $project), [
                'title' => 'Updated Project',
                'description' => 'Updated description',
                'gif_url' => 'https://example.com/updated.gif',
                'repo_url' => 'https://github.com/example/updated',
            ]);

        $response->assertRedirect(route('projects.show', $project));
        $this->assertDatabaseHas('projects', ['title' => 'Updated Project']);
    }

    public function test_user_can_delete_project(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->delete(route('projects.destroy', $project));

        $response->assertRedirect(route('projects.index'));
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_project_requires_title(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('projects.store'), [])
            ->assertSessionHasErrors('title');
    }

    public function test_project_requires_valid_url_for_gif(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('projects.store'), [
                'title' => 'Test Project',
                'gif_url' => 'invalid-url',
            ])
            ->assertSessionHasErrors('gif_url');
    }

    public function test_project_requires_valid_url_for_repo(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('projects.store'), [
                'title' => 'Test Project',
                'repo_url' => 'invalid-url',
            ])
            ->assertSessionHasErrors('repo_url');
    }
}
