// app/dashboard/page.tsx
"use client";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import UserDashboard from "@/components/dashboard/user-dashboard";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { usePermissions } from "@/hooks/use-permissions";
import { ROLE_LABELS } from "@/types/permissions";

export default function DashboardPage() {
  const { isAuthenticated, user } = useKindeAuth();
  const { user: permUser, loading, hasPermission, error } = usePermissions();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/70">Please log in to access the dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-white/50">Loading user data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
        <p className="font-medium">Error loading user data</p>
        <p className="text-sm mt-1">Please try refreshing the page or logging in again.</p>
      </div>
    );
  }

  if (!permUser) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
        <p className="font-medium">User data not found in database.</p>
        <p className="text-sm mt-1">Email: {user?.email}</p>
        <p className="text-sm mt-1">Please try logging out and logging in again.</p>
      </div>
    );
  }

  // Show admin dashboard if user has VIEW_ANALYTICS permission
  const showAdminDashboard = hasPermission("VIEW_ANALYTICS");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-primary">
          <span className="text-gray-500/50">Welcome back,</span>{" "}
          {permUser.firstName || user?.given_name || "User"}
        </h1>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            permUser.role === "SUPER_ADMIN"
              ? "bg-brand-primary/20 text-brand-primary"
              : permUser.role === "ADMIN"
                ? "bg-brand-primary/15 text-brand-primary/90"
                : permUser.role === "MANAGER"
                  ? "bg-brand-primary/10 text-brand-primary/80"
                  : "bg-white/10 text-white/50"
          }`}
        >
          {ROLE_LABELS[permUser.role]}
        </span>
      </div>
      {showAdminDashboard ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}
