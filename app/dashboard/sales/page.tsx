"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { ViewToggle } from "@/components/dashboard/data-view/view-toggle";
import DataGrid from "@/components/dashboard/data-view/data-grid";
import DataCards from "@/components/dashboard/data-view/data-cards";
import { useSales } from "@/hooks/use-sales";
import Link from "next/link";
import { format } from "date-fns";
import SaleDetailsModal from "@/components/dashboard/sales/sale-details-modal";

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'new':
      return 'bg-blue-500/20 text-blue-500';
    case 'contacted':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'accepted':
      return 'bg-green-500/20 text-green-500';
    case 'rejected':
      return 'bg-red-500/20 text-red-500';
    default:
      return 'bg-brand-primary/20 text-brand-primary';
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function SalesPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const { sales, loading, error, mutate } = useSales();

  const columns = useMemo(() => [
    {
      key: "name",
      label: "Name",
      format: (value: string) => value
    },
    {
      key: "email",
      label: "Email",
      hideInCard: true
    },
    {
      key: "type",
      label: "Sale Type",
      format: (value: string) => (
        <span className="capitalize">{value.replace('_', ' ')}</span>
      )
    },
    {
      key: "originalPrice",
      label: "Original Price",
      format: (value: number) => formatPrice(value),
      hideInCard: true
    },
    {
      key: "salePrice",
      label: "Sale Price",
      format: (value: number) => formatPrice(value)
    },
    {
      key: "status",
      label: "Status",
      format: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
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
    if (!confirm("Are you sure you want to delete this sale?")) return;
    
    try {
      const response = await fetch(`/api/sale-inquiries/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete sale");
      mutate();
    } catch (err) {
      console.error("Error deleting sale:", err);
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
          <h1 className="text-3xl font-bold">Sale Inquiries</h1>
          <p className="text-white/70 mt-1">
            Manage and track sale inquiries
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} onViewChange={setView} />
          <Link href="/dashboard/sales/create">
            <button className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-primary rounded-full text-black font-medium hover:bg-brand-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Add Sale
            </button>
          </Link>
        </div>
      </div>

      {/* Data View */}
      {view === "list" ? (
        <DataGrid
          data={sales}
          columns={columns}
          onDelete={handleDelete}
          resourceName="sale"
          showDetailsButton={true}
          DetailsModal={SaleDetailsModal}
        />
      ) : (
        <DataCards
          data={sales}
          columns={columns}
          onDelete={handleDelete}
          resourceName="sale"
          showDetailsButton={false}
        />
      )}
    </div>
  );
}