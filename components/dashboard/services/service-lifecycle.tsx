"use client";

import { format, differenceInDays } from "date-fns";
import {
  Clock,
  CheckCircle,
  Play,
  CreditCard,
  Calendar,
  ArrowRight,
  AlertTriangle,
  Pause,
  XCircle,
} from "lucide-react";

interface ServiceLifecycleProps {
  status: "pending" | "active" | "paused" | "cancelled";
  createdAt: Date | string;
  activatedAt?: Date | string | null;
  paymentReceivedAt?: Date | string | null;
  endDate?: Date | string | null;
  isAdmin?: boolean;
}

type LifecycleStep = {
  id: string;
  label: string;
  date?: Date | string | null;
  icon: React.ElementType;
  status: "completed" | "current" | "pending" | "skipped";
  color: string;
  description?: string;
};

export function ServiceLifecycle({
  status,
  createdAt,
  activatedAt,
  paymentReceivedAt,
  endDate,
  isAdmin = false,
}: ServiceLifecycleProps) {
  const now = new Date();
  const requestDate = new Date(createdAt);
  const daysSinceRequest = differenceInDays(now, requestDate);

  // Build lifecycle steps based on status
  const getLifecycleSteps = (): LifecycleStep[] => {
    const steps: LifecycleStep[] = [
      {
        id: "requested",
        label: "Service Requested",
        date: createdAt,
        icon: Clock,
        status: "completed",
        color: "text-blue-400",
        description: isAdmin && status === "pending"
          ? `${daysSinceRequest} days ago`
          : undefined,
      },
    ];

    if (status === "pending") {
      steps.push({
        id: "payment",
        label: "Awaiting Payment",
        icon: CreditCard,
        status: "current",
        color: "text-yellow-400",
        description: "Payment confirmation needed",
      });
      steps.push({
        id: "activation",
        label: "Activation",
        icon: Play,
        status: "pending",
        color: "text-white/30",
        description: "Billing starts upon activation",
      });
    } else if (status === "active") {
      steps.push({
        id: "payment",
        label: "Payment Received",
        date: paymentReceivedAt,
        icon: CreditCard,
        status: "completed",
        color: "text-green-400",
      });
      steps.push({
        id: "activation",
        label: "Service Activated",
        date: activatedAt,
        icon: Play,
        status: "completed",
        color: "text-green-400",
        description: "Billing started",
      });
      steps.push({
        id: "running",
        label: "Service Running",
        icon: CheckCircle,
        status: "current",
        color: "text-brand-primary",
        description: "Active subscription",
      });
    } else if (status === "paused") {
      if (activatedAt) {
        steps.push({
          id: "payment",
          label: "Payment Received",
          date: paymentReceivedAt,
          icon: CreditCard,
          status: "completed",
          color: "text-green-400",
        });
        steps.push({
          id: "activation",
          label: "Service Activated",
          date: activatedAt,
          icon: Play,
          status: "completed",
          color: "text-green-400",
        });
      }
      steps.push({
        id: "paused",
        label: "Service Paused",
        icon: Pause,
        status: "current",
        color: "text-yellow-400",
        description: "Subscription on hold",
      });
    } else if (status === "cancelled") {
      if (activatedAt) {
        steps.push({
          id: "payment",
          label: "Payment Received",
          date: paymentReceivedAt,
          icon: CreditCard,
          status: "completed",
          color: "text-green-400",
        });
        steps.push({
          id: "activation",
          label: "Service Activated",
          date: activatedAt,
          icon: Play,
          status: "completed",
          color: "text-green-400",
        });
      }
      steps.push({
        id: "cancelled",
        label: "Service Cancelled",
        date: endDate,
        icon: XCircle,
        status: "current",
        color: "text-red-400",
        description: "Subscription ended",
      });
    }

    return steps;
  };

  const steps = getLifecycleSteps();

  return (
    <div className="bg-white/5 rounded-xl p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-brand-primary" />
        Service Lifecycle
      </h3>

      {/* Timeline */}
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-3 mb-4 last:mb-0">
            {/* Icon and line */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.status === "completed"
                    ? "bg-green-500/20"
                    : step.status === "current"
                    ? step.color.includes("yellow")
                      ? "bg-yellow-500/20"
                      : step.color.includes("red")
                      ? "bg-red-500/20"
                      : "bg-brand-primary/20"
                    : "bg-white/10"
                }`}
              >
                <step.icon
                  className={`w-4 h-4 ${
                    step.status === "pending" ? "text-white/30" : step.color
                  }`}
                />
              </div>
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className={`w-0.5 h-8 mt-1 ${
                    step.status === "completed" || step.status === "current"
                      ? "bg-white/20"
                      : "bg-white/10"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between">
                <span
                  className={`font-medium ${
                    step.status === "pending" ? "text-white/50" : "text-white"
                  }`}
                >
                  {step.label}
                </span>
                {step.date && (
                  <span className="text-sm text-white/50">
                    {format(new Date(step.date), "MMM d, yyyy")}
                  </span>
                )}
              </div>
              {step.description && (
                <p
                  className={`text-sm mt-0.5 ${
                    step.status === "current" ? step.color : "text-white/50"
                  }`}
                >
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pending Warning for Admin */}
      {isAdmin && status === "pending" && daysSinceRequest > 3 && (
        <div
          className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
            daysSinceRequest > 7
              ? "bg-red-500/10 text-red-400"
              : "bg-yellow-500/10 text-yellow-400"
          }`}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            {daysSinceRequest > 7
              ? "Service has been pending for over a week. Follow up with client."
              : `Service pending for ${daysSinceRequest} days. Consider following up.`}
          </span>
        </div>
      )}

      {/* Quick Summary */}
      {status === "active" && activatedAt && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Billing started</span>
            <span className="text-green-400 font-medium">
              {format(new Date(activatedAt), "MMMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-white/70">Days active</span>
            <span className="text-brand-primary font-medium">
              {differenceInDays(now, new Date(activatedAt))} days
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for table/card view
interface LifecycleStatusProps {
  status: "pending" | "active" | "paused" | "cancelled";
  createdAt: Date | string;
  activatedAt?: Date | string | null;
  daysSinceRequest?: number | null;
}

export function LifecycleStatus({
  status,
  createdAt,
  activatedAt,
  daysSinceRequest,
}: LifecycleStatusProps) {
  if (status === "pending") {
    const days = daysSinceRequest ?? differenceInDays(new Date(), new Date(createdAt));
    return (
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 text-sm ${
            days > 7
              ? "text-red-400"
              : days > 3
              ? "text-yellow-400"
              : "text-blue-400"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{days}d pending</span>
        </div>
        <ArrowRight className="w-3 h-3 text-white/30" />
        <span className="text-white/30 text-sm">Awaiting activation</span>
      </div>
    );
  }

  if (status === "active" && activatedAt) {
    const daysActive = differenceInDays(new Date(), new Date(activatedAt));
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1.5 text-green-400">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Active {daysActive}d</span>
        </div>
        <span className="text-white/50">
          since {format(new Date(activatedAt), "MMM d")}
        </span>
      </div>
    );
  }

  if (status === "paused") {
    return (
      <div className="flex items-center gap-1.5 text-sm text-yellow-400">
        <Pause className="w-3.5 h-3.5" />
        <span>Paused</span>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-1.5 text-sm text-red-400">
        <XCircle className="w-3.5 h-3.5" />
        <span>Cancelled</span>
      </div>
    );
  }

  return null;
}
