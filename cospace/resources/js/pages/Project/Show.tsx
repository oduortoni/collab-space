import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Projects',
        href: '/projects',
    },
    {
        title: 'Project Details',
        href: '#',
    },
];

export default function Show({ auth, project }: ShowPageProps) {
    const { flash } = usePage<ShowPageProps>().props;

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

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-gray-900 dark:text-gray-100">
                        <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
                        <p className="mb-4">{project.description}</p>
                        {project.gif_url && (
                            <div className="mb-4">
                                <img src={project.gif_url} alt={`${project.title} gif`} className="max-w-full rounded" />
                            </div>
                        )}
                        {project.repo_url && (
                            <p className="mb-4">
                                Repository: <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{project.repo_url}</a>
                            </p>
                        )}

                        <div className="flex space-x-4">
                            <Link
                                href={route('projects.edit', project.id)}
                                className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                            >
                                Edit
                            </Link>
                            <Link
                                href={route('projects.index')}
                                className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                            >
                                Back to Projects
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
