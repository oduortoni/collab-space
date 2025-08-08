<?php
/*
* author: @toni
* date: 2025-08-08
* description: Project service provider binding repository to interface
* file: src/Project/ProjectServiceProvider.php
*/

declare(strict_types=1);

namespace Src\Project;

use Illuminate\Support\ServiceProvider;
use Src\Project\Interfaces\ProjectRepositoryInterface;
use Src\Project\Repositories\ProjectRepository;
use Src\Project\Interfaces\ProjectServiceInterface;
use Src\Project\Services\ProjectService;


class ProjectServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProjectRepositoryInterface::class, ProjectRepository::class);
        $this->app->bind(ProjectServiceInterface::class, ProjectService::class);
    }
}
