// app/dashboard/settings/page.tsx
"use client";

import { usePermissions } from "@/hooks/use-permissions";
import { Loader2, Shield, Users, Settings as SettingsIcon } from "lucide-react";
import UserPermissionsManager from "@/components/dashboard/settings/user-permissions-manager";

export default function SettingsPage() {
  const { loading, isSuperAdmin, hasPermission } = usePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  // Only SUPER_ADMIN can access this page
  if (!hasPermission("MANAGE_USERS")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-white/70">
        <Shield className="w-16 h-16 mb-4 text-white/20" />
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p>You don&apos;t have permission to access this page.</p>
        <p className="text-sm mt-1">Only Super Admin can manage user permissions.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-brand-primary/20 rounded-2xl">
          <SettingsIcon className="w-8 h-8 text-brand-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-white/70 mt-1">
            Manage system settings and user permissions
          </p>
        </div>
      </div>

      {/* Super Admin Badge */}
      {isSuperAdmin && (
        <div className="flex items-center gap-2 p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl">
          <Shield className="w-5 h-5 text-brand-primary" />
          <span className="text-brand-primary font-medium">Super Admin Access</span>
          <span className="text-white/50 text-sm">
            You have full control over user roles and permissions
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-white/10">
        <nav className="flex gap-8">
          <button className="pb-4 border-b-2 border-brand-primary text-brand-primary font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Management
          </button>
        </nav>
      </div>

      {/* Content */}
      <UserPermissionsManager />
    </div>
  );
}
