"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutLink, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import { LogOut, FolderKanban, HandPlatter, Box, Users, PhoneCall, SearchCode, Gift, DollarSign } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { useEffect, useState } from "react";

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
    requiresAdmin: true,
  },
  {
    href: "/dashboard/sales",
    label: "Sales",
    icon: Gift,
    requiresAdmin: true,
  },
  {
    href: "/dashboard/inquiries",
    label: "Inquiries",
    icon: SearchCode,
    requiresAdmin: true,
  },
  {
    href: "/dashboard/leads",
    label: "Leads",
    icon: PhoneCall,
    requiresAdmin: true,
  },
];

export function DashboardSidebar() {
  const { isAuthenticated, user } = useKindeAuth();
  const pathname = usePathname();
  const [isAdmin, setisAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  

  useEffect(() => {
    if(isAuthenticated){
      fetch('/api/user')
      .then(async response => {
        const data = await response.json();
        console.log("user-claim data",data)
        return data;
      })
      .catch(error => {
        console.error('Error fetching user claims:', error);
      });
      setIsLoading(true);
      if(user) {
        if(user.email === "imchn24@gmail.com") setisAdmin(true);
      }}
      setIsLoading(false);
  }, [isAuthenticated]);  

  const filteredNavItems = navItems.filter(item =>
    (!item.requiresAuth || (item.requiresAuth && isAuthenticated)) &&
    (!item.requiresAdmin || (item.requiresAdmin && isAdmin))
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <div>Please log in to access the dashboard.</div>;
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
                  alt={user.given_name || 'User'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                <span className="text-brand-primary text-sm">
                  {user?.given_name?.[0] || user?.email?.[0] || '?'}
                </span>
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {user?.given_name} {user?.family_name}
              </p>
              <p className="text-xs text-white/50">{user?.email}</p>
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