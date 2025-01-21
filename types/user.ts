import { User as PrismaUser } from '@prisma/client';

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

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SerializedUser | null;
  isAdmin: boolean;
}