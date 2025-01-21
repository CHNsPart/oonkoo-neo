// components/dashboard/server-layouts/layout-client.tsx
'use client';

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useAuth } from "@/components/providers";
import type { SerializedUser } from "@/types/user";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  initialUser?: SerializedUser | null;
}

export function DashboardLayoutClient({ 
  children, 
}: DashboardLayoutClientProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] mt-16">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto border-white/10 border-y">
        <div className="min-h-full p-8">
          {children}
        </div>
      </main>
    </div>
  );
}