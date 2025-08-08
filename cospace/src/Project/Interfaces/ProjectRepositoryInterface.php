<?php
/*
* author: @toni
* date: 2025-08-08
* description: Project repository interface
* file: src/Project/Interfaces/ProjectRepositoryInterface.php
*/

declare(strict_types=1);

namespace Src\Project\Interfaces;

interface ProjectRepositoryInterface
{
    public function paginateLatest(int $perPage): mixed;

    public function create(array $data): mixed;

    public function find(int $id): mixed;

    public function update(int $id, array $data): mixed;

    public function delete(int $id): bool;
}
