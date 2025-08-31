import { ReactNode } from 'react';

interface RoleBasedAccessProps {
    children: ReactNode;
    permissions?: string[];
    userPermissions?: string[];
    isOwner?: boolean;
    requireOwner?: boolean;
    fallback?: ReactNode;
}

export default function RoleBasedAccess({
    children,
    permissions = [],
    userPermissions = [],
    isOwner = false,
    requireOwner = false,
    fallback = null,
}: RoleBasedAccessProps) {
    // If owner access is required and user is not owner, deny access
    if (requireOwner && !isOwner) {
        return <>{fallback}</>;
    }

    // If user is owner, always grant access
    if (isOwner) {
        return <>{children}</>;
    }

    // Check if user has any of the required permissions
    const hasPermission = permissions.length === 0 || 
        permissions.some(permission => userPermissions.includes(permission));

    if (hasPermission) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}