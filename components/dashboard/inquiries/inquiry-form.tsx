"use client";

import { useState } from 'react';
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
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { ProjectInquiry } from '@/hooks/use-inquiries';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface InquiryFormProps {
  initialData?: Partial<ProjectInquiry>;
  onSubmit: (data: Partial<ProjectInquiry>) => Promise<void>;
  mode: 'create' | 'edit';
}

const projectTypes = [
  { value: 'website', label: 'Website Development' },
  { value: 'software', label: 'Custom Software' },
  { value: 'mobile_app', label: 'Mobile App' },
  { value: 'ui_design', label: 'UI/UX Design' },
  { value: 'ai_solutions', label: 'AI Solutions' },
  { value: 'backend', label: 'Backend Development' },
  { value: 'branding', label: 'Branding & Design' },
] as const;

const statusTypes = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_discussion', label: 'In Discussion' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

export function InquiryForm({
  initialData,
  onSubmit,
  mode
}: InquiryFormProps) {
  const [formData, setFormData] = useState<{
    name: string;
    company: string;
    email: string;
    phone: string;
    budget: string | number;
    description: string;
    project: string;
    type: string;
    status: string;
    meetingTime: string;
  }>({
    name: initialData?.name || '',
    company: initialData?.company || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    budget: initialData?.budget || '',
    description: initialData?.description || '',
    project: initialData?.project || projectTypes[0].value,
    type: initialData?.type || 'website',
    status: initialData?.status || 'new',
    meetingTime: initialData?.meetingTime ? new Date(initialData.meetingTime).toISOString() : '',
  });
  
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // Process the data with proper type conversions
      const processedData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget as string) : null,
        meetingTime: formData.meetingTime ? new Date(formData.meetingTime) : null,
      };

      await onSubmit(processedData);
      setStatus('success');
      
      // Show success message for 2 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Project Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            value={formData.project}
            onValueChange={(value) => setFormData(prev => ({ ...prev, project: value }))}
          >
            <SelectTrigger className="w-full px-4 py-6 rounded-xl bg-white/5 border border-white/10 text-white">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <input
              type="number"
              name="budget"
              placeholder="Budget (USD)"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pl-8 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
          </div>
        </div>

        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
        />

        {mode === 'edit' && (
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="w-full px-4 py-6 rounded-xl bg-white/5 border border-white/10 text-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Meeting Time */}
      <DateTimePicker
        value={formData.meetingTime}
        onChange={(value) => setFormData(prev => ({
          ...prev,
          meetingTime: value
        }))}
        className="w-full"
      />

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
                  <span className="text-green-500">
                    Inquiry {mode === 'create' ? 'created' : 'updated'} successfully!
                  </span>
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
                {mode === 'create' ? 'Creating...' : 'Updating...'} 
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </>
            ) : (
              <>
                {mode === 'create' ? 'Create Inquiry' : 'Update Inquiry'} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </span>
        </HoverBorderGradient>
      </div>
    </form>
  );
}