// app/dashboard/layout.tsx
import { DashboardLayoutClient } from "@/components/dashboard/server-layouts/layout-client";
import { getDashboardLayout } from "@/components/dashboard/server-layouts/layout-server";
import { serializeUser } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initialUser } = await getDashboardLayout();
  const serializedUser = serializeUser(initialUser);

  return <DashboardLayoutClient initialUser={serializedUser}>{children}</DashboardLayoutClient>;
}