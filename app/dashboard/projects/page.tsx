"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { ViewToggle } from "@/components/dashboard/data-view/view-toggle";
import DataGrid from "@/components/dashboard/data-view/data-grid";
import DataCards from "@/components/dashboard/data-view/data-cards";
import { useProjects } from "@/hooks/use-projects";
import Link from "next/link";

export default function ProjectsPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const { projects, loading, error, mutate } = useProjects();

  const columns = [
    { 
      key: "name",
      label: "Name"
    },
    {
      key: "company",
      label: "Company",
      hideInCard: true
    },
    {
      key: "email",
      label: "Email"
    },
    {
      key: "planType",
      label: "Plan Type"
    },
    {
      key: "status",
      label: "Status",
      format: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'approved' ? 'bg-green-500/20 text-green-500' :
          value === 'rejected' ? 'bg-red-500/20 text-red-500' :
          value === 'completed' ? 'bg-blue-500/20 text-blue-500' :
          'bg-yellow-500/20 text-yellow-500'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: "totalPrice",
      label: "Total Price",
      format: (value: number) => `$${value.toLocaleString()}`
    },
    {
      key: "createdAt",
      label: "Created",
      format: (value: string) => new Date(value).toLocaleDateString(),
      hideInCard: true
    }
  ];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete project");
      mutate();
    } catch (err) {
      console.error("Error deleting project:", err);
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
        <h1 className="text-3xl font-bold">Projects</h1>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} onViewChange={setView} />
          <Link href={"/dashboard/projects/create"}>
            <button
              className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-primary rounded-full text-black font-medium hover:bg-brand-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </Link>
        </div>
      </div>

      {/* Data View */}
      {view === "list" ? (
        <DataGrid
          data={projects}
          columns={columns}
          onDelete={handleDelete}
          resourceName="project"
        />
      ) : (
        <DataCards
          data={projects}
          columns={columns}
          onDelete={handleDelete}
          resourceName="project"
        />
      )}
    </div>
  );
}