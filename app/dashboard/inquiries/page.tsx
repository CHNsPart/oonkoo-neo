"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { ViewToggle } from "@/components/dashboard/data-view/view-toggle";
import DataGrid from "@/components/dashboard/data-view/data-grid";
import DataCards from "@/components/dashboard/data-view/data-cards";
import { useInquiries } from "@/hooks/use-inquiries";
import Link from "next/link";
import { format } from "date-fns";
import InquiryDetailsModal from "@/components/dashboard/inquiries/inquiry-details-modal";

// Helper functions moved outside component to prevent recreation
const formatProjectType = (type: string) => {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new':
      return 'bg-blue-500/20 text-blue-500';
    case 'contacted':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'in_discussion':
      return 'bg-purple-500/20 text-purple-500';
    case 'quoted':
      return 'bg-orange-500/20 text-orange-500';
    case 'accepted':
      return 'bg-green-500/20 text-green-500';
    case 'rejected':
      return 'bg-red-500/20 text-red-500';
    default:
      return 'bg-brand-primary/20 text-brand-primary';
  }
};

export default function InquiriesPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const { inquiries, loading, error, mutate } = useInquiries();

  // Memoize columns definition
  const columns = useMemo(() => [
    {
      key: "name",
      label: "Name",
      format: (value: string | null) => value || 'N/A'
    },
    {
      key: "email",
      label: "Email"
    },
    {
      key: "project",
      label: "Project Type",
      format: (value: string) => (
        <span className="capitalize">{formatProjectType(value)}</span>
      )
    },
    {
      key: "budget",
      label: "Budget",
      format: (value: number | null) => 
        value ? `$${value.toLocaleString()}` : 'Not specified',
      hideInCard: true
    },
    {
      key: "status",
      label: "Status",
      format: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(value)}`}>
          {formatProjectType(value)}
        </span>
      )
    },
    {
      key: "createdAt",
      label: "Received",
      format: (value: string) => format(new Date(value), 'PP'),
      hideInCard: true
    }
  ], []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    
    try {
      const response = await fetch(`/api/project-inquiries/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete inquiry");
      mutate();
    } catch (err) {
      console.error("Error deleting inquiry:", err);
    }
  }, [mutate]);

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
          <h1 className="text-3xl font-bold">Project Inquiries</h1>
          <p className="text-white/70 mt-1">
            Manage and track incoming project inquiries
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} onViewChange={setView} />
          <Link href="/dashboard/inquiries/create">
            <button className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-primary rounded-full text-black font-medium hover:bg-brand-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Add Inquiry
            </button>
          </Link>
        </div>
      </div>

      {/* Data View */}
      {view === "list" ? (
        <DataGrid
          data={inquiries}
          columns={columns}
          onDelete={handleDelete}
          resourceName="inquirie"
          showDetailsButton={true}
          DetailsModal={InquiryDetailsModal}
        />
      ) : (
        <DataCards
          data={inquiries}
          columns={columns}
          onDelete={handleDelete}
          resourceName="inquirie"
          showDetailsButton={true}
          DetailsModal={InquiryDetailsModal}
        />
      )}
    </div>
  );
}