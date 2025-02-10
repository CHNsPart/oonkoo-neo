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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, HelpCircle } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { Plan, BillingInterval } from "@/types/pricing";
import { cn, Currency } from "@/lib/utils";
import PricingMeetingModal from "./pricing-meeting-modal";
import { ContactModal } from "../../ui/contact-modal";
import { formatCurrency } from '@/lib/utils';

interface PricingCardProps {
  plan: Plan;
  billingInterval: BillingInterval;
  currency: Currency;
  className?: string;
}

interface FeatureState {
  [key: string]: {
    type: 'toggle' | 'select' | 'tiers';
    value: boolean | string;
  };
}

const tooltips = {
  maintenance: "Regular updates, bug fixes, security patches, domain email intgrations and ongoing technical support. Everything you need to keep your solution running smoothly.",
  hosting: "Secure, scalable cloud hosting with 99.9% uptime guarantee, SSL certificates, and daily backups. We provide 3rd party hosting solution tailored to your needs. This price is for a starter plan. According to your user base and traffic, the price may vary.",
  digitalMarketing: "Comprehensive digital marketing services including SEO-optimized blog writing with backlinks, content marketing according to brandings, and PPC campaigns. We also provide automated email marketing with lead generation. This plan also has google console integration with analytics, user tracking, and conversion tracking.",
  socialMedia: "Full social media management including content creation, scheduling, and engagement monitoring. (Meta, X, LinkedIn and other platforms)",
} as const;

