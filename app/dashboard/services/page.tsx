"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Filter, Clock, Activity } from "lucide-react";
import { ViewToggle } from "@/components/dashboard/data-view/view-toggle";
import { useServices } from "@/hooks/use-services";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import { servicePlans } from "@/constants/services";
import type { UserService } from "@/types/service";
import ServiceDetailsModal from "@/components/dashboard/services/service-details-modal";
import { BillingInfo } from "@/components/dashboard/services/billing-info";
import { ActivateServiceButton } from "@/components/dashboard/services/activate-service-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal, Edit2, Trash2, Eye } from "lucide-react";

type ServiceStatus = "pending" | "active" | "paused" | "cancelled";

const STATUS_OPTIONS = [
  { value: "all", label: "All Services" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "cancelled", label: "Cancelled" },
];

export default function ServicesPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "all">("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedService, setSelectedService] = useState<UserService | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const { services, loading, error, mutate, activateService } = useServices({
    statusFilter: statusFilter === "all" ? null : statusFilter,
  });

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        // Check for MANAGE_SERVICES permission or ADMIN/SUPER_ADMIN role
        const role = data.user?.role || "VIEWER";
        const permissions = data.user?.permissions || [];
        const isAdminUser =
          role === "ADMIN" ||
          role === "SUPER_ADMIN" ||
          permissions.includes("MANAGE_SERVICES");
        setIsAdmin(isAdminUser);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

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

  const handleViewDetails = (service: UserService) => {
    setSelectedService(service);
    setDetailsModalOpen(true);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-white/70 mt-1">
            {isAdmin
              ? "Manage all client services and subscriptions"
              : "Manage your active services and subscriptions"}
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as ServiceStatus | "all")}
          >
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-black/95 border-white/10">
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
          <h3 className="text-lg font-medium mb-2">
            {statusFilter === "all"
              ? "No services yet"
              : `No ${statusFilter} services`}
          </h3>
          <p className="text-white/70 mb-6">
            {statusFilter === "all"
              ? "Get started by adding a new service to your account."
              : "Try changing the filter to see other services."}
          </p>
          {statusFilter === "all" && (
            <Link href="/dashboard/services/create">
              <button className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-brand-primary rounded-full text-black font-medium hover:bg-brand-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
                Add First Service
              </button>
            </Link>
          )}
        </div>
      ) : view === "list" ? (
        // Table View
        <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-3 text-left text-sm font-medium text-white/70">
                    Service
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-sm font-medium text-white/70">
                      Client
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-sm font-medium text-white/70">
                    Billing
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-white/70">
                    Status
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-sm font-medium text-white/70">
                      {statusFilter === "pending" ? "Days Pending" : "Lifecycle"}
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-sm font-medium text-white/70">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-white/70">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {services.map((service, index) => {
                  const servicePlan = servicePlans.find(
                    (s) => s.id === service.serviceId
                  );
                  return (
                    <motion.tr
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {servicePlan && (
                            <Image
                              src={servicePlan.icon}
                              alt={servicePlan.title}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          )}
                          <span className="font-medium">
                            {servicePlan?.title || service.serviceId}
                          </span>
                        </div>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-sm text-white/70">
                          <div className="flex items-center gap-2">
                            {service.user?.profileImage && (
                              <Image
                                src={service.user.profileImage}
                                alt=""
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                            )}
                            <span>{service.userEmail}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm capitalize">
                        {service.billingInterval}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            service.status === "active"
                              ? "bg-green-500/20 text-green-500"
                              : service.status === "cancelled"
                              ? "bg-red-500/20 text-red-500"
                              : service.status === "paused"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-blue-500/20 text-blue-500"
                          }`}
                        >
                          {service.status.charAt(0).toUpperCase() +
                            service.status.slice(1)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-sm">
                          {service.status === "pending" &&
                          service.daysSinceRequest != null ? (
                            <span
                              className={`flex items-center gap-1 ${
                                (service.daysSinceRequest ?? 0) > 7
                                  ? "text-red-400"
                                  : (service.daysSinceRequest ?? 0) > 3
                                  ? "text-yellow-400"
                                  : "text-blue-400"
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              {service.daysSinceRequest} days
                            </span>
                          ) : service.status === "active" &&
                            service.activatedAt ? (
                            <span className="flex items-center gap-1 text-green-400">
                              <Activity className="w-3.5 h-3.5" />
                              {format(new Date(service.activatedAt), "PP")}
                            </span>
                          ) : (
                            <span className="text-white/50">-</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-white/70">
                        {format(new Date(service.createdAt), "PP")}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="inline-flex items-center justify-center p-2 text-white/70 hover:text-brand-primary rounded-xl transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="w-48 p-2 bg-black/90 backdrop-blur-xl rounded-xl border-brand-primary/50"
                          >
                            <button
                              onClick={() => handleViewDetails(service)}
                              className="flex items-center w-full gap-2 p-2 text-white/70 hover:text-brand-primary hover:bg-white/10 rounded-[0.5rem] transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Details</span>
                            </button>
                            <Link
                              href={`/dashboard/services/${service.id}/edit`}
                              className="flex items-center w-full gap-2 p-2 text-white/70 hover:text-brand-primary hover:bg-white/10 rounded-[0.5rem] transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span>Edit</span>
                            </Link>
                            {isAdmin && (
                              <button
                                onClick={() => handleDelete(service.id)}
                                className="flex items-center w-full gap-2 p-2 text-white/70 hover:text-red-500 hover:bg-red-500/10 rounded-[0.5rem] transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            )}
                          </PopoverContent>
                        </Popover>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Card View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const servicePlan = servicePlans.find(
              (s) => s.id === service.serviceId
            );
            const price =
              servicePlan?.price[
                service.billingInterval as "monthly" | "annually"
              ] || 0;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-5 space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {servicePlan && (
                      <Image
                        src={servicePlan.icon}
                        alt={servicePlan.title}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {servicePlan?.title || service.serviceId}
                      </h3>
                      <p className="text-sm text-white/50">
                        {isAdmin ? service.userEmail : service.billingInterval}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      service.status === "active"
                        ? "bg-green-500/20 text-green-500"
                        : service.status === "cancelled"
                        ? "bg-red-500/20 text-red-500"
                        : service.status === "paused"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-blue-500/20 text-blue-500"
                    }`}
                  >
                    {service.status.charAt(0).toUpperCase() +
                      service.status.slice(1)}
                  </span>
                </div>

                {/* Billing Info for Active Services */}
                {service.status === "active" && service.billingPeriod && (
                  <BillingInfo
                    billingPeriod={service.billingPeriod}
                    billingInterval={
                      service.billingInterval as "monthly" | "annually"
                    }
                    compact
                  />
                )}

                {/* Pending Days for Admin */}
                {isAdmin &&
                  service.status === "pending" &&
                  service.daysSinceRequest != null && (
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        (service.daysSinceRequest ?? 0) > 7
                          ? "text-red-400"
                          : (service.daysSinceRequest ?? 0) > 3
                          ? "text-yellow-400"
                          : "text-blue-400"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>Pending for {service.daysSinceRequest} days</span>
                    </div>
                  )}

                {/* Price */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Price</span>
                  <span className="text-brand-primary font-medium">
                    ${price.toLocaleString()}/{service.billingInterval}
                  </span>
                </div>

                {/* Admin Activate Button */}
                {isAdmin && service.status === "pending" && (
                  <ActivateServiceButton
                    service={service}
                    onActivate={activateService}
                    size="sm"
                  />
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleViewDetails(service)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
                  <Link
                    href={`/dashboard/services/${service.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      <ServiceDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        data={selectedService}
        isAdmin={isAdmin}
        onActivate={activateService}
      />
    </div>
  );
}
