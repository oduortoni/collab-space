<?php
/*
* author: @toni
* date: 2025-08-08
* description: Project service implementation using repository
* file: src/Project/Services/ProjectService.php
*/

declare(strict_types=1);

namespace Src\Project\Services;

use Src\Project\Interfaces\ProjectServiceInterface;
use Src\Project\Interfaces\ProjectRepositoryInterface;
use Src\Project\Entities\ProjectDTO;
use Illuminate\Http\JsonResponse;

class ProjectService implements ProjectServiceInterface
{
    public function __construct(
        protected ProjectRepositoryInterface $projectRepository
    ) {}

    public function list(): JsonResponse
    {
        $projects = $this->projectRepository->paginateLatest(10);
        return response()->json($projects);
    }

    public function store(ProjectDTO $dto): JsonResponse
    {
        $project = $this->projectRepository->create($dto->toArray());
        return response()->json($project, 201);
    }

    public function show(int $id): JsonResponse
    {
        $project = $this->projectRepository->find($id);
        return response()->json($project);
    }

    public function update(ProjectDTO $dto, int $id): JsonResponse
    {
        $project = $this->projectRepository->update($id, $dto->toArray());
        return response()->json($project);
    }

    public function delete(int $id): JsonResponse
    {
        $this->projectRepository->delete($id);
        return response()->json(null, 204);
    }
}
