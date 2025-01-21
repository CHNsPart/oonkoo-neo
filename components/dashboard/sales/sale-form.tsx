"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { salesData } from '@/constants/sales';
import type { SaleInquiry } from '@/hooks/use-sales';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface SaleFormProps {
  initialData?: Partial<SaleInquiry>;
  onSubmit: (data: Partial<SaleInquiry>) => Promise<void>;
  mode: 'create' | 'edit';
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

export function SaleForm({
  initialData,
  onSubmit,
  mode
}: SaleFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    description: initialData?.description || '',
    saleId: initialData?.saleId || salesData[0].id,
    type: initialData?.type || '',
    originalPrice: initialData?.originalPrice?.toString() || '',
    salePrice: initialData?.salePrice?.toString() || '',
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
      // Get the selected sale data
      const selectedSale = salesData.find(sale => sale.id === formData.saleId);
      if (!selectedSale) {
        throw new Error('Invalid sale selected');
      }

      // Process the data with proper type conversions
      const processedData = {
        ...formData,
        originalPrice: selectedSale.originalPrice,
        salePrice: selectedSale.salePrice,
        type: selectedSale.type,
        meetingTime: formData.meetingTime ? new Date(formData.meetingTime) : null,
      };

      await onSubmit(processedData);
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

  // Get sale details for the currently selected sale
  const selectedSale = salesData.find(sale => sale.id === formData.saleId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name *"
            value={formData.name}
            onChange={handleInputChange}
            required
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
            placeholder="Phone *"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>
      </div>

      {/* Sale Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sale Details</h3>
        
        <Select
          value={formData.saleId}
          onValueChange={(value) => setFormData(prev => ({ 
            ...prev, 
            saleId: value,
          }))}
        >
          <SelectTrigger className="w-full px-4 py-6 rounded-xl bg-white/5 border border-white/10 text-white">
            <SelectValue placeholder="Select sale" />
          </SelectTrigger>
          <SelectContent>
            {salesData.map(sale => (
              <SelectItem key={sale.id} value={sale.id}>
                {sale.name} - {sale.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedSale && (
          <div className="bg-black/20 p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Original Price:</span>
              <span className="line-through">${selectedSale.originalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Sale Price:</span>
              <span className="text-brand-primary font-bold">${selectedSale.salePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Discount:</span>
              <span className="text-green-500">
                {Math.round(((selectedSale.originalPrice - selectedSale.salePrice) / selectedSale.originalPrice) * 100)}% OFF
              </span>
            </div>
          </div>
        )}

        {mode === 'edit' && (
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="w-full px-4 py-6 rounded-xl bg-white/5 border border-white/10 text-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <textarea
          name="description"
          placeholder="Additional Notes"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
        />
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
                    Sale {mode === 'create' ? 'created' : 'updated'} successfully!
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
                {mode === 'create' ? 'Create Sale' : 'Update Sale'} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </span>
        </HoverBorderGradient>
      </div>
    </form>
  );
}