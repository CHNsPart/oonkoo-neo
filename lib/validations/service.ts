import * as z from "zod";
import { servicePlans } from "@/constants/services";

const serviceIds = servicePlans.map(plan => plan.id);

// New schema for initial service creation
export const initialServiceSchema = z.object({
  serviceId: z.enum(serviceIds as [string, ...string[]]),
  billingInterval: z.enum(['monthly', 'annually']),
  status: z.enum(['pending']).default('pending'),
  meetingTime: z.string().nullable().optional(),
});

// Schema for user service creation/updates
// export const userServiceSchema = z.object({
//   serviceId: z.enum(serviceIds as [string, ...string[]]),
//   billingInterval: z.enum(['monthly', 'annually']),
//   // Only allow paused/cancelled when editing
//   status: z.enum(['pending', 'paused', 'cancelled']),
//   meetingTime: z.string().nullable().optional(),
// }).superRefine((data, ctx) => {
//   // If status is pending, it must be a new service
//   if (data.status === 'pending') {
//     // Add any additional validations for new services
//   } else {
//     // For existing services, only allow paused or cancelled
//     if (!['paused', 'cancelled'].includes(data.status)) {
//       ctx.addIssue({
//         code: 'custom',
//         message: 'Users can only pause or cancel existing services',
//         path: ['status']
//       });
//     }
//   }
// });
export const userServiceSchema = z.object({
  serviceId: z.enum(['maintenance', 'hosting', 'digital-marketing', 'social-media']),
  billingInterval: z.enum(['monthly', 'annually']),
  status: z.enum(['pending', 'paused', 'cancelled']),
  meetingTime: z.string().nullable().optional(),
});

// Schema for admin service creation/updates
export const adminServiceSchema = z.object({
  serviceId: z.enum(serviceIds as [string, ...string[]]),
  billingInterval: z.enum(['monthly', 'annually']),
  status: z.enum(['pending', 'active', 'paused', 'cancelled']),
  meetingTime: z.string().nullable().optional(),
  userEmail: z.string().email(),
});

export type InitialServiceFormData = z.infer<typeof initialServiceSchema>;
export type UserServiceFormData = z.infer<typeof userServiceSchema>;
export type AdminServiceFormData = z.infer<typeof adminServiceSchema>;