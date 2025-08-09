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
use Illuminate\Http\RedirectResponse;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(
        protected ProjectServiceInterface $projectService
    ) {}

    public function index(): Response
    {
        $projects = $this->projectService->list();

        return Inertia::render(
            "Project/Index",
            [
                "projects" => $projects,
                "flash" => array(
                    "message" => "projects",
                )
            ]
        );
    }

    public function create(): Response
    {
        return Inertia::render('Project/Create');
    }

    public function store(Request $request): RedirectResponse
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

        if ($request->wantsJson()) {
            return response()->json($project, 201);
        }

        return redirect()->route('projects.show', ['id' => $project->id])->with('message', 'Project created successfully!');
    }

    public function show(int $id): Response
    {
        $project = $this->projectService->show($id);
        return Inertia::render('Project/Show', [
            'project' => $project,
            'flash' => [
                'message' => 'Project',
            ]
        ]);
    }

    public function edit(int $id): Response
    {
        $project = $this->projectService->show($id);
        return Inertia::render('Project/Edit', ['project' => $project]);
    }

    public function update(Request $request, int $id): RedirectResponse
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

        if(is_null($project)) {
            return redirect()->route('projects.show', ['id' => $project->id])->with('message', 'You cannot edit a project you did not create!');
        }

        return redirect()->route('projects.show', ['id' => $project->id])->with('message', 'Project updated successfully!');
    }

    public function destroy(int $id): RedirectResponse
    {
        $deleted = $this->projectService->delete($id);

        if(!$deleted) {
            return redirect()->route('projects.index')->with('message', 'Could not delete a project you did not create!');
        }
        
        return redirect()->route('projects.index')->with('message', 'Project deleted successfully!');
    }
}
