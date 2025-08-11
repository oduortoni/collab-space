# Feature Module Architecture

This document outlines the modular architecture used in this project to create standalone, toggleable features. The "Project" feature is the primary example of this pattern.

## Core Concepts

The main goal of this architecture is to encapsulate feature-specific logic into its own dedicated directories. This makes features easy to develop in isolation, and they can be enabled or disabled at a single point: the routing file.

A feature module consists of two main parts:

1.  **Service-Oriented Logic:** A dedicated directory within `src/` that contains the business logic, services, interfaces, and other components of the feature.
2.  **Routed Endpoints:** A dedicated directory within `routes/` that defines all the web or API routes for that feature.

## Directory Structure

For a feature named `{FeatureName}` (e.g., `Project`), the structure is as follows:

```
cospace/
├── app/
│   └── Models/
│       └── {FeatureName}.php       # Eloquent models reside in the standard app/Models directory
├── resources/
│   └── js/
│       └── pages/
│           └── {FeatureName}/      # Feature-specific frontend components
├── routes/
│   └── {feature_name}/         # Lowercase feature name for the folder
│       └── web.php             # Feature-specific routes
├── src/
│   └── {FeatureName}/          # PascalCase feature name for the folder
│       ├── Entities/
│       ├── Infrastructure/
│       ├── Interfaces/
│       ├── Providers/
│       └── Services/
└── tests/
    └── Feature/
        └── {FeatureName}Test.php   # Feature-specific tests
```

## Key Files and Their Roles

### 1. Route Definition (`routes/{feature_name}/web.php`)

This file contains all routes related to the feature. It should be self-contained.

*Example from `routes/project/web.php`:*
```php
<?php

use Illuminate\Support\Facades\Route;
use App\\Http\\Controllers\\Project\\ProjectController;

Route::middleware(['auth'])
    ->prefix('projects')
    ->name('projects.')
    ->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        // ... other project routes
    });
```

### 2. Main Route Registration (`routes/web.php`)

This is the control center where feature modules are enabled or disabled. To enable a feature, you simply `require` its route file. To disable it, you can comment out or wrap the `require` statement in a conditional.

*Example from `routes/web.php`:*
```php
<?php

// ... other application routes

// To enable the "Project" feature, we include its routes file.
// To disable it, we could wrap this in a feature flag `if` statement
// or simply comment it out.
require __DIR__ . '/project/web.php';
```

**Toggling Features:**

For a more robust on/off switch, you can use a configuration value or an environment variable:

```php
if (config('features.projects_enabled')) {
    require __DIR__ . '/project/web.php';
}
```

### 3. Service Layer (`src/{FeatureName}/`)

This directory houses the core logic of the feature, separated by concern.

-   **`Services/`**: Contains the main business logic classes.
-   **`Interfaces/`**: Defines contracts for the services.
-   **`Providers/`**: Service providers for binding interfaces to implementations.
-   **`Entities/`**: Data Transfer Objects (DTOs) or other data structures.
-   **`Infrastructure/`**: Components dealing with external concerns like APIs or repositories.

## How to Create a New Feature

1.  **Create the `src` Directory:**
    -   Create a new directory `src/{NewFeatureName}`.
    -   Inside it, create the standard subdirectories: `Services`, `Interfaces`, etc.

2.  **Create the `routes` Directory:**
    -   Create a new directory `routes/{new_feature_name}`.
    -   Inside it, create a `web.php` file.

3.  **Define Feature Routes:**
    -   Add all the routes for your new feature inside `routes/{new_feature_name}/web.php`.

4.  **Enable the Feature:**
    -   Open the main `routes/web.php` file.
    -   Add the following line to include your new feature's routes:
        ```php
        require __DIR__ . '/{new_feature_name}/web.php';
        ```

5.  **Develop the Feature:**
    -   Create your models, controllers, services, and frontend components in their respective directories as outlined in the structure above.
    -   Add tests for your feature in the `tests/Feature/` directory.

## Advanced: Service Providers and Dependency Injection

To keep our features truly decoupled and maintainable, we use Service Providers to manage dependencies. This allows us to rely on contracts (interfaces) rather than concrete classes, which is a core principle of good software design.

### 1. The Feature Service Provider

Each feature should have its own service provider. Its single responsibility is to register the feature's services and bindings with Laravel's service container.

*Example from `src/Project/Providers/ProjectServiceProvider.php`:*
```php
<?php

declare(strict_types=1);

namespace Src\\Project\\Providers;

use Illuminate\\Support\\ServiceProvider;
use Src\\Project\\Interfaces\\ProjectRepositoryInterface;
use Src\\Project\\Infrastructure\\Repositories\\ProjectRepository;
use Src\\Project\\Interfaces\\ProjectServiceInterface;
use Src\\Project\\Services\\ProjectService;

class ProjectServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind the Repository
        $this->app->bind(ProjectRepositoryInterface::class, ProjectRepository::class);
        
        // Bind the Service
        $this->app->bind(ProjectServiceInterface::class, ProjectService::class);
    }
}
```
In this file, we are telling Laravel: "When any part of the application asks for `ProjectServiceInterface`, provide it with an instance of `ProjectService`."

### 2. Registering the Provider

For Laravel to recognize your feature's service provider, you must add it to the array in the `bootstrap/providers.php` file.

```php
// bootstrap/providers.php

return [
    App\Providers\AppServiceProvider::class,
    
    // Add your new feature's service provider here
    Src\Project\Providers\ProjectServiceProvider::class,
];
```

**This step is crucial.** Without it, the bindings you define in your provider will not be registered, and dependency injection will fail.

### 3. Controller and Dependency Injection

Once the interface is bound and the provider is registered, you can "inject" the service into your controller by type-hinting the interface in the constructor.

*Example from `app/Http/Controllers/Project/ProjectController.php`:*
```php
<?php

declare(strict_types=1);

namespace App\\Http\\Controllers\\Project;

use Illuminate\Http\\Request;
use Src\\Project\\Interfaces\\ProjectServiceInterface;
use App\\Http/Controllers\\Controller;
use Inertia\\Inertia;
use Inertia\\Response;

class ProjectController extends Controller
{
    public function __construct(
        protected ProjectServiceInterface $projectService
    ) {}

    public function index(): Response
    {
        // The controller can now use the service without knowing its concrete implementation.
        $projects = $this->projectService->list();

        return Inertia::render(
            "Project/Index",
            ["projects" => $projects]
        );
    }
    
    // ... other methods
}
```
Laravel's service container automatically handles the rest. It sees that the controller needs a `ProjectServiceInterface`, remembers that you bound it to `ProjectService` in the provider, and injects the correct object.

This approach decouples your controller from the concrete implementation of the service, making your code more flexible, easier to test, and simpler to maintain.