import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Check, X } from 'lucide-react';

interface Project {
    id: number;
    title: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface ChangeRequest {
    id: number;
    field_name: string;
    old_value: string;
    new_value: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    requester: User;
    reviewer?: User;
    created_at: string;
    reviewed_at?: string;
    review_notes?: string;
}

interface ChangeRequestsPageProps {
    project: Project;
    changeRequests?: ChangeRequest[];
    flash?: { message?: string };
}

export default function Index({ project, changeRequests = [] }: ChangeRequestsPageProps) {
    const { flash } = usePage<ChangeRequestsPageProps>().props;
    const flashMessage = flash?.message;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Projects', href: route('projects.index') },
        { title: project.title, href: route('projects.show', project.id) },
        { title: 'Change Requests', href: route('projects.change-requests.index', project.id) },
    ];

    const approveRequest = (requestId: number, notes?: string) => {
        router.post(route('projects.change-requests.approve', [project.id, requestId]), {
            notes: notes || ''
        });
    };

    const rejectRequest = (requestId: number, notes?: string) => {
        router.post(route('projects.change-requests.reject', [project.id, requestId]), {
            notes: notes || ''
        });
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return variants[status as keyof typeof variants] || variants.pending;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${project.title} - Change Requests`} />

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
                            <CardTitle>Change Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {changeRequests.length === 0 ? (
                                    <p className="text-muted-foreground">No change requests found.</p>
                                ) : (
                                    changeRequests.map((request) => (
                                        <div key={request.id} className="border rounded-lg p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="font-medium">
                                                        Change to {request.field_name.replace('_', ' ')}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Requested by {request.requester.name} on{' '}
                                                        {new Date(request.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge className={getStatusBadge(request.status)}>
                                                    {request.status}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <span className="text-sm font-medium text-muted-foreground">From:</span>
                                                    <p className="mt-1 p-2 bg-muted/30 rounded border break-words">{request.old_value}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-muted-foreground">To:</span>
                                                    <p className="mt-1 p-2 bg-muted/50 rounded border break-words">{request.new_value}</p>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <span className="text-sm font-medium text-muted-foreground">Reason:</span>
                                                <p className="mt-1">{request.reason}</p>
                                            </div>

                                            {request.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => approveRequest(request.id)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => rejectRequest(request.id)}
                                                    >
                                                        <X className="mr-2 h-4 w-4" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}

                                            {request.review_notes && (
                                                <div className="mt-4 p-3 bg-gray-50 rounded">
                                                    <span className="text-sm font-medium">Review Notes:</span>
                                                    <p className="text-sm mt-1">{request.review_notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}