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

    public function list(): mixed
    {
        $projects = $this->projectRepository->paginateLatest(10);
        return $projects;
    }

    public function store(ProjectDTO $dto): mixed
    {
        $project = $this->projectRepository->create($dto->toArray());
        return $project;
    }

    public function show(int $id): mixed
    {
        $project = $this->projectRepository->find($id);
        return $project;
    }

    public function update(ProjectDTO $dto, int $id): mixed
    {
        $project = $this->projectRepository->update($id, $dto->toArray());
        return $project;
    }

    public function delete(int $id): bool
    {
        $deleted = $this->projectRepository->delete($id);
        return $deleted;
    }
}
