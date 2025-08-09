<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_a_project(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson(route('projects.store'), [
                'title' => 'Test Project',
                'description' => 'A small test project',
                'gif_url' => 'https://example.com/demo.gif',
                'repo_url' => 'https://github.com/example/repo',
            ])
            ->assertCreated()
            ->assertJsonFragment(['title' => 'Test Project']);

        $this->assertDatabaseHas('projects', ['title' => 'Test Project']);
    }

    public function test_project_requires_title(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson(route('projects.store'), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('title');
    }
}
