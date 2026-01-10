"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { ExternalLinksInput } from '@/components/dashboard/services/external-links-input';
import Image from 'next/image';
import { ServicePlan, ExternalLink } from '@/types/service';
import { BillingInterval } from '@/types/pricing';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface ServiceMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServicePlan;
  billingInterval: BillingInterval;
}

export function ServiceMeetingModal({
  open,
  onOpenChange,
  service,
  billingInterval
}: ServiceMeetingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    meetingTime: '',
    userNotes: '',
    serviceId: service.id,
    billingInterval: billingInterval
  });
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Check if this is a hosting service (show external links for hosting)
  const isHostingService = service.id === 'hosting';

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const serviceData = {
        ...formData,
        serviceId: service.id,
        billingInterval,
        meetingTime: formData.meetingTime ? new Date(formData.meetingTime) : null,
        userNotes: formData.userNotes || null,
        externalLinks: externalLinks.length > 0 ? externalLinks : [],
        status: 'pending'
      };

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create service');
      }

      setStatus('success');
      
      setTimeout(() => {
        onOpenChange(false);
        setStatus('idle');
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          meetingTime: '',
          userNotes: '',
          serviceId: service.id,
          billingInterval,
        });
        setExternalLinks([]);
      }, 2000);

    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Image 
              src={service.icon} 
              alt={service.title}
              width={24} 
              height={24} 
              className="object-contain" 
            />
            {service.title}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {`Schedule a meeting to get started with ${service.title}. We'll discuss your needs and customize the service for you.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
              placeholder="Phone number *"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>

          <DateTimePicker
            value={formData.meetingTime}
            onChange={(value) => setFormData(prev => ({ ...prev, meetingTime: value }))}
            className="w-full"
          />

          {/* User Notes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white/70">
              <FileText className="w-4 h-4" />
              Project Requirements (Optional)
            </label>
            <textarea
              name="userNotes"
              placeholder="Tell us about your project requirements, goals, or any specific needs..."
              value={formData.userNotes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
            />
          </div>

          {/* External Links (for hosting service) */}
          {isHostingService && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Project Links (Optional)
              </label>
              <p className="text-xs text-white/50 mb-2">
                Share your GitHub repo, design files, or other relevant links
              </p>
              <ExternalLinksInput
                value={externalLinks}
                onChange={setExternalLinks}
                maxLinks={5}
              />
            </div>
          )}

          {/* Service Summary */}
          <div className="bg-white/5 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold">Service Summary</h3>
            <div className="flex justify-between text-white/70">
              <span>Billing Interval</span>
              <span className="capitalize">{billingInterval}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Price</span>
              <div className="text-right">
                <div>${service.price[billingInterval]}/{billingInterval}</div>
                {billingInterval === 'annually' && (
                  <div className="text-xs text-green-500">20% off</div>
                )}
              </div>
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
                  className="flex items-center justify-center sm:justify-start gap-2"
                >
                  {status === 'success' && (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-green-500">Service scheduled successfully!</span>
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
              disabled={status === 'submitting'}
              className="w-full sm:w-auto cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {status === 'submitting' ? (
                  <>
                    Scheduling...
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    Schedule Meeting <ArrowRight className="w-4 h-4" />
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