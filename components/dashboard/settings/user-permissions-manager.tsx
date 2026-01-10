"use client";

import { useState } from "react";
import { useClients } from "@/hooks/use-clients";
import { usePermissions } from "@/hooks/use-permissions";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  Shield,
  Check,
  X,
} from "lucide-react";
import {
  ROLES,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  PERMISSION_INFO,
  PERMISSION_GROUPS,
  ROLE_PERMISSIONS,
  Role,
  Permission,
  SUPER_ADMIN_EMAIL,
} from "@/types/permissions";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserWithPermissions {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  role: Role;
  permissions: Permission[];
}

export default function UserPermissionsManager() {
  const { clients, loading, error, mutate } = useClients();
  usePermissions(); // Hook for permission checks
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [savingUser, setSavingUser] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<
    Record<string, { role?: Role; permissions?: Permission[] }>
  >({});

  const toggleExpand = (userId: string) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const handleRoleChange = (userId: string, newRole: Role) => {
    setPendingChanges((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        role: newRole,
      },
    }));
  };

  const handlePermissionToggle = (
    userId: string,
    permission: Permission,
    currentPermissions: Permission[]
  ) => {
    const pending = pendingChanges[userId]?.permissions || currentPermissions;
    const newPermissions = pending.includes(permission)
      ? pending.filter((p) => p !== permission)
      : [...pending, permission];

    setPendingChanges((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        permissions: newPermissions,
      },
    }));
  };

  const saveChanges = async (userId: string) => {
    const changes = pendingChanges[userId];
    if (!changes) return;

    setSavingUser(userId);
    try {
      const response = await fetch(`/api/users/${userId}/permissions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save changes");
      }

      // Clear pending changes for this user
      setPendingChanges((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [userId]: _removed, ...rest } = prev;
        return rest;
      });

      mutate();
    } catch (err) {
      console.error("Error saving permissions:", err);
      alert(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSavingUser(null);
    }
  };

  const discardChanges = (userId: string) => {
    setPendingChanges((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [userId]: _discarded, ...rest } = prev;
      return rest;
    });
  };

  const hasChanges = (userId: string) => !!pendingChanges[userId];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-red-500">
        {error}
      </div>
    );
  }

  const users = clients as unknown as UserWithPermissions[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Roles & Permissions</h2>
        <p className="text-sm text-white/50">
          {users.length} user{users.length !== 1 ? "s" : ""} total
        </p>
      </div>

      <div className="space-y-2">
        {users.map((user) => {
          const isExpanded = expandedUser === user.id;
          const isSuperAdminUser = user.email === SUPER_ADMIN_EMAIL;
          const currentRole =
            pendingChanges[user.id]?.role || user.role || "VIEWER";
          const currentPermissions =
            pendingChanges[user.id]?.permissions || user.permissions || [];
          const roleDefaultPermissions = ROLE_PERMISSIONS[currentRole] || [];

          return (
            <div
              key={user.id}
              className={cn(
                "bg-black/40 border rounded-2xl overflow-hidden transition-all",
                isExpanded ? "border-brand-primary/50" : "border-white/10",
                hasChanges(user.id) && "ring-2 ring-brand-primary/30"
              )}
            >
              {/* User Row */}
              <div
                className={cn(
                  "flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-colors",
                  isSuperAdminUser && "cursor-default"
                )}
                onClick={() => !isSuperAdminUser && toggleExpand(user.id)}
              >
                {/* Avatar */}
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user.firstName || "User"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                    <span className="text-brand-primary font-medium">
                      {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.firstName || user.email}
                    </p>
                    {isSuperAdminUser && (
                      <Shield className="w-4 h-4 text-brand-primary" />
                    )}
                  </div>
                  <p className="text-sm text-white/50 truncate">{user.email}</p>
                </div>

                {/* Role Badge */}
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    currentRole === "SUPER_ADMIN"
                      ? "bg-brand-primary/20 text-brand-primary"
                      : currentRole === "ADMIN"
                        ? "bg-brand-primary/15 text-brand-primary/90"
                        : currentRole === "MANAGER"
                          ? "bg-brand-primary/10 text-brand-primary/80"
                          : "bg-white/10 text-white/50"
                  )}
                >
                  {ROLE_LABELS[currentRole]}
                </span>

                {/* Expand/Collapse */}
                {!isSuperAdminUser && (
                  <div className="text-white/50">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {isExpanded && !isSuperAdminUser && (
                <div className="border-t border-white/10 p-4 space-y-6">
                  {/* Role Selector */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Role
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {ROLES.filter((r) => r !== "SUPER_ADMIN").map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleChange(user.id, role)}
                          className={cn(
                            "p-3 rounded-xl border text-left transition-all",
                            currentRole === role
                              ? "border-brand-primary bg-brand-primary/10"
                              : "border-white/10 hover:border-white/30"
                          )}
                        >
                          <p className="font-medium text-sm">
                            {ROLE_LABELS[role]}
                          </p>
                          <p className="text-xs text-white/50 mt-1">
                            {ROLE_DESCRIPTIONS[role]}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Permissions
                      <span className="text-white/50 font-normal ml-2">
                        (Custom permissions are added to role defaults)
                      </span>
                    </label>

                    {Object.entries(PERMISSION_GROUPS).map(
                      ([groupName, groupPermissions]) => (
                        <div key={groupName} className="mb-4">
                          <h4 className="text-xs uppercase text-white/40 mb-2">
                            {groupName}
                          </h4>
                          <div className="space-y-2">
                            {groupPermissions.map((permission) => {
                              const isFromRole =
                                roleDefaultPermissions.includes(permission);
                              const isCustom =
                                currentPermissions.includes(permission);
                              const isActive = isFromRole || isCustom;
                              const info = PERMISSION_INFO[permission];

                              // MANAGE_USERS is only for SUPER_ADMIN
                              if (permission === "MANAGE_USERS") return null;

                              return (
                                <div
                                  key={permission}
                                  className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl border transition-all",
                                    isActive
                                      ? "border-brand-primary/30 bg-brand-primary/5"
                                      : "border-white/10"
                                  )}
                                >
                                  <button
                                    onClick={() =>
                                      !isFromRole &&
                                      handlePermissionToggle(
                                        user.id,
                                        permission,
                                        currentPermissions
                                      )
                                    }
                                    disabled={isFromRole}
                                    className={cn(
                                      "w-5 h-5 rounded flex items-center justify-center transition-colors",
                                      isActive
                                        ? "bg-brand-primary text-black"
                                        : "border border-white/30 hover:border-white/50",
                                      isFromRole && "opacity-50 cursor-not-allowed"
                                    )}
                                  >
                                    {isActive && <Check className="w-3 h-3" />}
                                  </button>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">
                                      {info.label}
                                      {isFromRole && (
                                        <span className="ml-2 text-xs text-white/40">
                                          (from role)
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-xs text-white/50">
                                      {info.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Actions */}
                  {hasChanges(user.id) && (
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => discardChanges(user.id)}
                        className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Discard
                      </button>
                      <button
                        onClick={() => saveChanges(user.id)}
                        disabled={savingUser === user.id}
                        className="px-4 py-2 text-sm bg-brand-primary text-black rounded-xl font-medium hover:bg-brand-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {savingUser === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
