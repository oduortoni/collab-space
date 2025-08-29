<?php

namespace Tests\Integration;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Src\Project\Entities\ProjectDTO;
use Src\Project\Services\ProjectService;
use Src\Project\Infrastructure\Repositories\ProjectRepository;

class ProjectIntegrationTest extends TestCase
{
    use RefreshDatabase;

    private ProjectService $projectService;
    private ProjectRepository $projectRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->projectRepository = new ProjectRepository();
        $this->projectService = new ProjectService($this->projectRepository);
    }

    public function test_can_create_project_with_service()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        
        $dto = ProjectDTO::fromArray([
            'title' => 'Integration Test Project',
            'description' => 'Testing project creation',
            'gif_url' => 'https://example.com/test.gif',
            'repo_url' => 'https://github.com/test/repo',
            'user_id' => $user->id,
        ]);

        $project = $this->projectService->store($dto);

        $this->assertInstanceOf(Project::class, $project);
        $this->assertEquals('Integration Test Project', $project->title);
        $this->assertEquals($user->id, $project->user_id);
        $this->assertDatabaseHas('projects', ['title' => 'Integration Test Project']);
    }

    public function test_can_retrieve_project_with_service()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $project = Project::factory()->create(['user_id' => $user->id]);

        $retrievedProject = $this->projectService->show($project->id);

        $this->assertInstanceOf(Project::class, $retrievedProject);
        $this->assertEquals($project->id, $retrievedProject->id);
        $this->assertEquals($project->title, $retrievedProject->title);
    }

    public function test_can_update_project_with_service()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $project = Project::factory()->create(['user_id' => $user->id]);

        $dto = ProjectDTO::fromArray([
            'title' => 'Updated Project Title',
            'description' => 'Updated description',
            'gif_url' => 'https://example.com/updated.gif',
            'repo_url' => 'https://github.com/updated/repo',
            'user_id' => $user->id,
        ]);

        $updatedProject = $this->projectService->update($dto, $project->id);

        $this->assertEquals('Updated Project Title', $updatedProject->title);
        $this->assertEquals('Updated description', $updatedProject->description);
        $this->assertDatabaseHas('projects', ['title' => 'Updated Project Title']);
    }

    public function test_can_delete_project_with_service()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $project = Project::factory()->create(['user_id' => $user->id]);

        $deleted = $this->projectService->delete($project->id);

        $this->assertTrue($deleted);
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_can_list_projects_with_service()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        Project::factory()->count(5)->create(['user_id' => $user->id]);

        $projects = $this->projectService->list();

        $this->assertIsArray($projects);
        $this->assertCount(5, $projects);
        $this->assertInstanceOf(Project::class, $projects[0]);
    }

    public function test_repository_can_create_project()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        
        $data = [
            'title' => 'Repository Test Project',
            'description' => 'Testing repository creation',
            'gif_url' => 'https://example.com/repo.gif',
            'repo_url' => 'https://github.com/repo/test',
            'user_id' => $user->id,
        ];

        $project = $this->projectRepository->create($data);

        $this->assertInstanceOf(Project::class, $project);
        $this->assertEquals('Repository Test Project', $project->title);
        $this->assertDatabaseHas('projects', ['title' => 'Repository Test Project']);
    }

    public function test_repository_can_find_project()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $project = Project::factory()->create(['user_id' => $user->id]);

        $foundProject = $this->projectRepository->find($project->id);

        $this->assertInstanceOf(Project::class, $foundProject);
        $this->assertEquals($project->id, $foundProject->id);
    }

    public function test_repository_can_paginate_latest_projects()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        Project::factory()->count(15)->create(['user_id' => $user->id]);

        $projects = $this->projectRepository->paginateLatest(10);

        $this->assertCount(10, $projects->items());
        $this->assertEquals(15, $projects->total());
    }

    public function test_service_integration_with_repository()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        
        // Create
        $dto = ProjectDTO::fromArray([
            'title' => 'Integration Test',
            'description' => 'Full integration test',
            'user_id' => $user->id,
        ]);
        
        $project = $this->projectService->store($dto);
        $this->assertDatabaseHas('projects', ['title' => 'Integration Test']);

        // Read
        $found = $this->projectService->show($project->id);
        $this->assertEquals('Integration Test', $found->title);

        // Update
        $updateDto = ProjectDTO::fromArray([
            'title' => 'Updated Integration',
            'description' => 'Updated description',
            'user_id' => $user->id,
        ]);
        
        $updated = $this->projectService->update($updateDto, $project->id);
        $this->assertEquals('Updated Integration', $updated->title);

        // Delete
        $deleted = $this->projectService->delete($project->id);
        $this->assertTrue($deleted);
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_dto_creation_and_validation()
    {
        $data = [
            'title' => 'DTO Test',
            'description' => 'Testing DTO',
            'gif_url' => 'https://example.com/dto.gif',
            'repo_url' => 'https://github.com/dto/test',
            'user_id' => 1,
        ];

        $dto = ProjectDTO::fromArray($data);

        $this->assertEquals('DTO Test', $dto->title);
        $this->assertEquals('Testing DTO', $dto->description);
        $this->assertEquals('https://example.com/dto.gif', $dto->gif_url);
        $this->assertEquals('https://github.com/dto/test', $dto->repo_url);
        $this->assertEquals(1, $dto->user_id);
    }

    public function test_service_handles_repository_exceptions()
    {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);

        $this->projectService->show(9999);
    }
}
