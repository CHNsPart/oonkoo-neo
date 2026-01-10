import { User as PrismaUser } from '@prisma/client';
import { Role, Permission } from './permissions';

export type SerializedUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  role: Role;
  permissions: Permission[];
  isAdmin: boolean; // Kept for backward compatibility
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

export type User = PrismaUser;

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SerializedUser | null;
  isAdmin: boolean;
  // New permission helpers
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
  isSuperAdmin: boolean;
}

export interface DbUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  role: Role;
  permissions: Permission[];
  isAdmin: boolean; // Kept for backward compatibility
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export interface UserApiResponse {
  user: DbUser | null;
  isAuthenticated: boolean;
}
