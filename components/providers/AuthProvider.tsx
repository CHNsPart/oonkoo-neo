// components/providers/AuthProvider.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import type { AuthContextType, SerializedUser } from "@/types/user";

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

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const { isAuthenticated, isLoading: kindeLoading } = useKindeAuth();
  const [user, setUser] = useState<SerializedUser | null>(initialUser ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialUser);

  useEffect(() => {
    let isMounted = true;
    
    async function syncUser() {
      if (isAuthenticated && !user) {
        try {
          setIsLoading(true);
          
          // First sync with database
          const syncResponse = await fetch('/api/user/db-sync', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (!syncResponse.ok) {
            throw new Error('Failed to sync user with database');
          }

          // Then get updated user data
          const userResponse = await fetch('/api/user', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
          }

          const data = await userResponse.json();
          
          // Set user state if component is still mounted and data exists
          if (data.user && isMounted) {
            const userData = data.user as SerializedUser;
            setUser(userData);
          }
        } catch (error) {
          console.error('Auth sync failed:', error);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else if (!isAuthenticated && user) {
        // Reset user state when not authenticated
        setUser(null);
      }
    }
    
    syncUser();
    return () => { isMounted = false; };
  }, [isAuthenticated, user]);

  // Determine admin status
  const isAdmin = Boolean(
    user?.isAdmin || 
    user?.email === ADMIN_EMAIL || 
    initialUser?.isAdmin || 
    initialUser?.email === ADMIN_EMAIL
  );

  // Context value with memoized isAdmin
  const value: AuthContextType = {
    isAuthenticated: !!isAuthenticated,
    isLoading: isLoading || !!kindeLoading,
    user: user || initialUser || null,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};