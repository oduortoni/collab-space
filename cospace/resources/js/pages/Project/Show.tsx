import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, GitBranch, Users, FileText, History } from 'lucide-react';
import { getImageUrl } from '@/lib/google-drive-utils';

interface Project {
    id: number;
    title: string;
    description: string;
    gif_url?: string;
    repo_url?: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    user_id: number;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface ProjectMember {
    id: number;
    user: User;
    role: {
        name: string;
        display_name: string;
        permissions: string[];
    };
}

interface ShowPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    project: Project;
    members?: ProjectMember[];
    userRole?: {
        name: string;
        display_name: string;
        permissions: string[];
    };
    flash: {
        message?: string;
    };
    [key: string]: unknown;
}

export default function Show({ project }: ShowPageProps) {
    const { flash, auth, userRole } = usePage<ShowPageProps>().props;
    
    const isOwner = project.user_id === auth.user.id;
    const canManageMembers = isOwner || userRole?.permissions?.includes('manage_members');
    const canViewAuditLogs = isOwner || userRole?.permissions?.includes('view_audit_logs');
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Projects',
            href: route('projects.index'),
        },
        {
            title: project.title,
            href: route('projects.show', project.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{flash.message}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-3xl font-bold">{project.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-lg">{project.description}</CardDescription>
                                    {project.gif_url && (
                                        <div className="mt-6">
                                            <img 
                                                src={getImageUrl(project.gif_url)} 
                                                alt={`${project.title} gif`} 
                                                className="max-w-full rounded-lg shadow-lg" 
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Project Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-muted-foreground">Created At</span>
                                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                                        <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-muted-foreground">Visibility</span>
                                        <span className={`inline-flex items-center justify-center my-2.5 px-1.5 py-2.5 rounded-full text-sm font-medium ${
                                            project.is_public 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {project.is_public ? 'Public' : 'Private'}
                                        </span>
                                    </div>
                                    {project.repo_url && (
                                        <Button asChild variant="outline">
                                            <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                                                <GitBranch className="mr-2 h-4 w-4" />
                                                View on GitHub
                                            </a>
                                        </Button>
                                    )}
                                    <div className="flex flex-col gap-2 pt-4">
                                        <Link href={route('projects.edit', project.id)}>
                                            <Button className="w-full">
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit Project
                                            </Button>
                                        </Link>
                                        
                                        {canManageMembers && (
                                            <Link href={route('projects.members.index', project.id)}>
                                                <Button variant="outline" className="w-full">
                                                    <Users className="mr-2 h-4 w-4" />
                                                    Manage Members
                                                </Button>
                                            </Link>
                                        )}
                                        
                                        <Link href={route('projects.change-requests.index', project.id)}>
                                            <Button variant="outline" className="w-full">
                                                <FileText className="mr-2 h-4 w-4" />
                                                Change Requests
                                            </Button>
                                        </Link>
                                        
                                        {canViewAuditLogs && (
                                            <Link href={route('projects.audit-logs.index', project.id)}>
                                                <Button variant="outline" className="w-full">
                                                    <History className="mr-2 h-4 w-4" />
                                                    Audit Logs
                                                </Button>
                                            </Link>
                                        )}
                                        
                                        <Link href={route('projects.index')}>
                                            <Button variant="outline" className="w-full">
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Back to Projects
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
