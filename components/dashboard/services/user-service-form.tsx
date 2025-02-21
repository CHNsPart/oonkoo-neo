"use client";

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyToggle } from '@/components/pages/pricing/currency-toggle';
import { cn, Currency, formatCurrency } from '@/lib/utils';
import { UserService } from '@/types/service';
import { servicePlans } from '@/constants/services';
import Image from 'next/image';

interface UserServiceFormProps {
  initialData?: Partial<UserService>;
  onSubmit: (data: Partial<UserService>) => Promise<void>;
  mode: 'create' | 'edit';
}

interface FormData {
  billingInterval: 'monthly' | 'annually';
  status: 'pending' | 'active' | 'paused' | 'cancelled';
  serviceId: string;  // Add this to match the schema
}

export function UserServiceForm({ initialData, onSubmit, mode }: UserServiceFormProps) {
  const [formData, setFormData] = useState<FormData>({
    billingInterval: initialData?.billingInterval || 'monthly',
    status: initialData?.status || 'pending',
    serviceId: mode === 'edit' ? initialData?.serviceId || servicePlans[0].id : servicePlans[0].id
  });
  const [currency, setCurrency] = useState<Currency>('USD');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const servicePlan = servicePlans.find(plan => plan.id === formData.serviceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
  
    try {
      const submissionData = {
        serviceId: mode === 'edit' ? initialData?.serviceId : formData.serviceId,
        billingInterval: formData.billingInterval,
        // status: formData.status,
        status: mode === 'create' ? 'pending' : formData.status === "active" ? 'pending' : formData.status,
        meetingTime: null
      };

      console.log('Initial Data:', initialData);
      console.log('Form Data:', formData);
      console.log('Submission Data:', submissionData);

      await onSubmit(submissionData);
      setStatus('success');
      
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const hasChanges = useMemo(() => {
    return formData.billingInterval !== initialData?.billingInterval ||
           formData.status !== initialData?.status;
  }, [formData, initialData]);

  // const handleServiceSelect = useCallback((serviceId: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     serviceId
  //   }));
  // }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === 'edit' && (
        <input 
          type="hidden" 
          name="serviceId" 
          value={formData.serviceId} 
        />
      )}
      {mode === 'create' && (
        <div className="space-y-2">
          <label className="text-sm text-white/70 block">Service Type</label>
          <Select
            value={formData.serviceId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {servicePlans.map(plan => (
                <SelectItem key={plan.id} value={plan.id}>
                  <div className="flex items-center gap-2">
                    <Image 
                      src={plan.icon} 
                      alt={plan.title} 
                      width={20} 
                      height={20} 
                      className="object-contain" 
                    />
                    {plan.title}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-4">
        {/* Service Info */}
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold mb-2">Service Information</h3>
          <p className="text-white/70">{servicePlan?.title}</p>
          <p className="text-sm text-white/50 mt-1">{servicePlan?.description}</p>
        </div>

        {/* Billing and Status */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70 mb-2 block">Billing Interval</label>
            <Select
              value={formData.billingInterval}
              onValueChange={(value: 'monthly' | 'annually') => 
                setFormData(prev => ({ ...prev, billingInterval: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select billing interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annually">Annually (20% off)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-white/70 mb-2 block">Status</label>
            {mode === 'edit' ? (
              <Select
                value={formData.status}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, status: value as "paused" | "cancelled" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            ) : null}
          </div>
        </div>

        {/* Price Display */}
        <div className="bg-white/5 rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Price</h3>
            <div onClick={(e) => e.preventDefault()}>
              <CurrencyToggle
                currency={currency}
                onToggle={setCurrency}
              />
            </div>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-white/70">
              {formData.billingInterval === 'monthly' ? 'Monthly' : 'Annual'} Price:
            </span>
            {/* <span className="text-xl font-bold text-brand-primary">
              {formatCurrency(price, currency)}
            </span> */}
            <div className="text-2xl font-bold text-brand-primary">
              {formatCurrency(
                servicePlan?.price[formData.billingInterval] ?? 0, 
                currency
              )}
            </div>
          </div>
          {formData.billingInterval === 'annually' && (
            <div className="text-sm text-green-500 text-right">
              Saves 20% compared to monthly billing
            </div>
          )}
        </div>
      </div>

      {/* Submit Button and Status */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
        <AnimatePresence mode="wait">
          {status !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              {status === 'success' && (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-green-500">Service updated successfully!</span>
                </>
              )}
              {status === 'error' && (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-500">{errorMessage}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <HoverBorderGradient
          type="submit"
          disabled={status === 'submitting' || !hasChanges}
          className={cn(
            "w-full sm:w-auto",
            (!hasChanges || status === 'submitting') && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="flex items-center gap-2">
            {status === 'submitting' ? (
              <>
                Updating...
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </>
            ) : (
              <>
                {!hasChanges ? 'No Changes' : 'Update Service'} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </span>
        </HoverBorderGradient>
      </div>
    </form>
  );
}