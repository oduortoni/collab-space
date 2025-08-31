import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Project {
    id: number;
    title: string;
    description: string;
    gif_url?: string;
    repo_url?: string;
    is_public: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface ProjectRole {
    id: number;
    name: string;
    display_name: string;
    description: string;
    permissions: string[];
}

export interface ProjectMember {
    id: number;
    user: User;
    role: ProjectRole;
    joined_at: string;
    invited_by: User;
}

export interface ProjectChangeRequest {
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

export interface ProjectAuditLog {
    id: number;
    action: string;
    old_values?: Record<string, unknown>;
    new_values?: Record<string, unknown>;
    notes?: string;
    user: User;
    created_at: string;
    ip_address?: string;
    user_agent?: string;
}
