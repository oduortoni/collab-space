<?php
/*
* author: @toni
* date: 2025-08-08
* description: Eloquent implementation of the project repository
* file: src/Project/Repositories/ProjectRepository.php
*/

declare(strict_types=1);

namespace Src\Project\Repositories;

use Src\Project\Interfaces\ProjectRepositoryInterface;
use App\Models\Project;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function paginateLatest(int $perPage): mixed
    {
        return Project::latest()->paginate($perPage);
    }

    public function create(array $data): mixed
    {
        return Project::create($data);
    }

    public function find(int $id): mixed
    {
        return Project::findOrFail($id);
    }

    public function update(int $id, array $data): mixed
    {
        $project = Project::findOrFail($id);
        $project->update($data);
        return $project;
    }

    public function delete(int $id): bool
    {
        return Project::destroy($id) > 0;
    }
}
