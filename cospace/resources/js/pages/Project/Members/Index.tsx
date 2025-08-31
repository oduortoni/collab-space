import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, UserPlus, Trash2 } from 'lucide-react';

interface Project {
    id: number;
    title: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface ProjectRole {
    id: number;
    name: string;
    display_name: string;
    description: string;
}

interface ProjectMember {
    id: number;
    user: User;
    role: ProjectRole;
    joined_at: string;
}

interface MembersPageProps {
    project: Project;
    members?: ProjectMember[];
    roles?: ProjectRole[];
    flash?: { message?: string };
}

export default function Index({ project, members = [], roles = [] }: MembersPageProps) {
    const { flash } = usePage<MembersPageProps>().props;
    const flashMessage = flash?.message;
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        role_id: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Projects', href: route('projects.index') },
        { title: project.title, href: route('projects.show', project.id) },
        { title: 'Members', href: route('projects.members.index', project.id) },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.members.store', project.id), {
            onSuccess: () => reset(),
        });
    };

    const removeMember = (memberId: number) => {
        if (confirm('Are you sure you want to remove this member?')) {
            router.delete(route('projects.members.destroy', [project.id, memberId]));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${project.title} - Members`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flashMessage && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            {flashMessage}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Project Members</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {members.map((member) => (
                                            <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <h3 className="font-medium">{member.user.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {member.role.display_name}
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeMember(member.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Invite Member</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="role">Role</Label>
                                            <Select value={data.role_id} onValueChange={(value) => setData('role_id', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.id.toString()}>
                                                            {role.display_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.role_id && <p className="text-sm text-red-600">{errors.role_id}</p>}
                                        </div>

                                        <Button type="submit" disabled={processing} className="w-full">
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Invite Member
                                        </Button>
                                    </form>

                                    <div className="mt-6">
                                        <Link href={route('projects.show', project.id)}>
                                            <Button variant="outline" className="w-full">
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Back to Project
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