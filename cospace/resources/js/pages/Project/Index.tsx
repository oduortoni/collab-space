import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';

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
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Index({ auth, projects }: ProjectsPageProps) {
    const { flash } = usePage<ProjectsPageProps>().props;

    const deleteProject = (id: number) => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(route('projects.destroy', id), {
                preserveScroll: true,
            });
        }
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

                    <div className="flex justify-end mb-4">
                        <Link
                            href={route('projects.create')}
                            className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                        >
                            Create Project
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Your Projects</h3>
                            {projects && projects.length > 0 ? (
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {projects.map((project) => (
                                        <li key={project.id} className="py-4 flex items-center justify-between">
                                            <div>
                                                <Link href={route('projects.show', project.id)} className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                                                    {project.title}
                                                </Link>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route('projects.edit', project.id)}
                                                    className="text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => deleteProject(project.id)}
                                                    className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>You don't have any projects yet. Create one!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
