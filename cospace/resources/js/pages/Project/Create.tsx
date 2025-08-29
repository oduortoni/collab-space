import React from 'react';
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

    const [clientErrors, setClientErrors] = React.useState<{
        gif_url?: string;
        repo_url?: string;
    }>({});

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

    const validateUrl = (url: string, type: 'image' | 'github'): string | null => {
        if (!url) return null;
        try {
            const parsedUrl = new URL(url);
            if (type === 'image') {
                // Check if this is a Google Drive URL
                const isGoogleDrive = url.includes('drive.google.com/file/d/');
                if (!isGoogleDrive) {
                    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
                    const ext = parsedUrl.pathname.split('.').pop()?.toLowerCase();
                    if (!ext || !validExtensions.includes(ext)) {
                        return 'Please enter a valid image URL (jpg, jpeg, png, gif, webp, svg) or Google Drive link.';
                    }
                }
            } else if (type === 'github') {
                const githubPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/;
                if (!githubPattern.test(url)) {
                    return 'Please enter a valid GitHub repository URL.';
                }
            }
            return null;
        } catch {
            return 'Please enter a valid URL.';
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const gifUrlError = validateUrl(data.gif_url, 'image');
        const repoUrlError = validateUrl(data.repo_url, 'github');

        if (gifUrlError || repoUrlError) {
            // Set client-side errors and prevent submission
            setClientErrors({
                gif_url: gifUrlError || undefined,
                repo_url: repoUrlError || undefined,
            });
            return;
        }

        // Clear client errors and submit
        setClientErrors({});
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
                                        onChange={(e) => {
                                            setData('gif_url', e.target.value);
                                            // Clear client error when user starts typing
                                            if (clientErrors.gif_url) {
                                                setClientErrors({...clientErrors, gif_url: undefined});
                                            }
                                        }}
                                        placeholder="https://example.com/demo.gif"
                                    />
                                    {clientErrors.gif_url && <div className="text-destructive text-sm mt-1">{clientErrors.gif_url}</div>}
                                    {errors.gif_url && <div className="text-destructive text-sm mt-1">{errors.gif_url}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="repo_url">Repository URL</Label>
                                    <Input
                                        type="url"
                                        id="repo_url"
                                        value={data.repo_url}
                                        onChange={(e) => {
                                            setData('repo_url', e.target.value);
                                            // Clear client error when user starts typing
                                            if (clientErrors.repo_url) {
                                                setClientErrors({...clientErrors, repo_url: undefined});
                                            }
                                        }}
                                        placeholder="https://github.com/username/project"
                                    />
                                    {clientErrors.repo_url && <div className="text-destructive text-sm mt-1">{clientErrors.repo_url}</div>}
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
