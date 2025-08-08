<?php
/*
* author: @toni
* date: 2025-08-08
* description: Data Transfer Object for Project
* file: src/Project/DTOs/ProjectDTO.php
*/

declare(strict_types=1);

namespace Src\Project\Entities;

class ProjectDTO
{
    public function __construct(
        public readonly int $user_id,
        public readonly string $title,
        public readonly ?string $description = null,
        public readonly ?string $gif_url = null,
        public readonly ?string $repo_url = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            user_id: $data['user_id'],
            title: $data['title'],
            description: $data['description'] ?? null,
            gif_url: $data['gif_url'] ?? null,
            repo_url: $data['repo_url'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'gif_url' => $this->gif_url,
            'repo_url' => $this->repo_url,
        ];
    }
}
