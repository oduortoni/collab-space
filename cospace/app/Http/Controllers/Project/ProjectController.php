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
use App\Models\ProjectAuditLog;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ProjectController extends Controller
{
    use AuthorizesRequests;
    
    protected \GuzzleHttp\Client $httpClient;

    public function __construct(
        protected ProjectServiceInterface $projectService,
        \GuzzleHttp\Client $httpClient
    ) {
        $this->httpClient = $httpClient;
    }

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
            'is_public' => 'nullable|boolean',
        ]);

        // Validate gif_url is a valid image URL (skip validation for empty or placeholder URLs)
        if (!empty($validated['gif_url']) && $validated['gif_url'] !== 'https://example.com/demo.gif') {
            $this->validateImageUrl($validated['gif_url']);
        }

        // Validate repo_url is a valid GitHub repository URL (skip validation for empty or placeholder URLs)
        if (!empty($validated['repo_url']) && $validated['repo_url'] !== 'https://github.com/username/project') {
            $this->validateGitHubUrl($validated['repo_url']);
        }

        $dto = ProjectDTO::fromArray([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        $project = $this->projectService->store($dto);

        ProjectAuditLog::log(
            $project,
            $request->user(),
            'project_created',
            null,
            $project->toArray(),
            'Project created'
        );

        if ($request->wantsJson()) {
            return response()->json($project, 201);
        }

        return redirect()->route('projects.show', ['id' => $project->id])->with('message', 'Project created successfully!');
    }

    public function show(Request $request, string $id): Response
    {
        $project = $this->projectService->show((int) $id);

        // Authorize the user can view this project
        $this->authorize('view', $project);

        return Inertia::render('Project/Show', [
            'project' => $project,
            'flash' => [
                'message' => 'Project',
            ]
        ]);
    }

    public function edit(string $id): Response
    {
        $project = $this->projectService->show((int) $id);
        return Inertia::render('Project/Edit', ['project' => $project]);
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'gif_url' => 'nullable|url',
            'repo_url' => 'nullable|url',
            'is_public' => 'nullable|boolean',
        ]);

        // Validate gif_url is a valid image URL (skip validation for empty or placeholder URLs)
        if (!empty($validated['gif_url']) && $validated['gif_url'] !== 'https://example.com/demo.gif') {
            $this->validateImageUrl($validated['gif_url']);
        }

        // Validate repo_url is a valid GitHub repository URL (skip validation for empty or placeholder URLs)
        if (!empty($validated['repo_url']) && $validated['repo_url'] !== 'https://github.com/username/project') {
            $this->validateGitHubUrl($validated['repo_url']);
        }

        $dto = ProjectDTO::fromArray([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        $originalProject = $this->projectService->show((int) $id);
        $project = $this->projectService->update($dto, (int) $id);

        if(is_null($project)) {
            return redirect()->route('projects.show', ['id' => $project->id])->with('message', 'You cannot edit a project you did not create!');
        }

        ProjectAuditLog::log(
            $project,
            $request->user(),
            'project_updated',
            $originalProject->toArray(),
            $project->toArray(),
            'Project updated'
        );

        return redirect()->route('projects.show', ['id' => $project->id])->with('message', 'Project updated successfully!');
    }

    public function destroy(string $id): RedirectResponse
    {
        $project = $this->projectService->show((int) $id);
        $deleted = $this->projectService->delete((int) $id);

        if(!$deleted) {
            return redirect()->route('projects.index')->with('message', 'Could not delete a project you did not create!');
        }

        ProjectAuditLog::log(
            $project,
            request()->user(),
            'project_deleted',
            $project->toArray(),
            null,
            'Project deleted'
        );

        return redirect()->route('projects.index')->with('message', 'Project deleted successfully!');
    }

    /**
     * Validate that the URL points to a valid image
     */
    private function validateImageUrl(string $url): void
    {
        // Check if this is a Google Drive URL
        $isGoogleDrive = str_contains($url, 'drive.google.com/file/d/');
        
        if (!$isGoogleDrive) {
            // For non-Google Drive URLs, check if URL has a valid image extension
            $validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
            $path = parse_url($url, PHP_URL_PATH);
            $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            
            if (!in_array($extension, $validExtensions)) {
                throw new \Illuminate\Validation\ValidationException(
                    validator()->make([], []),
                    redirect()->back()->withErrors([
                        'gif_url' => 'The GIF URL must point to a valid image file (jpg, jpeg, png, gif, webp, svg) or Google Drive link.'
                    ])
                );
            }
        }

        // Verify the URL actually points to an image by checking headers
        try {
            $client = $this->httpClient;
            
            // For Google Drive URLs, we need to use GET instead of HEAD to get proper content type
            if ($isGoogleDrive) {
                $response = $client->get($url, [
                    'headers' => ['User-Agent' => 'CollabSpace/1.0'],
                    'allow_redirects' => true
                ]);
            } else {
                $response = $client->head($url, [
                    'headers' => ['User-Agent' => 'CollabSpace/1.0']
                ]);
            }
            
            $contentType = $response->getHeaderLine('Content-Type');
            
            // For Google Drive, we need to handle the fact that it might return HTML
            if ($isGoogleDrive) {
                // Google Drive URLs that point to images will typically have image content type
                // or might be HTML pages that contain images
                if (!str_starts_with($contentType, 'image/') && !str_contains($contentType, 'text/html')) {
                    throw new \Illuminate\Validation\ValidationException(
                        validator()->make([], []),
                        redirect()->back()->withErrors([
                            'gif_url' => 'The Google Drive URL does not appear to point to a valid image.'
                        ])
                    );
                }
            } else {
                // For direct image URLs, require image content type
                if (!str_starts_with($contentType, 'image/')) {
                    throw new \Illuminate\Validation\ValidationException(
                        validator()->make([], []),
                        redirect()->back()->withErrors([
                            'gif_url' => 'The URL does not point to a valid image.'
                        ])
                    );
                }
            }
        } catch (\Exception $e) {
            throw new \Illuminate\Validation\ValidationException(
                validator()->make([], []),
                redirect()->back()->withErrors([
                    'gif_url' => 'Unable to verify the image URL. Please ensure the URL is accessible.'
                ])
            );
        }
    }

    /**
     * Validate that the URL is a valid GitHub repository
     */
    private function validateGitHubUrl(string $url): void
    {
        // Check if URL is a valid GitHub repository URL
        $pattern = '/^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+(\/)?$/';
        
        if (!preg_match($pattern, $url)) {
            throw new \Illuminate\Validation\ValidationException(
                validator()->make([], []),
                redirect()->back()->withErrors([
                    'repo_url' => 'Please provide a valid GitHub repository URL (e.g., https://github.com/username/repository).'
                ])
            );
        }

        // Verify the GitHub repository exists and is accessible
        try {
            $client = $this->httpClient;
            $response = $client->get($url, [
                'headers' => [
                    'User-Agent' => 'CollabSpace/1.0',
                    'Accept' => 'application/vnd.github.v3+json'
                ]
            ]);
            
            // If we get a successful response, the repository exists
            if ($response->getStatusCode() !== 200) {
                throw new \Illuminate\Validation\ValidationException(
                    validator()->make([], []),
                    redirect()->back()->withErrors([
                        'repo_url' => 'GitHub repository not found or inaccessible.'
                    ])
                );
            }
        } catch (\Exception $e) {
            throw new \Illuminate\Validation\ValidationException(
                validator()->make([], []),
                redirect()->back()->withErrors([
                    'repo_url' => 'Unable to verify GitHub repository. Please ensure the URL is correct and the repository is public.'
                ])
            );
        }
    }
}
