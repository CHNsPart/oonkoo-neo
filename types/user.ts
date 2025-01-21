export type SerializedUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  isAdmin: boolean;
  roles: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

import { User as PrismaUser } from '@prisma/client';

export type User = PrismaUser;

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SerializedUser | null;
  isAdmin: boolean;
}

export interface DbUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  isAdmin: boolean;
  roles: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export interface UserApiResponse {
  user: DbUser | null;
  isAuthenticated: boolean;
}