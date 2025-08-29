import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Github } from 'lucide-react';

interface Project {
    id: number;
    title: string;
    description: string;
    gif_url?: string;
    repo_url?: string;
    created_at: string;
    updated_at: string;
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
    [key: string]: any;
}

export default function Show({ auth, project }: ShowPageProps) {
    const { flash } = usePage<ShowPageProps>().props;
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
                                            <img src={project.gif_url} alt={`${project.title} gif`} className="max-w-full rounded-lg shadow-lg" />
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
                                    {project.repo_url && (
                                        <Button asChild variant="outline">
                                            <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                                                <Github className="mr-2 h-4 w-4" />
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
