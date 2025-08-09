<?php
/*
* author: @toni
* date: 2025-08-08
* description: Project controller using ProjectService and ProjectDTO
* file: app/Http/Controllers/Project/ProjectController.php
*/

declare(strict_types=1);

namespace App\Http\Controllers\Project;

use Illuminate\Http\Request;
use Src\Project\Entities\ProjectDTO;
use Src\Project\Interfaces\ProjectServiceInterface;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class ProjectController extends Controller
{
    public function __construct(
        protected ProjectServiceInterface $projectService
    ) {}

    public function index(): JsonResponse
    {
        $project = $this->projectService->list();
        return response()->json($projects);
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

        $project = $this->projectService->store($dto);
        return response()->json($project, 201);
    }

    public function show(int $id): JsonResponse
    {
        $project = $this->projectService->show($id);
        return response()->json($project);
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

        $project = $this->projectService->update($dto, $id);
        return response()->json($project);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->projectService->delete($id);
        return response()->json(null, 204);
    }
}
