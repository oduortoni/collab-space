import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, X, Eye, EyeOff } from 'lucide-react';
import { getImageUrl, isGoogleDriveUrl } from '@/lib/google-drive-utils';

interface Project {
    id: number;
    title: string;
    description: string;
    gif_url?: string;
    repo_url?: string;
    is_public: boolean;
}

interface EditPageProps {
    project: Project;
}

export default function Edit({ project }: EditPageProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: project.title || '',
        description: project.description || '',
        gif_url: project.gif_url || '',
        repo_url: project.repo_url || '',
        is_public: project.is_public || false,
    });

    const [clientErrors, setClientErrors] = React.useState<{
        gif_url?: string;
        repo_url?: string;
    }>({});
    const [showPreview, setShowPreview] = React.useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Projects',
            href: route('projects.index'),
        },
        {
            title: project.title,
            href: route('projects.show', project.id),
        },
        {
            title: 'Edit',
            href: route('projects.edit', project.id),
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
        put(route('projects.update', project.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${project.title}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Project</CardTitle>
                                <CardDescription>Update the details of your project below.</CardDescription>
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
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="gif_url">GIF URL</Label>
                                        {data.gif_url && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowPreview(!showPreview)}
                                                className="text-xs"
                                            >
                                                {showPreview ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                                                {showPreview ? 'Hide Preview' : 'Show Preview'}
                                            </Button>
                                        )}
                                    </div>
                                    <Input
                                        type="url"
                                        id="gif_url"
                                        value={data.gif_url}
                                        onChange={(e) => {
                                            setData('gif_url', e.target.value);
                                            if (clientErrors.gif_url) {
                                                setClientErrors({...clientErrors, gif_url: undefined});
                                            }
                                            setShowPreview(false);
                                        }}
                                        placeholder="https://example.com/demo.gif or Google Drive link"
                                    />
                                    {clientErrors.gif_url && <div className="text-destructive text-sm mt-1">{clientErrors.gif_url}</div>}
                                    {errors.gif_url && <div className="text-destructive text-sm mt-1">{errors.gif_url}</div>}
                                    {showPreview && data.gif_url && (
                                        <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                                            <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
                                            <img
                                                src={getImageUrl(data.gif_url)}
                                                alt="Preview"
                                                className="max-w-full max-h-64 rounded-lg shadow-lg"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                            {isGoogleDriveUrl(data.gif_url) && (
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Google Drive image detected
                                                </p>
                                            )}
                                        </div>
                                    )}
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

                                <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="is_public"
                                            checked={data.is_public}
                                            onChange={(e) => setData('is_public', Boolean(e.target.checked))}
                                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <Label htmlFor="is_public" className="cursor-pointer text-base font-medium">
                                            {data.is_public ? 'Make project private' : 'Make project public'}
                                        </Label>
                                    </div>
                                    <p className="text-sm text-muted-foreground ml-8">
                                        {data.is_public 
                                            ? 'Public projects can be viewed by anyone, even without an account.'
                                            : 'Private projects can only be viewed by you.'
                                        }
                                    </p>
                                    {errors.is_public && <div className="text-destructive text-sm mt-1 ml-8">{errors.is_public}</div>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Link href={route('projects.show', project.id)}>
                                    <Button variant="outline">
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Updating...' : 'Update Project'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
