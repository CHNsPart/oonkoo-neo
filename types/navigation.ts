import { LucideIcon } from 'lucide-react';
import { Permission, Role } from './permissions';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  requiresAuth?: boolean;
  // New permission-based filtering (replaces requiresAdmin)
  requiredPermission?: Permission;
  requiredRole?: Role;
  /** @deprecated Use requiredPermission or requiredRole instead */
  requiresAdmin?: boolean;
}
