"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import type { AuthContextType, SerializedUser } from "@/types/user";
import { KindeProvider } from "./KindeProvider";

const ADMIN_EMAIL = "imchn24@gmail.com";

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  isAdmin: false
});

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: SerializedUser | null;
}

function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const { isAuthenticated, isLoading: kindeLoading } = useKindeAuth();
  const [user, setUser] = useState<SerializedUser | null>(initialUser ?? null);
  const [isLoading, setIsLoading] = useState(!initialUser);

  useEffect(() => {
    let mounted = true;

    async function syncUser() {
      if (isAuthenticated && (!user || !user.id)) {
        try {
          setIsLoading(true);
          const [syncRes, userRes] = await Promise.all([
            fetch('/api/user/db-sync'),
            fetch('/api/user')
          ]);

          if (!syncRes.ok || !userRes.ok) throw new Error('Failed to sync user');

          const userData = await userRes.json();
          
          if (mounted && userData.user) {
            setUser(userData.user as SerializedUser);
          }
        } catch (error) {
          console.error('Auth sync failed:', error);
        } finally {
          if (mounted) setIsLoading(false);
        }
      }
    }

    syncUser();
    return () => { mounted = false; };
  }, [isAuthenticated, user]);

  const value: AuthContextType = {
    isAuthenticated: !!isAuthenticated,
    isLoading: isLoading || (kindeLoading ?? false),
    user,
    isAdmin: user?.isAdmin || user?.email === ADMIN_EMAIL
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function Providers({ children, initialUser }: AuthProviderProps) {
  return (
    <KindeProvider>
      <AuthProvider initialUser={initialUser}>
        {children}
      </AuthProvider>
    </KindeProvider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};