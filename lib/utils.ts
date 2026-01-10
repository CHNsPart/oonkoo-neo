import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { User } from "@prisma/client";
import { SerializedUser } from "@/types/user";
import { Role, Permission, ROLE_PERMISSIONS } from "@/types/permissions";

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

export function serializeUser(user: User | null): SerializedUser | null {
  if (!user) return null;

  const effectivePermissions = getEffectivePermissions(
    user.role as Role,
    user.permissions as Permission[]
  );

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImage: user.profileImage,
    role: user.role as Role,
    permissions: effectivePermissions,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
  };
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}


const CAD_RATE = 1.44;

export type Currency = 'USD' | 'CAD';

export const convertToCAD = (usdAmount: number): number => {
  return Number((usdAmount * CAD_RATE).toFixed(2));
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  return currency === 'CAD' 
    ? `CAD $${convertToCAD(amount).toLocaleString()}`
    : `USD $${amount.toLocaleString()}`;
};