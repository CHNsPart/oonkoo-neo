// Role hierarchy (higher index = more privileges)
export const ROLES = ['VIEWER', 'CLIENT', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] as const;
export type Role = (typeof ROLES)[number];

// All available permissions
export const PERMISSIONS = [
  'MANAGE_USERS',
  'MANAGE_CLIENTS',
  'MANAGE_LEADS',
  'MANAGE_INQUIRIES',
  'MANAGE_SALES',
  'MANAGE_PROJECTS',
  'MANAGE_SERVICES',
  'VIEW_ANALYTICS',
  'VIEW_OWN_DATA',
] as const;
export type Permission = (typeof PERMISSIONS)[number];

// Super admin email constant - the only user who can manage roles/permissions
export const SUPER_ADMIN_EMAIL = 'imchn24@gmail.com';

// Default permissions per role
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  SUPER_ADMIN: PERMISSIONS, // All permissions
  ADMIN: PERMISSIONS.filter(p => p !== 'MANAGE_USERS'),
  MANAGER: ['VIEW_ANALYTICS', 'VIEW_OWN_DATA'],
  CLIENT: ['VIEW_OWN_DATA'],
  VIEWER: ['VIEW_OWN_DATA'],
};

// Role display names
export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  CLIENT: 'Client',
  VIEWER: 'Viewer',
};

// Role descriptions for UI
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  SUPER_ADMIN: 'Full system access including user management',
  ADMIN: 'Full access to all resources except user management',
  MANAGER: 'View analytics and manage assigned resources',
  CLIENT: 'Access to own projects and services',
  VIEWER: 'Read-only access to own data',
};

// Permission display names and descriptions
export const PERMISSION_INFO: Record<Permission, { label: string; description: string }> = {
  MANAGE_USERS: {
    label: 'User Management',
    description: 'Assign roles and permissions to users (Super Admin only)',
  },
  MANAGE_CLIENTS: {
    label: 'Manage Clients',
    description: 'Create, edit, and delete client records',
  },
  MANAGE_LEADS: {
    label: 'Manage Leads',
    description: 'Create, edit, and delete lead records',
  },
  MANAGE_INQUIRIES: {
    label: 'Manage Inquiries',
    description: 'Handle project and sale inquiries',
  },
  MANAGE_SALES: {
    label: 'Manage Sales',
    description: 'Create and manage sale records',
  },
  MANAGE_PROJECTS: {
    label: 'Manage Projects',
    description: 'Create, edit, and delete all projects',
  },
  MANAGE_SERVICES: {
    label: 'Manage Services',
    description: 'Create, edit, and delete all services',
  },
  VIEW_ANALYTICS: {
    label: 'View Analytics',
    description: 'Access dashboard analytics and reports',
  },
  VIEW_OWN_DATA: {
    label: 'View Own Data',
    description: 'View personal projects and services',
  },
};

// Permission groups for UI organization
export const PERMISSION_GROUPS = {
  'User Management': ['MANAGE_USERS'] as Permission[],
  'Data Management': [
    'MANAGE_CLIENTS',
    'MANAGE_LEADS',
    'MANAGE_INQUIRIES',
    'MANAGE_SALES',
    'MANAGE_PROJECTS',
    'MANAGE_SERVICES',
  ] as Permission[],
  'View Access': ['VIEW_ANALYTICS', 'VIEW_OWN_DATA'] as Permission[],
};

// Helper to check if a permission is assignable by role
export function canAssignPermission(assignerRole: Role, permission: Permission): boolean {
  // Only SUPER_ADMIN can assign MANAGE_USERS
  if (permission === 'MANAGE_USERS') {
    return assignerRole === 'SUPER_ADMIN';
  }
  // SUPER_ADMIN can assign any permission
  return assignerRole === 'SUPER_ADMIN';
}

// Helper to get role level for comparison
export function getRoleLevel(role: Role): number {
  return ROLES.indexOf(role);
}

// Helper to check if role A is higher than role B
export function isHigherRole(roleA: Role, roleB: Role): boolean {
  return getRoleLevel(roleA) > getRoleLevel(roleB);
}

// Helper to check if role A is at least role B
export function isAtLeastRole(roleA: Role, roleB: Role): boolean {
  return getRoleLevel(roleA) >= getRoleLevel(roleB);
}
