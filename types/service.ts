export interface ServicePrice {
  monthly: number;
  annually: number;
}

export interface ServicePlan {
  id: string;
  title: string;
  description: string;
  serviceDescription: string[];
  icon: string;
  price: ServicePrice;
}

// External Link Types
export type ExternalLinkType =
  | "github"
  | "gitlab"
  | "bitbucket"
  | "google-drive"
  | "dropbox"
  | "onedrive"
  | "figma"
  | "adobe-xd"
  | "canva"
  | "other";

export interface ExternalLink {
  type: ExternalLinkType;
  url: string;
  label: string;
}

// External Link Type Metadata for UI
export const EXTERNAL_LINK_TYPES: Record<
  ExternalLinkType,
  { label: string; icon: string; category: string }
> = {
  github: { label: "GitHub", icon: "Github", category: "Code Repository" },
  gitlab: { label: "GitLab", icon: "GitBranch", category: "Code Repository" },
  bitbucket: {
    label: "Bitbucket",
    icon: "Container",
    category: "Code Repository",
  },
  "google-drive": {
    label: "Google Drive",
    icon: "HardDrive",
    category: "File Storage",
  },
  dropbox: { label: "Dropbox", icon: "Droplet", category: "File Storage" },
  onedrive: { label: "OneDrive", icon: "Cloud", category: "File Storage" },
  figma: { label: "Figma", icon: "Figma", category: "Design Tools" },
  "adobe-xd": { label: "Adobe XD", icon: "Layers", category: "Design Tools" },
  canva: { label: "Canva", icon: "Palette", category: "Design Tools" },
  other: { label: "Other", icon: "Link", category: "Other" },
};

// Billing Period Calculation Result
export interface BillingPeriod {
  startDate: Date;
  endDate: Date;
  daysRemaining: number;
  totalDays: number;
  progressPercent: number;
  isOverdue: boolean;
  renewalDate: Date;
  renewalInDays: number;
}

// User Service with all fields
export interface UserService extends ServicePlan {
  id: string;
  serviceId: string;
  userId: string;
  userEmail: string;
  billingInterval: "monthly" | "annually";
  status: "pending" | "active" | "paused" | "cancelled";
  meetingTime?: Date | null;
  startDate: Date;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Lifecycle Fields
  activatedAt?: Date | null;
  paymentReceivedAt?: Date | null;

  // Notes Fields
  userNotes?: string | null;
  adminNotes?: string | null;

  // External Links
  externalLinks?: ExternalLink[];

  // Calculated Fields (from API)
  billingPeriod?: BillingPeriod | null;
  daysSinceRequest?: number | null;

  // User info (from join)
  user?: {
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
  };
}
