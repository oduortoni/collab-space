<?php
/*
* author: @toni
* date: 2025-08-08
* description: Interface for project-related services
* file: src/Project/Interfaces/ProjectServiceInterface.php
*/

declare(strict_types=1);

namespace Src\Project\Interfaces;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Src\Project\Entities\ProjectDTO;

interface ProjectServiceInterface
{
    public function list(): mixed;

    public function store(ProjectDTO $dto): mixed;

    public function show(int $id): mixed;

    public function update(ProjectDTO $dto, int $id): mixed;

    public function delete(int $id): bool;
} 
