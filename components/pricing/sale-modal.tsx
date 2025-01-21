"use client";

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
import type { Sale } from '@/constants/sales';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface SaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale;
}

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  description: string;
  meetingTime: string;
}

export function SaleModal({ open, onOpenChange, sale }: SaleModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    description: '',
    meetingTime: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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
      const submissionData = {
        ...formData,
        saleId: sale.id,
        type: sale.type,
        originalPrice: sale.originalPrice,
        salePrice: sale.salePrice
      };

      const response = await fetch('/api/sale-inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        description: '',
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
            {sale.name} - ${sale.salePrice}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Fill in your details to claim this special offer. Valid until {sale.validUntil}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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

          <textarea
            name="description"
            placeholder="Any specific requirements? (Optional)"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
          />

          <DateTimePicker
            value={formData.meetingTime}
            onChange={(value) => setFormData(prev => ({ ...prev, meetingTime: value }))}
            className="w-full"
          />

          {/* Price Summary */}
          <div className="bg-white/5 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-lg">Price Summary</h3>
            <div className="space-y-1 text-white/70">
              <div className="flex justify-between">
                <span>Original Price</span>
                <span className="text-white/50 line-through">${sale.originalPrice}</span>
              </div>
              <div className="flex justify-between font-semibold text-brand-primary">
                <span>Sale Price</span>
                <span>${sale.salePrice}</span>
              </div>
              <div className="text-xs text-white/50 mt-2">
                * This offer is valid until {sale.validUntil}
              </div>
            </div>
          </div>

          {/* Submit Button and Status */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Status Messages */}
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
                      <span className="text-green-500">Submitted successfully!</span>
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

            {/* Submit Button */}
            <HoverBorderGradient
              type="submit"
              disabled={status === 'submitting'}
              className="w-full sm:w-auto cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {status === 'submitting' ? (
                  <>
                    Submitting...
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    Claim Offer <ArrowRight className="w-4 h-4" />
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