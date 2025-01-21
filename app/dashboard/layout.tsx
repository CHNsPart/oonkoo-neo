// app/dashboard/layout.tsx
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

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