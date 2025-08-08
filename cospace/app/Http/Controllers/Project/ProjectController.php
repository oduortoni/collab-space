<?php
/*
* author: @toni
* date: 2025-08-08
* description: Project controller using ProjectService and ProjectDTO
* file: app/Http/Controllers/ProjectController.php
*/

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Src\Project\DTOs\ProjectDTO;
use Src\Project\Interfaces\ProjectServiceInterface;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function __construct(
        protected ProjectServiceInterface $projectService
    ) {}

    public function index(): JsonResponse
    {
        return $this->projectService->list();
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'gif_url' => 'nullable|url',
            'repo_url' => 'nullable|url',
        ]);

        $dto = ProjectDTO::fromArray([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return $this->projectService->store($dto);
    }

    public function show(int $id): JsonResponse
    {
        return $this->projectService->show($id);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'gif_url' => 'nullable|url',
            'repo_url' => 'nullable|url',
        ]);

        $dto = ProjectDTO::fromArray([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return $this->projectService->update($dto, $id);
    }

    public function destroy(int $id): JsonResponse
    {
        return $this->projectService->delete($id);
    }
}
