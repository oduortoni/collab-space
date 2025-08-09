<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Project\ProjectController;

Route::middleware(['auth'])
    ->prefix('projects')
    ->name('projects.')
    ->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::post('/', [ProjectController::class, 'store'])->name('store');
        Route::get('{id}', [ProjectController::class, 'show'])->name('show');
        Route::put('{id}', [ProjectController::class, 'update'])->name('update');
        Route::delete('{id}', [ProjectController::class, 'destroy'])->name('destroy');
    });
