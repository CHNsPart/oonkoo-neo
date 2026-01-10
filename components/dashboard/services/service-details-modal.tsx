"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DollarSign,
  FileText,
  MessageSquare,
  User,
} from "lucide-react";
import Image from "next/image";
import { servicePlans } from "@/constants/services";
import { UserService, ExternalLink } from "@/types/service";
import { BillingInfo } from "./billing-info";
import { ExternalLinksDisplay } from "./external-links-input";
import { ActivateServiceButton } from "./activate-service-button";
import { ServiceLifecycle } from "./service-lifecycle";

interface ServiceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: UserService | null;
  isAdmin?: boolean;
  onActivate?: (serviceId: string, adminNotes?: string) => Promise<void>;
}

export default function ServiceDetailsModal({
  open,
  onOpenChange,
  data,
  isAdmin = false,
  onActivate,
}: ServiceDetailsModalProps) {
  if (!data) return null;

  const servicePlan = servicePlans.find((plan) => plan.id === data.serviceId);
  const price =
    servicePlan?.price[data.billingInterval as "monthly" | "annually"] || 0;
  const serviceTemplate = servicePlans.find((s) => s.id === data.serviceId);
  if (!serviceTemplate) return null;

  // Parse external links
  const externalLinks: ExternalLink[] = Array.isArray(data.externalLinks)
    ? data.externalLinks
    : typeof data.externalLinks === "string"
    ? JSON.parse(data.externalLinks || "[]")
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Service Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats Card */}
          <div className="bg-brand-primary/10 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Image
                  src={serviceTemplate.icon}
                  alt={serviceTemplate.title}
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div>
                  <h2 className="text-xl font-bold">{serviceTemplate.title}</h2>
                  <p className="text-white/70">{data.userEmail}</p>
                </div>
              </div>
              <div
                className={`px-3 py-1.5 rounded-full text-sm ${
                  data.status === "active"
                    ? "bg-green-500/20 text-green-500"
                    : data.status === "cancelled"
                    ? "bg-red-500/20 text-red-500"
                    : data.status === "paused"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-blue-500/20 text-blue-500"
                }`}
              >
                {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Service Lifecycle */}
          <ServiceLifecycle
            status={data.status as "pending" | "active" | "paused" | "cancelled"}
            createdAt={data.createdAt}
            activatedAt={data.activatedAt}
            paymentReceivedAt={data.paymentReceivedAt}
            endDate={data.endDate}
            isAdmin={isAdmin}
          />

          {/* Admin Activation Button */}
          {isAdmin && data.status === "pending" && onActivate && (
            <ActivateServiceButton service={data} onActivate={onActivate} />
          )}

          {/* Billing Period (for active services) */}
          {data.status === "active" && data.billingPeriod && (
            <BillingInfo
              billingPeriod={data.billingPeriod}
              billingInterval={data.billingInterval as "monthly" | "annually"}
            />
          )}

          {/* Pricing Information */}
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-brand-primary" />
              Pricing
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-white/70 text-sm">Billing Interval</span>
                <p className="capitalize font-medium">{data.billingInterval}</p>
              </div>
              <div>
                <span className="text-white/70 text-sm">Price</span>
                <p className="text-brand-primary font-medium">
                  ${price.toLocaleString()}/{data.billingInterval}
                  {data.billingInterval === "annually" && (
                    <span className="text-xs text-green-500 ml-2">(20% off)</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* User Info (for admin view) */}
          {isAdmin && data.user && (
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-primary" />
                Client Information
              </h3>
              <div className="flex items-center gap-3">
                {data.user.profileImage && (
                  <Image
                    src={data.user.profileImage}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">
                    {data.user.firstName} {data.user.lastName}
                  </p>
                  <p className="text-sm text-white/70">{data.userEmail}</p>
                </div>
              </div>
            </div>
          )}

          {/* User Notes */}
          {data.userNotes && (
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-primary" />
                Client Requirements
              </h3>
              <p className="text-white/70 whitespace-pre-wrap">
                {data.userNotes}
              </p>
            </div>
          )}

          {/* Admin Notes (admin only) */}
          {isAdmin && data.adminNotes && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-yellow-400">
                <MessageSquare className="w-4 h-4" />
                Admin Notes (Internal)
              </h3>
              <p className="text-white/70 whitespace-pre-wrap">
                {data.adminNotes}
              </p>
            </div>
          )}

          {/* External Links */}
          {externalLinks.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="font-semibold mb-3">Project Links</h3>
              <ExternalLinksDisplay links={externalLinks} />
            </div>
          )}

          {/* Features List */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold mb-3">Service Features</h3>
            <div className="grid grid-cols-1 gap-2">
              {serviceTemplate.serviceDescription.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-white/70"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
