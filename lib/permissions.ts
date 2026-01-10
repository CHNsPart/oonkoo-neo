import { prisma } from '@/lib/prisma';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';
import {
  Role,
  Permission,
  ROLE_PERMISSIONS,
  SUPER_ADMIN_EMAIL,
  isAtLeastRole,
} from '@/types/permissions';

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userPermissions: readonly Permission[] | Permission[],
  requiredPermission: Permission
): boolean {
  return userPermissions.includes(requiredPermission);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  userPermissions: readonly Permission[] | Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some(p => userPermissions.includes(p));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  userPermissions: readonly Permission[] | Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every(p => userPermissions.includes(p));
}

/**
 * Check if a user has a minimum role level
 */
export function hasMinimumRole(userRole: Role, minimumRole: Role): boolean {
  return isAtLeastRole(userRole, minimumRole);
}

/**
 * Check if user is super admin by email
 */
export function isSuperAdmin(email: string | null | undefined): boolean {
  return email === SUPER_ADMIN_EMAIL;
}

/**
 * Get effective permissions for a user (combines role defaults + custom permissions)
 */
export function getEffectivePermissions(
  role: Role,
  customPermissions?: readonly Permission[] | Permission[] | null
): Permission[] {
  const rolePermissions = [...ROLE_PERMISSIONS[role]];

  if (!customPermissions || customPermissions.length === 0) {
    return rolePermissions;
  }

  // Merge and deduplicate
  const merged = new Set([...rolePermissions, ...customPermissions]);
  return Array.from(merged) as Permission[];
}

/**
 * Determine data access scope based on role and permissions
 */
export type DataScope = 'all' | 'own';

export function getDataScope(
  role: Role,
  permissions: readonly Permission[] | Permission[]
): DataScope {
  // ADMIN and SUPER_ADMIN can see all data
  if (isAtLeastRole(role, 'ADMIN')) {
    return 'all';
  }

  // Users with VIEW_ANALYTICS can see aggregated data (but handled separately)
  // For resource listing, check specific manage permissions
  if (
    hasPermission(permissions, 'MANAGE_CLIENTS') ||
    hasPermission(permissions, 'MANAGE_LEADS') ||
    hasPermission(permissions, 'MANAGE_INQUIRIES') ||
    hasPermission(permissions, 'MANAGE_PROJECTS') ||
    hasPermission(permissions, 'MANAGE_SERVICES')
  ) {
    return 'all';
  }

  return 'own';
}

/**
 * Check if a user can modify another user's role/permissions
 */
export function canModifyUserPermissions(
  modifierEmail: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  targetUserId?: string
): boolean {
  // Only SUPER_ADMIN can modify user permissions
  // Note: targetUserId reserved for future use (e.g., preventing self-demotion)
  return isSuperAdmin(modifierEmail);
}

/**
 * Check if a role can be assigned by the current user
 */
export function canAssignRole(
  assignerEmail: string | null | undefined,
  targetRole: Role
): boolean {
  // Only SUPER_ADMIN can assign roles
  if (!isSuperAdmin(assignerEmail)) {
    return false;
  }

  // Cannot assign SUPER_ADMIN role to anyone (it's reserved for the hardcoded email)
  if (targetRole === 'SUPER_ADMIN') {
    return false;
  }

  return true;
}

/**
 * Get the authenticated user with their permissions from the database
 */
export async function getAuthenticatedUser() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: kindeUser.email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      permissions: true,
      isAdmin: true,
    },
  });

  if (!user) {
    return null;
  }

  const effectivePermissions = getEffectivePermissions(
    user.role as Role,
    user.permissions as Permission[]
  );

  return {
    ...user,
    role: user.role as Role,
    permissions: effectivePermissions,
    kindeUser,
  };
}

/**
 * Authorization context type for API handlers
 */
export interface AuthContext {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: Role;
  permissions: Permission[];
  isAdmin: boolean;
}

/**
 * Server-side authorization wrapper for API routes
 * Checks if the user has the required permission before executing the handler
 */
export async function withAuthorization<T>(
  requiredPermission: Permission,
  handler: (user: AuthContext) => Promise<NextResponse<T>>
): Promise<NextResponse<T | { error: string }>> {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: kindeUser.email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      permissions: true,
      isAdmin: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const effectivePermissions = getEffectivePermissions(
    user.role as Role,
    user.permissions as Permission[]
  );

  if (!hasPermission(effectivePermissions, requiredPermission)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return handler({
    ...user,
    role: user.role as Role,
    permissions: effectivePermissions,
  });
}

/**
 * Server-side authorization wrapper that allows multiple permissions (OR logic)
 */
export async function withAnyAuthorization<T>(
  requiredPermissions: Permission[],
  handler: (user: AuthContext) => Promise<NextResponse<T>>
): Promise<NextResponse<T | { error: string }>> {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: kindeUser.email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      permissions: true,
      isAdmin: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const effectivePermissions = getEffectivePermissions(
    user.role as Role,
    user.permissions as Permission[]
  );

  if (!hasAnyPermission(effectivePermissions, requiredPermissions)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return handler({
    ...user,
    role: user.role as Role,
    permissions: effectivePermissions,
  });
}

/**
 * Server-side authorization wrapper for SUPER_ADMIN only operations
 */
export async function withSuperAdminAuthorization<T>(
  handler: (user: AuthContext) => Promise<NextResponse<T>>
): Promise<NextResponse<T | { error: string }>> {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSuperAdmin(kindeUser.email)) {
    return NextResponse.json(
      { error: 'Only Super Admin can perform this action' },
      { status: 403 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: kindeUser.email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      permissions: true,
      isAdmin: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const effectivePermissions = getEffectivePermissions(
    user.role as Role,
    user.permissions as Permission[]
  );

  return handler({
    ...user,
    role: user.role as Role,
    permissions: effectivePermissions,
  });
}

/**
 * Check if user can access a specific resource (owner or has permission)
 */
export async function canAccessResource(
  userEmail: string,
  resourceOwnerId: string | null,
  requiredPermission: Permission
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true, role: true, permissions: true },
  });

  if (!user) return false;

  const effectivePermissions = getEffectivePermissions(
    user.role as Role,
    user.permissions as Permission[]
  );

  // Has direct permission to manage all resources
  if (hasPermission(effectivePermissions, requiredPermission)) {
    return true;
  }

  // Is the owner of the resource
  if (resourceOwnerId && user.id === resourceOwnerId) {
    return true;
  }

  return false;
}
