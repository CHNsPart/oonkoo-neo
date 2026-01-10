"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Role,
  Permission,
  ROLE_PERMISSIONS,
  SUPER_ADMIN_EMAIL,
  isAtLeastRole,
} from "@/types/permissions";

interface UserPermissions {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: Role;
  permissions: Permission[];
  isAdmin: boolean;
}

interface UsePermissionsReturn {
  user: UserPermissions | null;
  loading: boolean;
  error: Error | null;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasRole: (role: Role) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  refetch: () => Promise<void>;
}

/**
 * Get effective permissions by merging role defaults with custom permissions
 */
function getEffectivePermissions(
  role: Role,
  customPermissions?: Permission[] | null
): Permission[] {
  const rolePermissions = [...ROLE_PERMISSIONS[role]];

  if (!customPermissions || customPermissions.length === 0) {
    return rolePermissions;
  }

  const merged = new Set([...rolePermissions, ...customPermissions]);
  return Array.from(merged) as Permission[];
}

/**
 * Hook to manage user permissions on the client side
 * Fetches user data from /api/user and provides permission checking utilities
 */
export function usePermissions(): UsePermissionsReturn {
  const [user, setUser] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user");

      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated - this is expected for logged out users
          setUser(null);
          return;
        }
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.user) {
        const effectivePermissions = getEffectivePermissions(
          data.user.role as Role,
          data.user.permissions as Permission[]
        );

        setUser({
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: data.user.role as Role,
          permissions: effectivePermissions,
          isAdmin: data.user.isAdmin,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching user permissions:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      return user.permissions.includes(permission);
    },
    [user]
  );

  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      if (!user) return false;
      return permissions.some((p) => user.permissions.includes(p));
    },
    [user]
  );

  const hasRole = useCallback(
    (role: Role): boolean => {
      if (!user) return false;
      return isAtLeastRole(user.role, role);
    },
    [user]
  );

  const isSuperAdmin = useMemo(() => {
    if (!user) return false;
    return user.email === SUPER_ADMIN_EMAIL || user.role === "SUPER_ADMIN";
  }, [user]);

  const isAdmin = useMemo(() => {
    if (!user) return false;
    return isAtLeastRole(user.role, "ADMIN");
  }, [user]);

  return {
    user,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasRole,
    isSuperAdmin,
    isAdmin,
    refetch: fetchUser,
  };
}

/**
 * Hook to check a single permission
 * Useful for conditional rendering
 */
export function useHasPermission(permission: Permission): boolean {
  const { hasPermission, loading } = usePermissions();

  if (loading) return false;
  return hasPermission(permission);
}

/**
 * Hook to check if user has admin role
 */
export function useIsAdmin(): { isAdmin: boolean; loading: boolean } {
  const { isAdmin, loading } = usePermissions();
  return { isAdmin, loading };
}

/**
 * Hook to check if user is super admin
 */
export function useIsSuperAdmin(): { isSuperAdmin: boolean; loading: boolean } {
  const { isSuperAdmin, loading } = usePermissions();
  return { isSuperAdmin, loading };
}
