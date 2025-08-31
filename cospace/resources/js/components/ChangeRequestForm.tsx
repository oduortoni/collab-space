import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';

interface Project {
    id: number;
    title: string;
    description: string;
    gif_url?: string;
    repo_url?: string;
    is_public: boolean;
}

interface ChangeRequestFormProps {
    project: Project;
    canEditDirectly: boolean;
}

export default function ChangeRequestForm({ project, canEditDirectly }: ChangeRequestFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        field_name: '',
        new_value: '',
        reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.change-requests.store', project.id), {
            onSuccess: () => reset(),
        });
    };

    const fieldOptions = [
        { value: 'title', label: 'Title', current: project.title },
        { value: 'description', label: 'Description', current: project.description },
        { value: 'gif_url', label: 'GIF URL', current: project.gif_url || '' },
        { value: 'repo_url', label: 'Repository URL', current: project.repo_url || '' },
        { value: 'is_public', label: 'Visibility', current: project.is_public ? 'Public' : 'Private' },
    ];

    const selectedField = fieldOptions.find(field => field.value === data.field_name);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {canEditDirectly ? 'Edit Project' : 'Request Changes'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="field_name">Field to Change</Label>
                        <Select value={data.field_name} onValueChange={(value) => setData('field_name', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select field to change" />
                            </SelectTrigger>
                            <SelectContent>
                                {fieldOptions.map((field) => (
                                    <SelectItem key={field.value} value={field.value}>
                                        {field.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.field_name && <p className="text-sm text-red-600">{errors.field_name}</p>}
                    </div>

                    {selectedField && (
                        <div>
                            <Label>Current Value</Label>
                            <div className="p-2 bg-gray-50 rounded border text-sm">
                                {selectedField.current || '(empty)'}
                            </div>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="new_value">New Value</Label>
                        {data.field_name === 'is_public' ? (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="visibility_change"
                                    onChange={(e) => setData('new_value', e.target.checked ? 'true' : 'false')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="visibility_change">
                                    Change to {project.is_public ? 'Private' : 'Public'}
                                </Label>
                            </div>
                        ) : data.field_name === 'description' ? (
                            <Textarea
                                id="new_value"
                                value={data.new_value}
                                onChange={(e) => setData('new_value', e.target.value)}
                                required
                            />
                        ) : (
                            <Input
                                id="new_value"
                                value={data.new_value}
                                onChange={(e) => setData('new_value', e.target.value)}
                                required
                            />
                        )}
                        {errors.new_value && <p className="text-sm text-red-600">{errors.new_value}</p>}
                    </div>

                    <div>
                        <Label htmlFor="reason">
                            {canEditDirectly ? 'Change Notes (Optional)' : 'Reason for Change'}
                        </Label>
                        <Textarea
                            id="reason"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            placeholder={canEditDirectly ? 'Optional notes about this change...' : 'Explain why this change is needed...'}
                            required={!canEditDirectly}
                        />
                        {errors.reason && <p className="text-sm text-red-600">{errors.reason}</p>}
                    </div>

                    <Button type="submit" disabled={processing} className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        {canEditDirectly ? 'Update Project' : 'Submit Change Request'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}