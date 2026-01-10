"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutLink, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import {
  LogOut,
  FolderKanban,
  HandPlatter,
  Box,
  Users,
  PhoneCall,
  SearchCode,
  Gift,
  DollarSign,
  Settings,
  Shield,
} from "lucide-react";
import { NavItem } from "@/types/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import { ROLE_LABELS } from "@/types/permissions";

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Box,
    requiresAuth: true,
  },
  {
    href: "/dashboard/projects",
    label: "Projects",
    icon: FolderKanban,
    requiresAuth: true,
  },
  {
    href: "/dashboard/services",
    label: "Services",
    icon: HandPlatter,
    requiresAuth: true,
  },
  {
    href: "/dashboard/pricing",
    label: "Pricing",
    icon: DollarSign,
    requiresAuth: true,
  },
  {
    href: "/dashboard/clients",
    label: "Clients",
    icon: Users,
    requiredPermission: "MANAGE_CLIENTS",
  },
  {
    href: "/dashboard/sales",
    label: "Sales",
    icon: Gift,
    requiredPermission: "MANAGE_SALES",
  },
  {
    href: "/dashboard/inquiries",
    label: "Inquiries",
    icon: SearchCode,
    requiredPermission: "MANAGE_INQUIRIES",
  },
  {
    href: "/dashboard/leads",
    label: "Leads",
    icon: PhoneCall,
    requiredPermission: "MANAGE_LEADS",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    requiredPermission: "MANAGE_USERS",
  },
];

export function DashboardSidebar() {
  const { isAuthenticated, user } = useKindeAuth();
  const pathname = usePathname();
  const {
    user: permUser,
    loading: permLoading,
    hasPermission,
    isSuperAdmin,
  } = usePermissions();

  const filteredNavItems = navItems.filter((item) => {
    // Check auth requirement
    if (item.requiresAuth && !isAuthenticated) {
      return false;
    }

    // Check permission requirement
    if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
      return false;
    }

    // Legacy: Check admin requirement (backward compatibility)
    if (item.requiresAdmin && !isSuperAdmin && !hasPermission("MANAGE_USERS")) {
      return false;
    }

    return true;
  });

  if (permLoading) {
    return (
      <div className="w-64 h-full border-r border-y border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-center">
        <div className="animate-pulse text-white/50">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-64 h-full border-r border-y border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-center p-4">
        <p className="text-white/70 text-center">
          Please log in to access the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 h-full border-r border-y border-white/10 bg-black/40 backdrop-blur-xl flex flex-col"
      >
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors",
                    pathname === item.href
                      ? "bg-brand-primary/20 text-brand-primary"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-t border-white/10">
          <div className="flex items-center gap-3 p-4">
            {user?.picture ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={user.picture}
                  alt={user.given_name || "User"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                <span className="text-brand-primary text-sm">
                  {user?.given_name?.[0] || user?.email?.[0] || "?"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.given_name} {user?.family_name}
              </p>
              <div className="flex items-center gap-1">
                {permUser?.role && (
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      permUser.role === "SUPER_ADMIN"
                        ? "bg-brand-primary/20 text-brand-primary"
                        : permUser.role === "ADMIN"
                          ? "bg-brand-primary/15 text-brand-primary/90"
                          : permUser.role === "MANAGER"
                            ? "bg-brand-primary/10 text-brand-primary/80"
                            : "bg-white/10 text-white/50"
                    )}
                  >
                    {isSuperAdmin && <Shield className="w-3 h-3 inline mr-0.5" />}
                    {ROLE_LABELS[permUser.role]}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 w-full p-2">
            <LogoutLink className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-red-500 rounded-lg transition-colors w-full">
              <LogOut className="w-4 h-4" />
              Sign Out
            </LogoutLink>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
