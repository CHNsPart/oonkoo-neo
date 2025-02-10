"use client";

// components/pricing/pricing-meeting-modal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { BillingInterval } from '@/types/pricing';
import { pricingPlans } from '@/constants/pricing';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const getFeatureCost = (planType: string, featureId: string, value: string | boolean, billingInterval: 'monthly' | 'annually') => {
  const plan = pricingPlans.find(p => p.id === planType);
  if (!plan) return 0;

  // Special handling for maintenance and hosting
  if (featureId === 'maintenance') {
    return value ? plan.maintenanceCost[billingInterval] : 0;
  }

  if (featureId === 'hosting') {
    return value ? plan.hostingCost[billingInterval] : 0;
  }

  if (featureId === 'socialMedia') {
    return value ? plan.socialMediaCost[billingInterval] : 0;
  }

  if (featureId === 'digitalMarketing') {
    return value ? plan.digitalMarketingCost[billingInterval] : 0;
  }

  // Handle regular features
  const feature = plan.features.find(f => f.id === featureId);
  if (!feature) return 0;

  switch (feature.type) {
    case 'toggle':
      return value ? (feature.cost || 0) : 0;
    case 'tiers':
      const selectedTier = feature.tiers?.find(t => t.id === value);
      return selectedTier?.cost || 0;
    case 'select':
      const selectedOption = feature.options?.find(o => o.id === value);
      return selectedOption?.cost || 0;
    default:
      return 0;
  }
};

interface FeatureValue {
  type: 'toggle' | 'select' | 'tiers' | 'included';
  value: boolean | string;
  cost: number;
}

interface PricingMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFeatures: Record<string, { 
    type: 'toggle' | 'select' | 'tiers' | 'included';
    value: boolean | string;
    cost: number;
  }>;
  totalCosts: {
    oneTime: number;
    recurring: number;
    originalRecurring: number;
  } | null;
  billingInterval: BillingInterval;
  plan?: string;
}

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  meetingTime: string;
}

export default function PricingMeetingModal({ 
  open, 
  onOpenChange, 
  selectedFeatures,
  totalCosts,
  billingInterval,
  plan = 'basic'
}: PricingMeetingModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    meetingTime: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const processedFeatures = Object.entries(selectedFeatures).reduce((acc, [key, feature]) => {
        if (feature.type === 'toggle' && !feature.value) {
          return acc;
        }

        const cost = getFeatureCost(plan, key, feature.value, billingInterval);
  
        return {
          ...acc,
          [key]: {
            type: feature.type,
            value: feature.value,
            cost: cost
          }
        };
      }, {} as Record<string, FeatureValue>);
      
      const projectData = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        meetingTime: formData.meetingTime,
        planType: plan,
        features: processedFeatures,
        oneTimePrice: totalCosts?.oneTime || 0,
        recurringPrice: totalCosts?.recurring || 0,
        recurringInterval: billingInterval,
        originalPrice: totalCosts?.originalRecurring,
        totalPrice: (totalCosts?.oneTime || 0) + (totalCosts?.recurring || 0)
      };

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      setStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        meetingTime: '',
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
        setStatus('idle');
      }, 2000);

    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
      
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 3000);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white sm:max-w-[600px] w-[95%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Schedule a Meeting
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {"Let's discuss your project requirements and customize the solution for you."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Form inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your name *"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
            <input
              type="text"
              name="company"
              placeholder="Company (Optional)"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email address *"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number (Optional)"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>

          {/* Meeting Time Picker */}
          <DateTimePicker
            value={formData.meetingTime}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, meetingTime: value }))
            }
            className="w-full"
          />

          {/* Price Summary */}
          <div className="bg-white/5 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-lg">Price Summary</h3>
            <div className="space-y-1 text-white/70">
              <div className="flex justify-between">
                <span>One-time Payment</span>
                <span>${totalCosts?.oneTime.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {billingInterval === "annually" ? "Annual" : "Monthly"}{" "}
                  Recurring
                </span>
                <div className="text-right flex items-center gap-2">
                  {billingInterval === "annually" && (
                    <div className="text-sm text-white/50 line-through">
                      $
                      {totalCosts?.originalRecurring.toLocaleString()}
                    </div>
                  )}
                  <div>${totalCosts?.recurring.toLocaleString()}</div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-1 mt-2">
                <div className="flex justify-between font-semibold text-white">
                  <span>Total</span>
                  <span>
                    $
                    {(
                      (totalCosts?.oneTime || 0) +
                      (totalCosts?.recurring || 0)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button and Status */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {status !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-center sm:justify-start gap-2"
                >
                  {status === "success" && (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-green-500">
                        Project created successfully!
                      </span>
                    </>
                  )}
                  {status === "error" && (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-500">{errorMessage}</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <HoverBorderGradient
              type="submit"
              disabled={status === "submitting"}
              className="w-full sm:w-auto cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {status === "submitting" ? (
                  <>
                    Creating Project...
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    Create Project <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </HoverBorderGradient>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}



