"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { ViewToggle } from "@/components/dashboard/data-view/view-toggle";
import DataGrid from "@/components/dashboard/data-view/data-grid";
import DataCards from "@/components/dashboard/data-view/data-cards";
import { useServices } from "@/hooks/use-services";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import { servicePlans } from "@/constants/services";
import type { TableColumn } from "@/types/dashboard";
import type { UserService } from "@/types/service";
import ServiceDetailsModal from "@/components/dashboard/services/service-details-modal";

export default function ServicesPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const { services, loading, error, mutate } = useServices();

  const columns: TableColumn<UserService>[] = [
    {
      key: "serviceId",
      label: "Service",
      format: (value: string) => {
        const service = servicePlans.find(s => s.id === value);
        if (!service) return value;
        
        return (
          <div className="flex items-center gap-3">
            <Image
              src={service.icon}
              alt={service.title}
              width={24}
              height={24}
              className="object-contain"
            />
            <span>{service.title}</span>
          </div>
        );
      }
    },
    {
      key: "billingInterval",
      label: "Billing",
      format: (value: string) => (
        <span className="capitalize">{value}</span>
      )
    },
    {
      key: "status",
      label: "Status",
      format: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'active' ? 'bg-green-500/20 text-green-500' :
          value === 'cancelled' ? 'bg-red-500/20 text-red-500' :
          value === 'paused' ? 'bg-yellow-500/20 text-yellow-500' :
          'bg-blue-500/20 text-blue-500'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: "startDate",
      label: "Started",
      format: (value: Date) => format(new Date(value), 'PP'),
      hideInCard: true
    },
    {
      key: "endDate",
      label: "Ends",
      format: (value: Date | null) => value ? format(new Date(value), 'PP') : 'Ongoing',
      hideInCard: true
    },
    {
      key: "createdAt",
      label: "Created",
      format: (value: Date) => format(new Date(value), 'PP'),
      hideInCard: true
    }
  ];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      mutate();
    } catch (err) {
      console.error("Error deleting service:", err);
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
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-white/70 mt-1">
            Manage your active services and subscriptions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} onViewChange={setView} />
          <Link href="/dashboard/services/create">
            <button className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-primary rounded-full text-black font-medium hover:bg-brand-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {services.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No services yet</h3>
          <p className="text-white/70 mb-6">Get started by adding a new service to your account.</p>
          <Link href="/dashboard/services/create">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-brand-primary rounded-full text-black font-medium hover:bg-brand-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Add First Service
            </button>
          </Link>
        </div>
      ) : (
        // Data View
        view === "list" ? (
          <DataGrid
            data={services}
            columns={columns}
            onDelete={handleDelete}
            resourceName="service"
            showDetailsButton={true}
            DetailsModal={ServiceDetailsModal}
          />
        ) : (
          <DataCards
            data={services}
            columns={columns}
            onDelete={handleDelete}
            resourceName="service"
            showDetailsButton={true}
            DetailsModal={ServiceDetailsModal}
          />
        )
      )}
    </div>
  );
}