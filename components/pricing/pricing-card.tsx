"use client";

import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { Plan, BillingInterval } from "@/types/pricing";
import { cn } from "@/lib/utils";
import PricingMeetingModal from "./pricing-meeting-modal";
import { ContactModal } from "../ui/contact-modal";

interface PricingCardProps {
  plan: Plan;
  billingInterval: BillingInterval;
  className?: string;
}

interface FeatureState {
  [key: string]: {
    type: 'toggle' | 'select' | 'tiers';
    value: boolean | string;
  };
}

export function PricingCard({ plan, billingInterval, className }: PricingCardProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Memoize the feature lookup maps for O(1) access
  const featureMaps = useMemo(() => {
    const toggleFeatures = new Map();
    const tierFeatures = new Map();
    const selectFeatures = new Map();

    plan.features.forEach(feature => {
      if (feature.type === 'toggle') {
        toggleFeatures.set(feature.id, feature);
      } else if (feature.type === 'tiers') {
        tierFeatures.set(feature.id, feature);
      } else if (feature.type === 'select') {
        selectFeatures.set(feature.id, feature);
      }
    });

    return {
      toggle: toggleFeatures,
      tiers: tierFeatures,
      select: selectFeatures
    };
  }, [plan.features]);

  // Memoize recurring costs calculation
  const recurringCosts = useMemo(() => {
    if (plan.isEnterprise) return null;

    const maintenance = selectedFeatures.maintenance?.value === true;
    const hosting = selectedFeatures.hosting?.value === true;

    const monthlyCost = 
      (maintenance ? plan.maintenanceCost.monthly : 0) +
      (hosting ? plan.hostingCost.monthly : 0);

    const annualCost = 
      (maintenance ? plan.maintenanceCost.annually : 0) +
      (hosting ? plan.hostingCost.annually : 0);

    return {
      monthly: monthlyCost,
      annually: annualCost,
      originalAnnual: monthlyCost * 12
    };
  }, [plan, selectedFeatures.maintenance, selectedFeatures.hosting]);

  // Memoize one-time costs calculation
  const oneTimeCosts = useMemo(() => {
    if (plan.isEnterprise) return 0;

    let total = 0;

    // Use our memoized feature maps for O(1) lookups
    Object.entries(selectedFeatures).forEach(([featureId, feature]) => {
      // Skip maintenance and hosting
      if (featureId === 'maintenance' || featureId === 'hosting') return;

      // Check toggle features
      const toggleFeature = featureMaps.toggle.get(featureId);
      if (toggleFeature && feature.value === true) {
        total += toggleFeature.cost || 0;
        return;
      }

      // Check tier features
      const tierFeature = featureMaps.tiers.get(featureId);
      if (tierFeature && typeof feature.value === 'string') {
        const selectedTier = tierFeature.tiers?.find((t: { id: string | boolean; }) => t.id === feature.value);
        if (selectedTier) {
          total += selectedTier.cost;
          return;
        }
      }

      // Check select features
      const selectFeature = featureMaps.select.get(featureId);
      if (selectFeature && typeof feature.value === 'string') {
        const selectedOption = selectFeature.options?.find((o: { id: string | boolean; }) => o.id === feature.value);
        if (selectedOption) {
          total += selectedOption.cost;
        }
      }
    });

    return total;
  }, [selectedFeatures, featureMaps]);

  // Memoize total costs
  const totalCosts = useMemo(() => {
    if (plan.isEnterprise || !recurringCosts) return null;

    const recurring = billingInterval === 'annually' 
      ? recurringCosts.annually 
      : recurringCosts.monthly;

    return {
      oneTime: oneTimeCosts,
      recurring,
      originalRecurring: billingInterval === 'annually' 
        ? recurringCosts.originalAnnual 
        : recurringCosts.monthly
    };
  }, [billingInterval, oneTimeCosts, recurringCosts, plan.isEnterprise]);

  // Optimize feature change handler with useCallback
  const handleFeatureChange = useCallback((featureId: string, value: boolean | string, type: 'toggle' | 'select' | 'tiers') => {
    setSelectedFeatures(prev => ({
      ...prev,
      [featureId]: {
        type,
        value
      }
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6 flex flex-col h-full",
        className
      )}
      >
      {plan.isEnterprise ? (
        <div className="flex flex-col justify-between h-full">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-white/70 mt-2">{plan.description}</p>
            </div>
          </div>
          <button 
            className="w-full mt-6 px-6 py-3 bg-brand-primary rounded-full text-black font-medium hover:bg-brand-primary/90 transition-colors"
            onClick={() => setIsContactModalOpen(true)}
          >
            Get a Quote
          </button>

          <ContactModal
            open={isContactModalOpen}
            onOpenChange={setIsContactModalOpen}
            type="Website"
            origin="Enterprise Quote"
          />
        </div>
      ) : (
        <>        
          <div className="mb-6">
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <p className="text-white/70 mt-2">{plan.description}</p>
          </div>

          <div className="space-y-6 flex-1">
            {/* Recurring Costs Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Recurring Costs</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Maintenance</span>
                  <Switch
                    checked={selectedFeatures.maintenance?.value === true}
                    onCheckedChange={(checked) => handleFeatureChange('maintenance', checked, 'toggle')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">OonkoO Hosting</span>
                  <Switch
                    checked={selectedFeatures.hosting?.value === true}
                    onCheckedChange={(checked) => handleFeatureChange('hosting', checked, 'toggle')}
                  />
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Features</h4>
              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature.id} className="space-y-2">
                    {feature.type === 'toggle' && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">{feature.name}</span>
                        <Switch
                          checked={selectedFeatures[feature.id]?.value === true}
                          onCheckedChange={(checked) => handleFeatureChange(feature.id, checked, 'toggle')}
                        />
                      </div>
                    )}
                    {feature.type === 'select' && feature.options && (
                      <div className="space-y-1.5">
                        <span className="text-white/70">{feature.name}</span>
                        <Select
                          value={selectedFeatures[feature.id]?.value as string}
                          onValueChange={(value) => handleFeatureChange(feature.id, value, 'select')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            {feature.options.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {feature.type === 'tiers' && feature.tiers && (
                      <div className="space-y-1.5">
                        <span className="text-white/70">{feature.name}</span>
                        <Select
                          value={selectedFeatures[feature.id]?.value as string}
                          onValueChange={(value) => handleFeatureChange(feature.id, value, 'tiers')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tier" />
                          </SelectTrigger>
                          <SelectContent>
                            {feature.tiers.map((tier) => (
                              <SelectItem key={tier.id} value={tier.id}>
                                {tier.name} - ${tier.cost.toLocaleString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {feature.type === 'included' && (
                      <div className="flex items-center gap-2 text-white/70">
                        <CheckCircle className="w-4 h-4 text-brand-primary" />
                        <span>{feature.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total Cost */}
          {!plan.isEnterprise && totalCosts && (
            <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
              <div className="space-y-1">
                <div className="text-sm text-white/70">One-time Payment</div>
                <div className="text-2xl font-bold">
                  ${totalCosts.oneTime.toLocaleString()}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-white/70">
                  Recurring {billingInterval === 'annually' ? 'Annual' : 'Monthly'}
                </div>
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-bold">
                    ${totalCosts.recurring.toLocaleString()}
                  </div>
                  {billingInterval === 'annually' && (
                    <div className="text-sm text-white/50 line-through mb-1">
                      ${totalCosts.originalRecurring.toLocaleString()}
                    </div>
                  )}
                  <div className="text-sm text-brand-primary mb-1">
                    {billingInterval === 'annually' && '(Save 20%)'}
                  </div>
                </div>
                <div className="text-sm text-white/50">
                  /{billingInterval === 'annually' ? 'year' : 'month'}
                </div>
              </div>
              <button 
                className="w-full mt-6 px-6 py-3 bg-brand-primary rounded-full text-black font-medium hover:bg-brand-primary/90 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                Fix a Meeting
              </button>
            </div>
          )}
        </>
      )}
      <PricingMeetingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedFeatures={selectedFeatures as Record<string, { type: "toggle" | "select" | "tiers" | "included"; value: string | boolean; cost: number; }>}
        totalCosts={totalCosts}
        billingInterval={billingInterval}
        plan={plan.id}
      />
    </motion.div>
  );
}