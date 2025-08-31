import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock } from 'lucide-react';

interface Project {
    id: number;
    title: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuditLog {
    id: number;
    action: string;
    old_values?: Record<string, unknown>;
    new_values?: Record<string, unknown>;
    notes?: string;
    user: User;
    created_at: string;
    ip_address?: string;
}

interface PaginatedAuditLogs {
    data: AuditLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface AuditLogsPageProps {
    project: Project;
    auditLogs: PaginatedAuditLogs;
    flash?: { message?: string };
}

export default function Index({ project, auditLogs }: AuditLogsPageProps) {
    const { flash } = usePage<AuditLogsPageProps>().props;
    const flashMessage = flash?.message;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Projects', href: route('projects.index') },
        { title: project.title, href: route('projects.show', project.id) },
        { title: 'Audit Logs', href: route('projects.audit-logs.index', project.id) },
    ];

    const getActionBadge = (action: string) => {
        const variants = {
            project_created: 'bg-blue-100 text-blue-800',
            project_updated: 'bg-yellow-100 text-yellow-800',
            project_deleted: 'bg-red-100 text-red-800',
            member_added: 'bg-green-100 text-green-800',
            member_removed: 'bg-red-100 text-red-800',
            change_requested: 'bg-purple-100 text-purple-800',
            change_approved: 'bg-green-100 text-green-800',
            change_rejected: 'bg-red-100 text-red-800',
        };
        return variants[action as keyof typeof variants] || 'bg-gray-100 text-gray-800';
    };

    const formatAction = (action: string) => {
        return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${project.title} - Audit Logs`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flashMessage && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            {flashMessage}
                        </div>
                    )}

                    <div className="mb-6">
                        <Link href={route('projects.show', project.id)}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Project
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Audit Logs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {auditLogs.data.length === 0 ? (
                                    <p className="text-muted-foreground">No audit logs found.</p>
                                ) : (
                                    auditLogs.data.map((log) => (
                                        <div key={log.id} className="border rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getActionBadge(log.action)}>
                                                        {formatAction(log.action)}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        by {log.user.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    {new Date(log.created_at).toLocaleString()}
                                                </div>
                                            </div>

                                            {log.notes && (
                                                <p className="text-sm mb-2">{log.notes}</p>
                                            )}

                                            {(log.old_values || log.new_values) && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    {log.old_values && (
                                                        <div>
                                                            <span className="font-medium text-muted-foreground">Before:</span>
                                                            <pre className="mt-1 p-2 bg-muted/30 rounded text-xs whitespace-pre-wrap break-words">
                                                                {JSON.stringify(log.old_values, null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}
                                                    {log.new_values && (
                                                        <div>
                                                            <span className="font-medium text-muted-foreground">After:</span>
                                                            <pre className="mt-1 p-2 bg-muted/50 rounded text-xs whitespace-pre-wrap break-words">
                                                                {JSON.stringify(log.new_values, null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {log.ip_address && (
                                                <div className="mt-2 text-xs text-muted-foreground">
                                                    IP: {log.ip_address}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {auditLogs.last_page > 1 && (
                                <div className="mt-6 flex justify-center gap-2">
                                    {Array.from({ length: auditLogs.last_page }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={route('projects.audit-logs.index', { 
                                                project: project.id, 
                                                page 
                                            })}
                                        >
                                            <Button
                                                variant={page === auditLogs.current_page ? 'default' : 'outline'}
                                                size="sm"
                                            >
                                                {page}
                                            </Button>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}