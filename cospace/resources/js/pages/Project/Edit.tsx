import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

interface Project {
    id: number;
    title: string;
    description: string;
    gif_url?: string;
    repo_url?: string;
}

interface EditPageProps {
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
        title: 'Edit Project',
        href: '#',
    },
];

export default function Edit({ auth, project }: EditPageProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: project.title || '',
        description: project.description || '',
        gif_url: project.gif_url || '',
        repo_url: project.repo_url || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('projects.update', project.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Project" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Edit Project</h3>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
                                </div>

                                <div>
                                    <label htmlFor="gif_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        GIF URL
                                    </label>
                                    <input
                                        type="url"
                                        id="gif_url"
                                        value={data.gif_url}
                                        onChange={(e) => setData('gif_url', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.gif_url && <div className="text-red-600 text-sm mt-1">{errors.gif_url}</div>}
                                </div>

                                <div>
                                    <label htmlFor="repo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Repository URL
                                    </label>
                                    <input
                                        type="url"
                                        id="repo_url"
                                        value={data.repo_url}
                                        onChange={(e) => setData('repo_url', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                    {errors.repo_url && <div className="text-red-600 text-sm mt-1">{errors.repo_url}</div>}
                                </div>

                                <div className="flex items-center justify-end space-x-3">
                                    <Link
                                        href={route('projects.show', project.id)}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        {processing ? 'Updating...' : 'Update Project'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
