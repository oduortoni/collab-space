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

interface ProjectServiceInterface
{
    public function list(Request $request): JsonResponse;

    public function store(Request $request): JsonResponse;

    public function show(int $id): JsonResponse;

    public function update(Request $request, int $id): JsonResponse;

    public function delete(int $id): JsonResponse;
} 
