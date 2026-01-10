// app/dashboard/clients/page.tsx
"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { ViewToggle } from "@/components/dashboard/data-view/view-toggle";
import DataGrid from "@/components/dashboard/data-view/data-grid";
import DataCards from "@/components/dashboard/data-view/data-cards";
import { useClients } from "@/hooks/use-clients";
import { format } from "date-fns";
import type { TableColumn } from "@/types/dashboard";
import type { ClientUser } from "@/types/client";
import ClientDetailsModal from "@/components/dashboard/clients/client-details-modal";
import Link from "next/link";
import Image from "next/image";
import { SUPER_ADMIN_EMAIL } from "@/types/permissions";

export default function ClientsPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const { clients, loading, error, mutate } = useClients();

  const columns: TableColumn<ClientUser>[] = [
    {
      key: "firstName",
      label: "Name",
      format: (value) => {
        const record = clients.find((c) => c.firstName === value);
        if (!record) return value;

        return (
          <div className="flex items-center gap-3">
            {record.profileImage ? (
              <Image
                src={record.profileImage}
                alt={record.firstName || "Profile"}
                height={20}
                width={20}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                <span className="text-brand-primary text-sm">
                  {(record.firstName?.[0] || record.email[0]).toUpperCase()}
                </span>
              </div>
            )}
            <span>
              {record.firstName && record.lastName
                ? `${record.firstName} ${record.lastName}`
                : record.firstName || record.lastName || record.email}
            </span>
          </div>
        );
      },
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "lastLoginAt",
      label: "Last Login",
      format: (value) => (value ? format(new Date(value), "PPp") : "Never"),
      hideInCard: true,
    },
    {
      key: "createdAt",
      label: "Joined",
      format: (value) => format(new Date(value), "PP"),
      hideInCard: true,
    },
  ];

  const handleDelete = async (id: string) => {
    // Find the client to check if it's the super admin
    const client = clients.find((c) => c.id === id);
    if (client?.email === SUPER_ADMIN_EMAIL) {
      alert("Cannot delete the Super Admin account");
      return;
    }

    if (!confirm("Are you sure you want to delete this client?")) return;

    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete client");
      mutate();
    } catch (err) {
      console.error("Error deleting client:", err);
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
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-white/70 mt-1">
            Manage your platform users and their permissions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} onViewChange={setView} />
          <Link href="/dashboard/clients/create">
            <button className="flex items-center justify-center gap-2 px-6 py-2 bg-brand-primary rounded-full text-black font-medium hover:bg-brand-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Add Client
            </button>
          </Link>
        </div>
      </div>

      {/* Data View */}
      {view === "list" ? (
        <DataGrid
          data={clients}
          columns={columns}
          onDelete={handleDelete}
          resourceName="client"
          showDetailsButton={true}
          DetailsModal={ClientDetailsModal}
        />
      ) : (
        <DataCards
          data={clients}
          columns={columns}
          onDelete={handleDelete}
          resourceName="client"
          showDetailsButton={true}
          DetailsModal={ClientDetailsModal}
        />
      )}
    </div>
  );
}
