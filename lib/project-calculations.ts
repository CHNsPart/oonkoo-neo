"use client";

import { PlanFeature, Feature } from "@/types/pricing";

// Calculate one-time costs from features
export function calculateOneTimeCosts(
  selectedFeatures: Record<string, { type: string; value: boolean | string; cost?: number }>,
  planFeatures: PlanFeature[],
  customFeatures: { id: string; type: string; value: boolean | string; cost: number; isRecurring?: boolean }[]
): number {
  let total = 0;

  // Process predefined features
  Object.entries(selectedFeatures).forEach(([featureId, feature]) => {
    // Skip recurring services
    if (['maintenance', 'hosting', 'digitalMarketing', 'socialMedia'].includes(featureId)) {
      return;
    }

    if (feature.type === 'toggle' && feature.value === true) {
      // Direct cost for toggle features
      total += feature.cost || 0;
    } else if (feature.type === 'select' && typeof feature.value === 'string') {
      // Find the selected option for select features
      const selectFeature = planFeatures.find(f => f.id === featureId && f.type === 'select');
      if (selectFeature?.options) {
        const selectedOption = selectFeature.options.find(opt => opt.id === feature.value);
        if (selectedOption) {
          total += selectedOption.cost;
        }
      }
    } else if (feature.type === 'tiers' && typeof feature.value === 'string') {
      // Find the selected tier for tier features
      const tierFeature = planFeatures.find(f => f.id === featureId && f.type === 'tiers');
      if (tierFeature?.tiers) {
        const selectedTier = tierFeature.tiers.find(t => t.id === feature.value);
        if (selectedTier) {
          total += selectedTier.cost;
        }
      }
    }
  });

  // Add one-time custom features
  customFeatures
    .filter(f => !f.isRecurring && f.value === true)
    .forEach(feature => {
      total += feature.cost;
    });

  return total;
}

// Calculate recurring costs
export function calculateRecurringCosts(
  selectedFeatures: Record<string, { type: string; value: boolean | string; cost?: number }>,
  billingInterval: 'monthly' | 'annually',
  maintenanceCost: { monthly: number; annually: number },
  hostingCost: { monthly: number; annually: number },
  digitalMarketingCost: { monthly: number; annually: number },
  socialMediaCost: { monthly: number; annually: number },
  customFeatures: { id: string; type: string; value: boolean | string; cost: number; isRecurring?: boolean }[]
): { recurring: number; originalMonthly: number } {
  const maintenance = selectedFeatures.maintenance?.value === true;
  const hosting = selectedFeatures.hosting?.value === true;
  const digitalMarketing = selectedFeatures.digitalMarketing?.value === true;
  const socialMedia = selectedFeatures.socialMedia?.value === true;

  // Calculate monthly costs
  const monthlyBase = 
    (maintenance ? maintenanceCost.monthly : 0) +
    (hosting ? hostingCost.monthly : 0) +
    (digitalMarketing ? digitalMarketingCost.monthly : 0) +
    (socialMedia ? socialMediaCost.monthly : 0);

  // Add recurring custom features (monthly rate)
  const monthlyCustom = customFeatures
    .filter(f => f.isRecurring && f.value === true)
    .reduce((sum, feature) => sum + feature.cost, 0);

  const totalMonthly = monthlyBase + monthlyCustom;

  // Calculate based on billing interval
  if (billingInterval === 'annually') {
    // Annual is 20% less than monthly * 12
    return {
      recurring: totalMonthly * 12 * 0.8,
      originalMonthly: totalMonthly
    };
  }

  return {
    recurring: totalMonthly,
    originalMonthly: totalMonthly
  };
}

// Get feature cost based on its type
export function getFeatureCost(
  feature: { type: string; value: boolean | string },
  featureDefinition: PlanFeature | undefined
): number {
  if (!featureDefinition) return 0;

  if (feature.type === 'toggle' && feature.value === true) {
    return featureDefinition.cost || 0;
  }

  if (feature.type === 'select' && typeof feature.value === 'string') {
    const selectedOption = featureDefinition.options?.find(o => o.id === feature.value);
    return selectedOption?.cost || 0;
  }

  if (feature.type === 'tiers' && typeof feature.value === 'string') {
    const selectedTier = featureDefinition.tiers?.find(t => t.id === feature.value);
    return selectedTier?.cost || 0;
  }

  return 0;
}

// Format feature data for API submission
export function formatFeaturesForSubmission(
  selectedFeatures: Record<string, { type: string; value: boolean | string }>,
  planFeatures: PlanFeature[],
  customFeatures: {
    monthlyRate: number;
    annualRate: number; id: string; name: string; type: string; value: boolean | string; cost: number; isRecurring?: boolean 
}[],
  billingInterval: 'monthly' | 'annually',
  maintenanceCost: { monthly: number; annually: number },
  hostingCost: { monthly: number; annually: number },
  digitalMarketingCost: { monthly: number; annually: number },
  socialMediaCost: { monthly: number; annually: number }
): Record<string, Feature> {
  const formattedFeatures: Record<string, Feature> = {};

  // Process predefined features
  Object.entries(selectedFeatures).forEach(([featureId, feature]) => {
    if (!feature.value && feature.type === 'toggle') {
      return; // Skip unselected toggle features
    }

    let cost = 0;
    let name: string | undefined;
    let featureType: 'toggle' | 'select' | 'tiers' = 'toggle'; // Default

    // Convert feature type string to the correct enum type
    if (feature.type === 'select') {
      featureType = 'select';
    } else if (feature.type === 'tiers') {
      featureType = 'tiers';
    }

    // Special handling for maintenance, hosting, etc.
    if (featureId === 'maintenance' && feature.value === true) {
      cost = maintenanceCost[billingInterval];
      name = 'Maintenance';
    } else if (featureId === 'hosting' && feature.value === true) {
      cost = hostingCost[billingInterval];
      name = 'Hosting';
    } else if (featureId === 'digitalMarketing' && feature.value === true) {
      cost = digitalMarketingCost[billingInterval];
      name = 'Digital Marketing';
    } else if (featureId === 'socialMedia' && feature.value === true) {
      cost = socialMediaCost[billingInterval];
      name = 'Social Media Management';
    } else {
      // Get cost from plan features
      const planFeature = planFeatures.find(f => f.id === featureId);
      cost = getFeatureCost(feature, planFeature);
      name = planFeature?.name;
    }

    formattedFeatures[featureId] = {
      type: featureType,
      value: feature.value,
      cost,
      name
    };
  });

  // Add custom features
  customFeatures.forEach(feature => {
    if (feature.value === true) {
      // Ensure type is properly converted to the enum type
      const featureType: 'toggle' | 'select' | 'tiers' = 
        feature.type === 'select' ? 'select' :
        feature.type === 'tiers' ? 'tiers' : 'toggle';
        
      formattedFeatures[feature.id] = {
        type: featureType,
        value: feature.value,
        cost: feature.cost,
        name: feature.name,
        // Add these properties to preserve recurring information
        isRecurring: feature.isRecurring || false,
        monthlyRate: feature.monthlyRate || feature.cost,
        annualRate: feature.annualRate || (feature.cost * 12 * 0.8)
      };
    }
  });

  return formattedFeatures;
}