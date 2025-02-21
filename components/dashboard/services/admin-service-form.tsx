"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyToggle } from '@/components/pages/pricing/currency-toggle';
import { Currency, formatCurrency } from '@/lib/utils';
import { UserService } from '@/types/service';
import { servicePlans } from '@/constants/services';
import Image from 'next/image';
import { Command } from 'cmdk';

interface AdminServiceFormProps {
  initialData?: Partial<UserService>;
  onSubmit: (data: Partial<UserService>) => Promise<void>;
  mode: 'create' | 'edit';
}

interface User {
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
}

export function AdminServiceForm({ initialData, onSubmit, mode }: AdminServiceFormProps) {
  const [formData, setFormData] = useState({
    serviceId: initialData?.serviceId || servicePlans[0].id,
    billingInterval: initialData?.billingInterval || 'monthly',
    status: initialData?.status || 'pending',
    userEmail: initialData?.userEmail || '',
    meetingTime: initialData?.meetingTime ? new Date(initialData.meetingTime).toISOString() : '',
  });

  const [currency, setCurrency] = useState<Currency>('USD');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/clients');
        const data = await response.json();
        setUsers(data.clients || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const servicePlan = servicePlans.find(plan => plan.id === formData.serviceId);
  const price = servicePlan?.price[formData.billingInterval as 'monthly' | 'annually'] || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    try {
      const updatedFormData = { ...formData, meetingTime: new Date(formData.meetingTime) };
      await onSubmit(updatedFormData);
      setStatus('success');
      
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Service Details</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/70 mb-2 block">Service Type</label>
            <Select
              value={formData.serviceId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
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

          <div>
            <label className="text-sm text-white/70 mb-2 block">Status</label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as "pending" | "active" | "paused" | "cancelled" }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* User Selection */}
        <div className="space-y-2">
          <label className="text-sm text-white/70 block">User Email</label>
          <div className="relative">
            <Command className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="flex items-center border-b border-white/10 px-3">
                <Search className="w-4 h-4 text-white/50 mr-2" />
                <input
                  value={searchQuery}
                  onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
                  placeholder="Search users..."
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-white/50"
                />
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {filteredUsers.map(user => (
                  <div
                    key={user.email}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-3 hover:bg-white/5 transition-colors ${
                      formData.userEmail === user.email ? 'bg-white/10' : ''
                    }`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, userEmail: user.email }));
                      setSearchQuery('');
                    }}
                  >
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.firstName || 'User'}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center">
                        <span className="text-brand-primary text-xs">
                          {user.firstName?.[0] || user.email[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}`
                          : user.email
                        }
                      </div>
                      {user.firstName && (
                        <div className="text-xs text-white/50">{user.email}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Command>
          </div>
        </div>
      </div>

      {/* Billing Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Billing Settings</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Price Display */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Price</h3>
              <CurrencyToggle
                currency={currency}
                onToggle={setCurrency}
              />
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-white/70">
                {formData.billingInterval === 'monthly' ? 'Monthly' : 'Annual'} Price:
              </span>
              <span className="text-xl font-bold text-brand-primary">
                {formatCurrency(price, currency)}
              </span>
            </div>
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
              className="flex items-center gap-2"
            >
              {status === 'success' && (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-green-500">
                    Service {mode === 'create' ? 'created' : 'updated'} successfully!
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
          className="w-full sm:w-auto"
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
                {mode === 'create' ? 'Create Service' : 'Update Service'} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </span>
        </HoverBorderGradient>
      </div>
    </form>
  );
}