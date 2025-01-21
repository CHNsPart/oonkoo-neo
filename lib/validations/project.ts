import * as z from "zod";
import { pricingPlans } from "@/constants/pricing";

const planIds = pricingPlans.map(plan => plan.id);

// Feature value schema with more specific typing
const featureValueSchema = z.object({
  type: z.enum(['toggle', 'select', 'tiers', 'included']),
  value: z.union([z.boolean(), z.string(), z.number()]),
  cost: z.number(),
  name: z.string().optional(),
});

// Updated schema with new features structure
export const projectSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  meetingTime: z.string().nullable().optional(),
  planType: z.enum(planIds as [string, ...string[]]),
  features: z.record(z.string(), featureValueSchema),
  oneTimePrice: z.number(),
  recurringPrice: z.number(),
  recurringInterval: z.enum(['monthly', 'annually']),
  originalPrice: z.number().optional(),
  totalPrice: z.number(),
  status: z.enum(['pending', 'approved', 'rejected', 'completed']).optional().default('pending'),
});

export const updateSchema = projectSchema.partial();

export type ProjectFormData = z.infer<typeof projectSchema>;
