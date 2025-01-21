// app/dashboard/leads/page.tsx
"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { ViewToggle } from "@/components/dashboard/data-view/view-toggle";
import DataGrid from "@/components/dashboard/data-view/data-grid";
import DataCards from "@/components/dashboard/data-view/data-cards";
import { useLeads } from "@/hooks/use-leads";
import Link from "next/link";
import { format } from "date-fns";

export default function LeadsPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const { leads, loading, error, mutate } = useLeads();

  const columns = [
    {
      key: "name",
      label: "Name"
    },
    {
      key: "email",
      label: "Email"
    },
    {
      key: "status",
      label: "Status",
      format: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'new' ? 'bg-blue-500/20 text-blue-500' :
          value === 'contacted' ? 'bg-yellow-500/20 text-yellow-500' :
          value === 'qualified' ? 'bg-violet-500/20 text-violet-500' :
          'bg-brand-primary/20 text-brand-primary'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: "source",
      label: "Source",
      format: (value: string) => (
        <span className="capitalize">{value}</span>
      )
    },
    {
      key: "createdAt",
      label: "Created",
      format: (value: string) => format(new Date(value), 'PP'),
      hideInCard: true
    }
  ];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete lead");
      mutate();
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-white/70 mt-1">
            Manage and track your potential clients
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} onViewChange={setView} />
          <Link href="/dashboard/leads/create">
            <button className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-primary rounded-full text-black font-medium hover:bg-brand-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
          </Link>
        </div>
      </div>

      {/* Data View */}
      {view === "list" ? (
        <DataGrid
          data={leads}
          columns={columns}
          onDelete={handleDelete}
          resourceName="lead"
          showDetailsButton={false}
        />
      ) : (
        <DataCards
          data={leads}
          columns={columns}
          onDelete={handleDelete}
          resourceName="lead"
          showDetailsButton={false}
        />
      )}
    </div>
  );
}