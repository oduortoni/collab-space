<?php
/*
* author: @toni
* date: 2025-08-08
* description: Eloquent implementation of the project repository
* file: src/Project/Infrastructure/Repositories/ProjectRepository.php
*/

declare(strict_types=1);

namespace Src\Project\Infrastructure\Repositories;

use Src\Project\Interfaces\ProjectRepositoryInterface;
use App\Models\Project;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function paginateLatest(int $perPage): mixed
    {
        $projects = Project::where(function($query) {
            $query->where('is_public', true)
                  ->orWhereHas('user', function($userQuery) {
                      $userQuery->where('id', auth()->id());
                  });
        })->latest()->paginate($perPage);

        return $projects;
    }

    public function create(array $data): mixed
    {
        // ensure the authenticated user is set as the owner
        $data['user_id'] = auth()->id();
        return Project::create($data);
    }

    public function find(int $id): mixed
    {
        return Project::findOrFail($id);
    }

    public function update(int $id, array $data): mixed
    {
        $project = Project::findOrFail($id);

        if (! auth()->user()->can('update', $project)) {
            return null;
        }
        
        $project->update($data);
        return $project;
    }

    public function delete(int $id): bool
    {
        $project = Project::findOrFail($id);
        
        // Check if the authenticated user owns this project
        if (! auth()->user()->can('delete', $project)) {
            return false;
        }
        
        return $project->delete();
    }
}
