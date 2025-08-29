<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Project\ProjectController;

Route::prefix('projects')
    ->name('projects.')
    ->group(function () {
        Route::middleware(['auth'])->group(function () {
            Route::get('/', [ProjectController::class, 'index'])->name('index');
            Route::get('/create', [ProjectController::class, 'create'])->name('create');
            Route::post('/', [ProjectController::class, 'store'])->name('store');
            Route::get('/{id}/edit', [ProjectController::class, 'edit'])->name('edit');
            Route::put('/{id}', [ProjectController::class, 'update'])->name('update');
            Route::delete('/{id}', [ProjectController::class, 'destroy'])->name('destroy');
        });
        
        // Show route is accessible without authentication (authorization handled in controller)
        Route::get('/{id}', [ProjectController::class, 'show'])->name('show');
    });
