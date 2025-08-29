import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        gif_url: '',
        repo_url: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Projects',
            href: route('projects.index'),
        },
        {
            title: 'Create',
            href: route('projects.create'),
        },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Project" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Create New Project</CardTitle>
                                <CardDescription>Fill out the form below to create a new project.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <div className="text-destructive text-sm mt-1">{errors.title}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                    />
                                    {errors.description && <div className="text-destructive text-sm mt-1">{errors.description}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gif_url">GIF URL</Label>
                                    <Input
                                        type="url"
                                        id="gif_url"
                                        value={data.gif_url}
                                        onChange={(e) => setData('gif_url', e.target.value)}
                                        placeholder="https://example.com/demo.gif"
                                    />
                                    {errors.gif_url && <div className="text-destructive text-sm mt-1">{errors.gif_url}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="repo_url">Repository URL</Label>
                                    <Input
                                        type="url"
                                        id="repo_url"
                                        value={data.repo_url}
                                        onChange={(e) => setData('repo_url', e.target.value)}
                                        placeholder="https://github.com/username/project"
                                    />
                                    {errors.repo_url && <div className="text-destructive text-sm mt-1">{errors.repo_url}</div>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Link href={route('projects.index')}>
                                    <Button variant="outline">
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Creating...' : 'Create Project'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
