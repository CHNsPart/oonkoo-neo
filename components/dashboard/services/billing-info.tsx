"use client";

import { Calendar, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { BillingPeriod } from "@/types/service";
import {
  getRenewalStatusMessage,
  getRenewalUrgency,
  getUrgencyColors,
  formatDate,
} from "@/lib/billing-utils";

interface BillingInfoProps {
  billingPeriod: BillingPeriod;
  billingInterval: "monthly" | "annually";
  compact?: boolean;
}

export function BillingInfo({
  billingPeriod,
  billingInterval,
  compact = false,
}: BillingInfoProps) {
  const urgency = getRenewalUrgency(billingPeriod.daysRemaining);
  const colors = getUrgencyColors(urgency);
  const statusMessage = getRenewalStatusMessage(billingPeriod.daysRemaining);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            urgency === "critical"
              ? "bg-red-500"
              : urgency === "warning"
              ? "bg-yellow-500"
              : "bg-brand-primary"
          }`}
        />
        <span className="text-sm text-white/70">{statusMessage}</span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-4 ${colors.bg} ${colors.border} border`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-primary" />
          Billing Period
        </h4>
        <span className={`text-sm ${colors.text} flex items-center gap-1`}>
          {urgency === "critical" ? (
            <AlertTriangle className="w-3.5 h-3.5" />
          ) : urgency === "warning" ? (
            <Clock className="w-3.5 h-3.5" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5" />
          )}
          {statusMessage}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.progress} transition-all duration-300`}
            style={{ width: `${Math.min(100, billingPeriod.progressPercent)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-white/50">
          <span>{formatDate(billingPeriod.startDate)}</span>
          <span>{formatDate(billingPeriod.endDate)}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-white/50 text-xs">Days Remaining</div>
          <div className={`font-semibold ${colors.text}`}>
            {billingPeriod.daysRemaining} days
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-white/50 text-xs">Billing Cycle</div>
          <div className="font-semibold capitalize">{billingInterval}</div>
        </div>
      </div>

      {/* Next Renewal Date */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/70">Next Renewal</span>
          <span className="font-medium">{formatDate(billingPeriod.renewalDate)}</span>
        </div>
      </div>
    </div>
  );
}

interface PendingInfoProps {
  daysSinceRequest: number;
  createdAt: Date | string;
}

export function PendingInfo({ daysSinceRequest, createdAt }: PendingInfoProps) {
  const isOverdue = daysSinceRequest > 7;
  const isUrgent = daysSinceRequest > 3;

  return (
    <div
      className={`rounded-xl p-4 border ${
        isOverdue
          ? "bg-red-500/10 border-red-500/20"
          : isUrgent
          ? "bg-yellow-500/10 border-yellow-500/20"
          : "bg-blue-500/10 border-blue-500/20"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          Pending Service
        </h4>
        <span
          className={`text-sm ${
            isOverdue
              ? "text-red-500"
              : isUrgent
              ? "text-yellow-500"
              : "text-blue-400"
          }`}
        >
          {daysSinceRequest === 0
            ? "Requested today"
            : daysSinceRequest === 1
            ? "Requested yesterday"
            : `${daysSinceRequest} days pending`}
        </span>
      </div>

      <div className="text-sm text-white/70">
        <div className="flex justify-between">
          <span>Request Date</span>
          <span className="text-white">{formatDate(createdAt)}</span>
        </div>
      </div>

      {isOverdue && (
        <div className="mt-3 pt-3 border-t border-white/10 text-sm text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Requires attention - service pending for over a week
        </div>
      )}
    </div>
  );
}
