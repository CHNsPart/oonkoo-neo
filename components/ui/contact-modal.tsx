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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { DateTimePicker } from './datetime-picker';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: string;
  origin: string;
}

const projectTypes = [
  { id: 'website', label: 'Website Development' },
  { id: 'software', label: 'Custom Software' },
  { id: 'mobile_app', label: 'Mobile App' },
  { id: 'ui_design', label: 'UI/UX Design' },
  { id: 'ai_solutions', label: 'AI Solutions' },
  { id: 'backend', label: 'Backend Development' },
  { id: 'branding', label: 'Branding & Design' },
] as const;

export function ContactModal({ open, onOpenChange, type = "website", origin }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    budget: '',
    description: '',
    project: '',
    meetingTime: '',
    origin: origin
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (value: string) => {
    setFormData(prev => ({ ...prev, project: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // Transform form data to include proper budget value and type
      const submissionData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        type,
        origin: origin,
        project: formData.project || 'website',
      };

      const response = await fetch('/api/project-inquiries', {
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
        budget: '',
        description: '',
        project: '',
        meetingTime: '',
        origin: origin
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
          <DialogTitle className="text-2xl font-bold">Start Your Project</DialogTitle>
          <DialogDescription className="text-white/70">
            {"Tell us about your project and we'll get back to you within 24 hours."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Form content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your name (Optional)"
              value={formData.name}
              onChange={handleInputChange}
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

          <Select
            value={formData.project}
            onValueChange={handleProjectChange}
          >
            <SelectTrigger className="w-full px-4 py-6 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50">
              <SelectValue placeholder="Select project type *" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10">
              {projectTypes.map((type) => (
                <SelectItem
                  key={type.id}
                  value={type.id}
                  className="text-white hover:bg-white/10"
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Add Budget Input */}
          <div className="relative">
            <input
              type="number"
              name="budget"
              placeholder="Budget (USD) (Optional)"
              value={formData.budget}
              onChange={handleInputChange}
              min="0"
              step="100"
              className="w-full px-4 py-3 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
          </div>

          <textarea
            name="description"
            placeholder="Tell us about your project (Optional)"
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
                      <span className="text-green-500">Sent successfully!</span>
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
                    Sending...
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    Send Message <ArrowRight className="w-4 h-4" />
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