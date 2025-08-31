<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Project\ProjectController;
use App\Http\Controllers\Project\ProjectMemberController;
use App\Http\Controllers\Project\ProjectChangeRequestController;
use App\Http\Controllers\Project\ProjectAuditLogController;

Route::prefix('projects')
    ->name('projects.')
    ->group(function () {
        // Index and show routes accessible without authentication
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        
        Route::middleware(['auth'])->group(function () {
            Route::get('/create', [ProjectController::class, 'create'])->name('create');
            Route::post('/', [ProjectController::class, 'store'])->name('store');
            Route::get('/{id}/edit', [ProjectController::class, 'edit'])->name('edit');
            Route::put('/{id}', [ProjectController::class, 'update'])->name('update');
            Route::delete('/{id}', [ProjectController::class, 'destroy'])->name('destroy');
            
            // Member management routes
            Route::get('/{project}/members', [ProjectMemberController::class, 'index'])->name('members.index');
            Route::post('/{project}/members', [ProjectMemberController::class, 'store'])->name('members.store');
            Route::put('/{project}/members/{member}', [ProjectMemberController::class, 'update'])->name('members.update');
            Route::delete('/{project}/members/{member}', [ProjectMemberController::class, 'destroy'])->name('members.destroy');
            
            // Change request routes
            Route::get('/{project}/change-requests', [ProjectChangeRequestController::class, 'index'])->name('change-requests.index');
            Route::post('/{project}/change-requests', [ProjectChangeRequestController::class, 'store'])->name('change-requests.store');
            Route::post('/{project}/change-requests/{changeRequest}/approve', [ProjectChangeRequestController::class, 'approve'])->name('change-requests.approve');
            Route::post('/{project}/change-requests/{changeRequest}/reject', [ProjectChangeRequestController::class, 'reject'])->name('change-requests.reject');
            
            // Audit log routes
            Route::get('/{project}/audit-logs', [ProjectAuditLogController::class, 'index'])->name('audit-logs.index');
        });
        
        Route::get('/{id}', [ProjectController::class, 'show'])->name('show');
    });
