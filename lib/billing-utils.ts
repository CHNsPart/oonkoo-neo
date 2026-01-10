import {
  addMonths,
  addYears,
  differenceInDays,
  isPast,
  format,
} from "date-fns";
import { BillingPeriod } from "@/types/service";

/**
 * Calculate end date based on activation date and billing interval
 * This is the billing period end date (when renewal is due)
 */
export function calculateEndDate(
  activatedAt: Date | string | null | undefined,
  billingInterval: "monthly" | "annually"
): Date | null {
  if (!activatedAt) return null;

  const startDate = new Date(activatedAt);

  return billingInterval === "monthly"
    ? addMonths(startDate, 1)
    : addYears(startDate, 1);
}

/**
 * Calculate billing period based on activatedAt date
 * If not activated, returns null
 */
export function calculateBillingPeriod(
  activatedAt: Date | string | null | undefined,
  billingInterval: "monthly" | "annually"
): BillingPeriod | null {
  if (!activatedAt) return null;

  const now = new Date();
  const startDate = new Date(activatedAt);

  // Find the current billing period
  // Start from activation date and move forward until we find the current period
  let currentPeriodStart = new Date(startDate);
  let currentPeriodEnd =
    billingInterval === "monthly"
      ? addMonths(currentPeriodStart, 1)
      : addYears(currentPeriodStart, 1);

  // If past the first period, calculate current period
  while (isPast(currentPeriodEnd) && differenceInDays(now, currentPeriodEnd) > 0) {
    currentPeriodStart = currentPeriodEnd;
    currentPeriodEnd =
      billingInterval === "monthly"
        ? addMonths(currentPeriodStart, 1)
        : addYears(currentPeriodStart, 1);
  }

  const totalDays = differenceInDays(currentPeriodEnd, currentPeriodStart);
  const daysPassed = differenceInDays(now, currentPeriodStart);
  const daysRemaining = Math.max(0, differenceInDays(currentPeriodEnd, now));

  const progressPercent = Math.min(
    100,
    Math.max(0, (daysPassed / totalDays) * 100)
  );
  const isOverdue = isPast(currentPeriodEnd);

  return {
    startDate: currentPeriodStart,
    endDate: currentPeriodEnd,
    daysRemaining,
    totalDays,
    progressPercent,
    isOverdue,
    renewalDate: currentPeriodEnd,
    renewalInDays: daysRemaining,
  };
}

/**
 * Get renewal status message based on days remaining
 */
export function getRenewalStatusMessage(daysRemaining: number): string {
  if (daysRemaining <= 0) return "Renewal overdue";
  if (daysRemaining === 1) return "Renews tomorrow";
  if (daysRemaining <= 3) return `Renews in ${daysRemaining} days`;
  if (daysRemaining <= 7) return `Renews in ${daysRemaining} days`;
  if (daysRemaining <= 14) return "Renews in 2 weeks";
  if (daysRemaining <= 30) return "Renews this month";
  return `Renews in ${daysRemaining} days`;
}

/**
 * Get renewal urgency level for styling
 */
export function getRenewalUrgency(
  daysRemaining: number
): "critical" | "warning" | "normal" {
  if (daysRemaining <= 3) return "critical";
  if (daysRemaining <= 7) return "warning";
  return "normal";
}

/**
 * Calculate days since request for pending services
 */
export function getDaysSinceRequest(createdAt: Date | string): number {
  return differenceInDays(new Date(), new Date(createdAt));
}

/**
 * Format billing period for display
 */
export function formatBillingPeriod(
  startDate: Date | string,
  endDate: Date | string
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMMM d, yyyy");
}

/**
 * Format date with day of week
 */
export function formatDateWithDay(date: Date | string): string {
  return format(new Date(date), "EEEE, MMMM d, yyyy");
}

/**
 * Get urgency color classes for UI
 */
export function getUrgencyColors(urgency: "critical" | "warning" | "normal"): {
  text: string;
  bg: string;
  border: string;
  progress: string;
} {
  switch (urgency) {
    case "critical":
      return {
        text: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        progress: "bg-red-500",
      };
    case "warning":
      return {
        text: "text-yellow-500",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        progress: "bg-yellow-500",
      };
    default:
      return {
        text: "text-brand-primary",
        bg: "bg-brand-primary/10",
        border: "border-brand-primary/20",
        progress: "bg-brand-primary",
      };
  }
}
