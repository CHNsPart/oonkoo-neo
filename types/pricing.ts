export type BillingInterval = 'monthly' | 'annually';

export interface PricingTier {
  id: string;
  name: string;
  cost: number;
  icon?: string;
}

export interface Feature {
  type: 'toggle' | 'select' | 'tiers' | 'included';
  value: boolean | string;
  cost: number;
  name?: string;
  isRecurring?: boolean;
  monthlyRate?: number;
  annualRate?: number;
}

export interface PlanFeature {
  id: string;
  name: string;
  type: 'toggle' | 'select' | 'tiers' | 'included';
  cost?: number;
  options?: { id: string; name: string; cost: number; icon?: string; }[];
  tiers?: PricingTier[];
  description?: string;
  selectedOption?: PricingTier | { id: string; name: string; cost: number; icon?: string; };
}

export interface Plan {
  id: string;
  name: string;
  icon?: string;
  description: string;
  basePrice: {
    monthly: number;
    annually: number;
  };
  maintenanceCost: {
    monthly: number;
    annually: number;
  };
  hostingCost: {
    monthly: number;
    annually: number;
  };
  digitalMarketingCost: {
    monthly: number;
    annually: number;
  }
  socialMediaCost: {
    monthly: number;
    annually: number;
  };
  features: PlanFeature[];
  isEnterprise?: boolean;
  hideHosting?: boolean;
  hideDigital?: boolean;
  hideSocial?: boolean;
}