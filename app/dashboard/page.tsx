// app/dashboard/page.tsx
'use client';

import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import UserDashboard from "@/components/dashboard/user-dashboard";
import { useAuth } from "@/components/providers";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { isAuthenticated, user: kindeUser } = useKindeAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isAdmin = user?.email === "imchn24@gmail.com";

  if (!isAuthenticated) {
    return null;
  }

  const displayName = user?.firstName || kindeUser?.given_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-primary">
        👋 <span className="text-gray-500/50">Welcome back,</span>{' '}
        {displayName}
      </h1>
      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}