export function PricingCard({ plan, billingInterval, className, currency }: PricingCardProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const renderTooltip = useCallback((content: string, children: React.ReactNode) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            {children}
            <HelpCircle className="w-4 h-4 text-white/40" />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          className="bg-black/90 text-white border-brand-primary border-2 rounded-xl backdrop-blur-xl p-3 max-w-xs text-sm"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ), []);

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

  // const selectedMaintenanceValue = selectedFeatures.maintenance?.value;
  // const selectedHostingValue = selectedFeatures.hosting?.value;
  // const selectedDigitalValue = selectedFeatures.digitalMarketing?.value;
  // const selectedSocialValue = selectedFeatures.socialMedia?.value;

  // Memoize recurring costs calculation
  const recurringCosts = useMemo(() => {
    if (plan.isEnterprise) return null;
  
    const maintenance = selectedFeatures.maintenance?.value === true;
    const hosting = selectedFeatures.hosting?.value === true;
    const digitalMarketing = selectedFeatures.digitalMarketing?.value === true;
    const socialMedia = selectedFeatures.socialMedia?.value === true;
  
    const monthlyCost = 
      (maintenance ? plan.maintenanceCost.monthly : 0) +
      (hosting ? plan.hostingCost.monthly : 0) +
      (digitalMarketing ? plan.digitalMarketingCost.monthly : 0) +
      (socialMedia ? plan.socialMediaCost.monthly : 0);
  
    const annualCost = 
      (maintenance ? plan.maintenanceCost.annually : 0) +
      (hosting ? plan.hostingCost.annually : 0) +
      (digitalMarketing ? plan.digitalMarketingCost.annually : 0) +
      (socialMedia ? plan.socialMediaCost.annually : 0);
  
    return {
      monthly: monthlyCost,
      annually: annualCost,
      originalAnnual: monthlyCost * 12
    };
  }, [plan, selectedFeatures.maintenance, selectedFeatures.hosting, selectedFeatures.digitalMarketing, selectedFeatures.socialMedia]);
  // Memoize one-time costs calculation
  const oneTimeCosts = useMemo(() => {
    if (plan.isEnterprise) return 0;

    let total = 0;

    // Use our memoized feature maps for O(1) lookups
    Object.entries(selectedFeatures).forEach(([featureId, feature]) => {
      // Skip maintenance and hosting
      if (featureId === 'maintenance' || 
          featureId === 'hosting' || 
          featureId === 'digitalMarketing' || 
          featureId === 'socialMedia') return;

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
            <span className="flex items-center gap-2">
              <img src={plan.icon} className="size-6" />
              <h3 className="text-2xl font-bold">{plan.name}</h3>
            </span>
            <p className="text-white/70 mt-2">{plan.description}</p>
          </div>

          <div className="space-y-6 flex-1">
            {/* Recurring Costs Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Recurring Costs</h4>
              <div className="space-y-3">
                {/* Maintenance Switch */}
                <div className="flex items-center justify-between">
                  {renderTooltip(
                    tooltips.maintenance,
                    <span className="text-white/70">
                      Maintenance 
                      {selectedFeatures.maintenance?.value && (
                        <span className="ml-2 text-xs font-mono text-brand-primary">
                          ({formatCurrency(plan.maintenanceCost[billingInterval], currency)}/{billingInterval})
                        </span>
                      )}
                    </span>
                  )}
                  <Switch
                    checked={selectedFeatures.maintenance?.value === true}
                    onCheckedChange={(checked) => handleFeatureChange('maintenance', checked, 'toggle')}
                  />
                </div>

                {/* Hosting Switch */}
                {!plan.hideHosting && (
                  <div className="flex items-center justify-between">
                    {renderTooltip(
                      tooltips.hosting,
                      <span className="text-white/70">
                        OonkoO Hosting
                        {selectedFeatures.hosting?.value && (
                          <span className="ml-2 text-xs font-mono text-brand-primary">
                            ({formatCurrency(plan.hostingCost[billingInterval], currency)}/{billingInterval})
                          </span>
                        )}
                      </span>
                    )}
                    <Switch
                      checked={selectedFeatures.hosting?.value === true}
                      onCheckedChange={(checked) => handleFeatureChange('hosting', checked, 'toggle')}
                    />
                  </div>
                )}

                {/* Digital Marketing Switch */}
                {!plan.hideDigital && (
                  <div className="flex items-center justify-between">
                    {renderTooltip(
                      tooltips.digitalMarketing,
                      <span className="text-white/70">
                        Digital Marketing
                        {selectedFeatures.digitalMarketing?.value && (
                          <span className="ml-2 text-xs font-mono text-brand-primary">
                            ({formatCurrency(plan.digitalMarketingCost[billingInterval], currency)}/{billingInterval})
                          </span>
                        )}
                      </span>
                    )}
                    <Switch
                      checked={selectedFeatures.digitalMarketing?.value === true}
                      onCheckedChange={(checked) => handleFeatureChange('digitalMarketing', checked, 'toggle')}
                    />
                  </div>
                )}

                {/* Social Media Switch */}
                {!plan.hideSocial && (
                  <div className="flex items-center justify-between">
                    {renderTooltip(
                      tooltips.socialMedia,
                      <span className="text-white/70">
                        Social Media Management
                        {selectedFeatures.socialMedia?.value && (
                          <span className="ml-2 text-xs font-mono text-brand-primary">
                            ({formatCurrency(plan.socialMediaCost[billingInterval], currency)}/{billingInterval})
                          </span>
                        )}
                      </span>
                    )}
                    <Switch
                      checked={selectedFeatures.socialMedia?.value === true}
                      onCheckedChange={(checked) => handleFeatureChange('socialMedia', checked, 'toggle')}
                    />
                  </div>
                )}
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
                        {renderTooltip(
                          tooltips[feature.id as keyof typeof tooltips] || feature.description || '',
                          <span className="text-white/70">
                            {feature.name} 
                            {selectedFeatures[feature.id]?.value === true && (
                              <span className="text-xs ml-2 font-mono text-brand-primary">
                                {"("+formatCurrency(feature.cost || 0, currency)+")"}
                              </span>
                            )}
                            {/* <span className="text-sm ml-1.5 font-mono text-brand-primary">
                              {formatCurrency(feature.cost || 0, currency)}
                            </span> */}
                          </span>
                        )}
                        <Switch
                          checked={selectedFeatures[feature.id]?.value === true}
                          onCheckedChange={(checked) => handleFeatureChange(feature.id, checked, 'toggle')}
                        />
                      </div>
                    )}
                    {feature.type === 'select' && feature.options && (
                      <div className="space-y-1.5">
                        {renderTooltip(
                          feature.description || '',
                          <span className="text-white/70">{feature.name}</span>
                        )}
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
                                <div className="flex items-center gap-2">
                                  {option.icon && (
                                    <img 
                                      src={option.icon} 
                                      alt={option.name} 
                                      className="size-4 object-contain"
                                    />
                                  )}
                                  <span>{option.name} - {formatCurrency(option.cost, currency)}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {feature.type === 'tiers' && feature.tiers && (
                      <div className="space-y-1.5">
                        {renderTooltip(
                          feature.description || '',
                          <span className="text-white/70">{feature.name}</span>
                        )}
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
                                {tier.name} - {formatCurrency(tier.cost, currency)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {feature.type === 'included' && (
                      <div className="flex items-center gap-2 text-white/70">
                        <CheckCircle className="w-4 h-4 text-brand-primary" />
                        {renderTooltip(
                          tooltips[feature.id as keyof typeof tooltips] || feature.description || '',
                          <span>{feature.name}</span>
                        )}
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
                  {formatCurrency(totalCosts.oneTime, currency)}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-white/70">
                  Recurring {billingInterval === 'annually' ? 'Annual' : 'Monthly'}
                </div>
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalCosts.recurring, currency)}
                  </div>
                  {billingInterval === 'annually' && (
                    <div className="text-sm text-white/50 line-through mb-1">
                      {formatCurrency(totalCosts.originalRecurring, currency)}
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