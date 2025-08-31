<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProjectAuditLogController extends Controller
{
    public function index(Request $request, string $id)
    {
        $project = Project::findOrFail($id);
        Gate::authorize('viewAuditLogs', $project);

        $query = $project->auditLogs()->with('user');

        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $auditLogs = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return Inertia::render('Project/AuditLogs/Index', [
            'project' => $project,
            'auditLogs' => $auditLogs,
        ]);
    }
}