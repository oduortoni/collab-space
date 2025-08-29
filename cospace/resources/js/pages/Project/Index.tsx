import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Eye, Pencil, Trash2 } from 'lucide-react';
import { DeleteProjectDialog } from '@/components/DeleteProjectDialog';

interface Project {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
}

interface ProjectsPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    projects: Project[];
    flash: {
        message?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Projects',
        href: '/projects',
    },
];

export default function Index({ projects }: ProjectsPageProps) {
    const { flash } = usePage<ProjectsPageProps>().props;

    const deleteProject = (id: number) => {
        router.delete(route('projects.destroy', id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{flash.message}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Your Projects</h1>
                        <Link href={route('projects.create')}>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Project
                            </Button>
                        </Link>
                    </div>

                    {projects && projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <Card key={project.id} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle>{project.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <CardDescription>{project.description}</CardDescription>
                                    </CardContent>
                                    <CardFooter className="flex justify-end gap-2">
                                        <Link href={route('projects.show', project.id)}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                        </Link>
                                        <Link href={route('projects.edit', project.id)}>
                                            <Button variant="secondary" size="sm">
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <DeleteProjectDialog onConfirm={() => deleteProject(project.id)}>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </DeleteProjectDialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-dashed border-2 border-border rounded-lg">
                            <h3 className="text-xl font-medium text-foreground">No projects yet!</h3>
                            <p className="text-muted-foreground mt-2 mb-6">Get started by creating your first project.</p>
                            <Link href={route('projects.create')}>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create Project
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
