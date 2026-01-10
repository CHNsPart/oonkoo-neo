import * as z from "zod";
import { servicePlans } from "@/constants/services";

const serviceIds = servicePlans.map((plan) => plan.id);

// External Link Types
const externalLinkTypes = [
  "github",
  "gitlab",
  "bitbucket",
  "google-drive",
  "dropbox",
  "onedrive",
  "figma",
  "adobe-xd",
  "canva",
  "other",
] as const;

// External Link Schema
export const externalLinkSchema = z.object({
  type: z.enum(externalLinkTypes),
  url: z.string().url("Please enter a valid URL"),
  label: z.string().min(1, "Label is required").max(100, "Label too long"),
});

// Schema for initial service creation (from pricing page)
export const initialServiceSchema = z.object({
  serviceId: z.enum(serviceIds as [string, ...string[]]),
  billingInterval: z.enum(["monthly", "annually"]),
  status: z.enum(["pending"]).default("pending"),
  meetingTime: z.string().nullable().optional(),
  userNotes: z.string().max(2000, "Notes too long").nullable().optional(),
  externalLinks: z.array(externalLinkSchema).max(10).optional().default([]),
});

// Schema for user service updates (can only pause/cancel)
export const userServiceSchema = z.object({
  serviceId: z.enum(serviceIds as [string, ...string[]]),
  billingInterval: z.enum(["monthly", "annually"]),
  status: z.enum(["pending", "paused", "cancelled"]),
  meetingTime: z.string().nullable().optional(),
  userNotes: z.string().max(2000, "Notes too long").nullable().optional(),
  externalLinks: z.array(externalLinkSchema).max(10).optional(),
});

// Schema for admin service creation/updates (full control)
export const adminServiceSchema = z.object({
  serviceId: z.enum(serviceIds as [string, ...string[]]),
  billingInterval: z.enum(["monthly", "annually"]),
  status: z.enum(["pending", "active", "paused", "cancelled"]),
  meetingTime: z.string().nullable().optional(),
  userEmail: z.string().email(),
  userNotes: z.string().max(2000, "Notes too long").nullable().optional(),
  adminNotes: z.string().max(2000, "Notes too long").nullable().optional(),
  externalLinks: z.array(externalLinkSchema).max(10).optional(),
  activatedAt: z.string().nullable().optional(),
  paymentReceivedAt: z.string().nullable().optional(),
});

// Schema for service activation (admin only)
export const serviceActivationSchema = z.object({
  adminNotes: z.string().max(2000, "Notes too long").nullable().optional(),
});

// Export types
export type ExternalLinkFormData = z.infer<typeof externalLinkSchema>;
export type InitialServiceFormData = z.infer<typeof initialServiceSchema>;
export type UserServiceFormData = z.infer<typeof userServiceSchema>;
export type AdminServiceFormData = z.infer<typeof adminServiceSchema>;
export type ServiceActivationFormData = z.infer<typeof serviceActivationSchema>;
