"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'cmdk';
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, CheckCircle2, AlertCircle, PlusCircle, X, CheckCircle, Search } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { cn } from '@/lib/utils';
import { pricingPlans } from '@/constants/pricing';
import { Switch } from "@/components/ui/switch";
import Image from 'next/image';
import { PlanFeature } from "@/types/pricing";
import { 
  calculateOneTimeCosts, 
  calculateRecurringCosts,
  formatFeaturesForSubmission
} from "@/lib/project-calculations";

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface ProjectFormProps {
  initialData?: ProjectWithParsedFeatures;
  onSubmit: (data: Partial<ProjectWithParsedFeatures>) => Promise<void>;
  mode: 'create' | 'edit';
}

interface CustomFeature {
  id: string;
  name: string;
  type: 'toggle' | 'select' | 'tiers';
  cost: number;
  value: boolean | string;
}

interface Feature {
  isRecurring: boolean;
  monthlyRate: number;
  annualRate: number;
  type: 'toggle' | 'select' | 'tiers';
  value: boolean | string;
  cost: number;
  name?: string;
}

interface ProjectWithParsedFeatures {
  userEmail: string;
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  meetingTime: Date | null;
  planType: string;
  features: Record<string, Feature>;
  oneTimePrice: number;
  recurringPrice: number;
  recurringInterval: 'monthly' | 'annually';
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Update FormDataState to extend ProjectWithParsedFeatures
interface FormDataState extends Omit<ProjectWithParsedFeatures, 'features'> {
  features: Record<string, Feature>;
  customFeatures: CustomFeature[];
  maintenanceCost: {
    monthly: number;
    annually: number;
  };
  hostingCost: {
    monthly: number;
    annually: number;
  };
}

interface FormDataState extends Omit<ProjectWithParsedFeatures, 'features'> {
  features: Record<string, Feature>;
  customFeatures: CustomFeature[];
  maintenanceCost: {
    monthly: number;
    annually: number;
  };
  hostingCost: {
    monthly: number;
    annually: number;
  };
  digitalMarketingCost: {
    monthly: number;
    annually: number;
  };
  socialMediaCost: {
    monthly: number;
    annually: number;
  };
}

interface CustomFeature {
  id: string;
  name: string;
  type: 'toggle' | 'select' | 'tiers';
  cost: number;
  value: boolean | string;
  isRecurring: boolean; // Add this property
  monthlyRate?: number; // For recurring features
  annualRate?: number;  // For recurring features with 20% discount
}

const planTypes = [
  { value: 'uiux', label: 'UI/UX Design' },
  { value: 'webdev', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile Development' },
  { value: 'builder', label: 'Website Builder' },
  { value: 'enterprise', label: 'Enterprise Solutions' }
] as const;

const statusTypes = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'completed', label: 'Completed' }
] as const;

export function ProjectForm({
  initialData,
  onSubmit,
}: ProjectFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { user } = useKindeAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<{
    email: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
  }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        setIsAdmin(data.user?.isAdmin || false);
  
        if (data.user?.isAdmin) {
          // Fetch users for admin
          const usersResponse = await fetch('/api/clients');
          const usersData = await usersResponse.json();
          setUsers(usersData.clients || []);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };
  
    if (user?.email) {
      checkAdmin();
    }
  }, [user?.email]);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

// Parse initial features
const parseInitialData = (data?: ProjectWithParsedFeatures) => {
  if (!data?.features) {
    return {
      customFeatures: [],
      regularFeatures: {}
    };
  }

  // Extract custom features
  const customFeatures = Object.entries(data.features)
    .filter(([key]) => key.startsWith('custom-'))
    .map(([key, feature]) => ({
      id: key,
      name: feature.name || '',
      type: feature.type,
      cost: feature.cost,
      value: feature.value,
      isRecurring: feature.isRecurring || false,
      monthlyRate: feature.monthlyRate || feature.cost,
      annualRate: feature.annualRate || (feature.cost * 12 * 0.8)
    }));

  // Extract regular features
  const regularFeatures = Object.entries(data.features)
    .filter(([key]) => !key.startsWith('custom-'))
    .reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value
    }), {});

  return {
    customFeatures,
    regularFeatures
  };
};

  const { customFeatures: initialCustomFeatures, regularFeatures: initialRegularFeatures } = parseInitialData(initialData);

  const generateInitialData = () => {
    const defaultData: FormDataState = {
      id: initialData?.id || `temp-${Date.now()}`, 
      name: '',
      email: '',
      company: null,
      phone: null,
      meetingTime: null,
      planType: 'uiux',
      features: {},
      customFeatures: [],
      oneTimePrice: 0,
      recurringPrice: 0,
      recurringInterval: 'monthly',
      totalPrice: 0,
      status: 'pending',
      maintenanceCost: {
        monthly: 350,
        annually: 3360,
      },
      hostingCost: {
        monthly: 10,
        annually: 96,
      },
      digitalMarketingCost: {
        monthly: 300,
        annually: 2880,
      },
      socialMediaCost: {
        monthly: 300,
        annually: 2880,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      userEmail: ''
    };
  
    if (initialData) {
      return {
        ...defaultData,
        ...initialData,
        features: initialRegularFeatures,
        customFeatures: initialCustomFeatures,
        // Ensure we keep the maintenance and recurring costs
        maintenanceCost: {
          monthly: 299,
          annually: 2868,
        },
        hostingCost: {
          monthly: 49,
          annually: 470,
        },
        digitalMarketingCost: {
          monthly: 300,
          annually: 2880,
        },
        socialMediaCost: {
          monthly: 300,
          annually: 2880,
        },
      };
    }
  
    return defaultData;
  };

  const [formData, setFormData] = useState<FormDataState>(generateInitialData());

  // Handle basic field changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle feature changes
  const handleFeatureChange = useCallback((
    featureId: string,
    value: boolean | string,
    type: 'toggle' | 'select' | 'tiers',
    cost: number = 0
  ) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureId]: {
          type,
          value,
          cost,
          name: pricingPlans
            .find(p => p.id === prev.planType)
            ?.features
            .find(f => f.id === featureId)
            ?.name,
          isRecurring: false,
          monthlyRate: 0,
          annualRate: 0,
        }
      }
    }));
  }, []);

  // Add custom feature
  const handleAddCustomFeature = useCallback(() => {
    const newFeature: CustomFeature = {
      id: `custom-${Date.now()}`,
      name: '',
      type: 'toggle',
      cost: 0,
      value: false,
      isRecurring: false,
      monthlyRate: 0,
      annualRate: 0,
    };
  
    setFormData(prev => ({
      ...prev,
      customFeatures: [...prev.customFeatures, newFeature],
    }));
  }, []);

  // Remove custom feature
  const handleRemoveCustomFeature = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      customFeatures: prev.customFeatures.filter(f => f.id !== id),
    }));
  }, []);

  // Update custom feature
  const handleCustomFeatureChange = useCallback((
    id: string,
    field: keyof CustomFeature,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      customFeatures: prev.customFeatures.map(f => {
        if (f.id === id) {
          const updatedFeature = { ...f, [field]: value };
          
          // If we're changing the isRecurring status, update the cost
          if (field === 'isRecurring') {
            if (updatedFeature.isRecurring) {
              updatedFeature.cost = prev.recurringInterval === 'monthly'
                ? (updatedFeature.monthlyRate || 0)
                : (updatedFeature.annualRate || 0);
            }
          }
          
          return updatedFeature;
        }
        return f;
      }),
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
  
    try {
      const plan = pricingPlans.find(p => p.id === formData.planType);
      if (!plan) throw new Error("Invalid plan selected");
  
      // Calculate costs properly using utility functions
      const oneTimePrice = calculateOneTimeCosts(
        formData.features,
        plan.features,
        formData.customFeatures
      );
  
      const recurringCosts = calculateRecurringCosts(
        formData.features,
        formData.recurringInterval,
        formData.maintenanceCost,
        formData.hostingCost,
        formData.digitalMarketingCost,
        formData.socialMediaCost,
        formData.customFeatures
      );
  
      // Format features for submission
      const formattedFeatures = formatFeaturesForSubmission(
        formData.features,
        plan.features,
        formData.customFeatures.map(feature => ({
          ...feature,
          monthlyRate: feature.monthlyRate || 0,
          annualRate: feature.annualRate || 0,
        })),
        formData.recurringInterval,
        formData.maintenanceCost,
        formData.hostingCost,
        formData.digitalMarketingCost,
        formData.socialMediaCost
      );
  
      // Create submission data with proper types
      const submissionData: Partial<ProjectWithParsedFeatures> = {
        name: formData.name,
        company: formData.company,
        email: selectedUser || formData.email,
        phone: formData.phone,
        meetingTime: formData.meetingTime ? new Date(formData.meetingTime) : null,
        planType: formData.planType,
        features: formattedFeatures as Record<string, Feature>,
        oneTimePrice,
        recurringPrice: recurringCosts.recurring,
        recurringInterval: formData.recurringInterval,
        totalPrice: oneTimePrice + recurringCosts.recurring,
        status: formData.status || 'pending'
      };
  
      // If admin is creating for another user, add userEmail
      if (selectedUser) {
        (submissionData as ProjectWithParsedFeatures).userEmail = selectedUser;
      }
  
      // Handle originalPrice separately if needed for the API
      const apiSubmissionData = {
        ...submissionData,
        originalPrice: formData.recurringInterval === 'annually' ? recurringCosts.originalMonthly * 12 : undefined
      };
  
      console.log('Submitting data:', apiSubmissionData);
      await onSubmit(apiSubmissionData);
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
  }

  const servicePlan = pricingPlans.find(p => p.id === formData.planType);

    // Update custom feature costs when billing interval changes
  useEffect(() => {
    if (formData.customFeatures.length === 0) return;
    
    setFormData(prev => ({
      ...prev,
      customFeatures: prev.customFeatures.map(feature => {
        if (feature.isRecurring) {
          return {
            ...feature,
            cost: prev.recurringInterval === 'monthly'
              ? (feature.monthlyRate || 0)
              : (feature.annualRate || 0)
          };
        }
        return feature;
      })
    }));
  }, [formData.recurringInterval, formData.customFeatures.length]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
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
            value={formData.company || ''}
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
            value={formData.phone || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>
      </div>

      {isAdmin && (
        <div className="space-y-2 mb-6">
          <h3 className="text-lg font-semibold">Assign to User</h3>
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
                      selectedUser === user.email ? 'bg-white/10' : ''
                    }`}
                    onClick={() => {
                      setSelectedUser(user.email);
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
      )}

      {/* Project Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Project Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            value={formData.planType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, planType: value }))}
          >
            <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
              <SelectValue placeholder="Select plan type" />
            </SelectTrigger>
            <SelectContent>
              {planTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
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
        </div>
      </div>

      {/* Predefined Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Features</h3>
        <div className="space-y-3">
          {servicePlan?.features.map((feature: PlanFeature) => (
            <div key={feature.id} className="space-y-2">
              {/* Toggle Features */}
              {feature.type === 'toggle' && (
                <div 
                  className={cn(
                    "bg-white/5 rounded-xl p-4 border border-white/10 hover:border-brand-primary/50 transition-all",
                    formData.features[feature.id]?.value ? "border-brand-primary/80 bg-brand-primary/10" : ""
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-brand-primary mt-1">${feature.cost || 0}</p>
                    </div>
                    <Switch
                      checked={!!formData.features[feature.id]?.value}
                      onCheckedChange={(checked) => 
                        handleFeatureChange(feature.id, checked, 'toggle', feature.cost || 0)
                      }
                      className="data-[state=checked]:bg-brand-primary"
                    />
                  </div>
                </div>
              )}
              
              {/* Tiers Selection */}
              {feature.type === 'tiers' && feature.tiers && (
                <div className="space-y-1.5">
                  <span className="text-white/70">{feature.name}</span>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {feature.tiers.map((tier) => (
                      <div
                        key={tier.id}
                        onClick={() => handleFeatureChange(feature.id, tier.id, 'tiers', tier.cost)}
                        className={cn(
                          "bg-white/5 rounded-xl p-4 border border-white/10 hover:border-brand-primary/50 cursor-pointer transition-all",
                          formData.features[feature.id]?.value === tier.id ? "border-brand-primary/80 bg-brand-primary/10" : ""
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{tier.name}</h4>
                          <p className="text-brand-primary font-medium">${tier.cost}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Options Selection */}
              {feature.type === 'select' && feature.options && (
                <div className="space-y-1.5">
                  <span className="text-white/70">{feature.name}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {feature.options.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => handleFeatureChange(feature.id, option.id, 'select', option.cost || 0)}
                        className={cn(
                          "bg-white/5 rounded-xl p-4 border border-white/10 hover:border-brand-primary/50 cursor-pointer transition-all",
                          formData.features[feature.id]?.value === option.id ? "border-brand-primary/80 bg-brand-primary/10" : ""
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {option.icon && (
                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                              <Image
                                src={option.icon} 
                                alt={option.name}
                                width={24}
                                height={24}
                                className="w-6 h-6 object-contain rounded-full"
                              />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium">{option.name}</h4>
                            <p className="text-sm text-brand-primary">${option.cost}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

      {/* Custom Features */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Custom Features</h3>
          <button
            type="button"
            onClick={handleAddCustomFeature}
            className="flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="text-sm">Add New Feature</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.customFeatures.map((feature) => (
            <div 
              key={feature.id}
              className="relative grid grid-cols-1 gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <button
                type="button"
                onClick={() => handleRemoveCustomFeature(feature.id)}
                className="absolute -top-2 -right-2 size-6 flex items-center justify-center bg-black/60 text-white/50 hover:text-red-500 rounded-full border border-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Feature Name and Type Toggle */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <div className="text-xs text-white/50 mb-1">Feature Name</div>
                  <input
                    type="text"
                    placeholder="Enter feature name"
                    value={feature.name}
                    onChange={(e) => handleCustomFeatureChange(feature.id, 'name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/70">One-time</span>
                  <Switch
                    checked={feature.isRecurring}
                    onCheckedChange={(checked) => {
                      handleCustomFeatureChange(feature.id, 'isRecurring', checked);
                      // If toggling to recurring, set monthly rate equal to current cost
                      if (checked && !feature.monthlyRate) {
                        handleCustomFeatureChange(feature.id, 'monthlyRate', feature.cost);
                        handleCustomFeatureChange(feature.id, 'annualRate', feature.cost * 12 * 0.8);
                      }
                    }}
                    className="data-[state=checked]:bg-brand-primary"
                  />
                  <span className="text-sm text-white/70">Recurring</span>
                </div>
              </div>

              {/* Cost Section - Different UI based on isRecurring */}
              {!feature.isRecurring ? (
                // One-time cost input
                <div>
                  <div className="text-xs text-white/50 mb-1">One-time Cost ($)</div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                    <input
                      type="number"
                      placeholder="Enter cost"
                      value={feature.cost}
                      onChange={(e) => handleCustomFeatureChange(feature.id, 'cost', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 pl-8 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                    />
                  </div>
                </div>
              ) : (
                // Recurring costs (monthly/annual)
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-white/50 mb-1">Monthly Rate ($)</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                      <input
                        type="number"
                        placeholder="Monthly rate"
                        value={feature.monthlyRate || 0}
                        onChange={(e) => {
                          const monthlyValue = parseFloat(e.target.value) || 0;
                          handleCustomFeatureChange(feature.id, 'monthlyRate', monthlyValue);
                          // Update annual rate with 20% discount
                          handleCustomFeatureChange(feature.id, 'annualRate', monthlyValue * 12 * 0.8);
                          // Set cost based on current billing interval
                          const newCost = formData.recurringInterval === 'monthly' 
                            ? monthlyValue 
                            : monthlyValue * 12 * 0.8;
                          handleCustomFeatureChange(feature.id, 'cost', newCost);
                        }}
                        className="w-full px-4 py-3 pl-8 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-1">Annual Rate (20% off)</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                      <input
                        type="number"
                        placeholder="Annual rate"
                        value={feature.annualRate || 0}
                        onChange={(e) => {
                          const annualValue = parseFloat(e.target.value) || 0;
                          handleCustomFeatureChange(feature.id, 'annualRate', annualValue);
                          // Update cost if billing interval is annual
                          if (formData.recurringInterval === 'annually') {
                            handleCustomFeatureChange(feature.id, 'cost', annualValue);
                          }
                        }}
                        className="w-full px-4 py-3 pl-8 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Active Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">Active</span>
                <Switch
                  checked={!!feature.value}
                  onCheckedChange={(checked) => 
                    handleCustomFeatureChange(feature.id, 'value', checked)
                  }
                  className="data-[state=checked]:bg-brand-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing and Services */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Billing & Services</h3>
        
        {/* Maintenance & Hosting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Maintenance Card */}
          <div className={cn(
            "flex flex-col p-4 bg-white/5 rounded-xl border border-white/10",
            formData.features.maintenance?.value && "border-brand-primary"
          )}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium">Maintenance</h4>
                {!formData.features.maintenance?.value && (
                  <p className="text-xs text-white/50">Toggle to set custom cost</p>
                )}
              </div>
              <Switch
                checked={!!formData.features.maintenance?.value}
                onCheckedChange={(checked) => 
                  handleFeatureChange('maintenance', checked, 'toggle', formData.maintenanceCost[formData.recurringInterval])
                }
                className="data-[state=checked]:bg-brand-primary"
              />
            </div>

            {formData.features.maintenance?.value && (
              <div className="space-y-2 mt-2 pt-3 border-t border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-white/50 mb-1">Monthly Rate</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                      <input
                        type="number"
                        value={formData.maintenanceCost.monthly}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          maintenanceCost: {
                            ...prev.maintenanceCost,
                            monthly: parseFloat(e.target.value) || 0,
                            annually: (parseFloat(e.target.value) || 0) * 12 * 0.8 // 20% annual discount
                          }
                        }))}
                        className="w-full px-4 py-2 pl-8 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-1">Annual Rate (20% off)</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                      <input
                        type="number"
                        value={formData.maintenanceCost.annually}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          maintenanceCost: {
                            ...prev.maintenanceCost,
                            annually: parseFloat(e.target.value) || 0
                          }
                        }))}
                        className="w-full px-4 py-2 pl-8 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hosting Card */}
          <div className={cn(
            "flex flex-col p-4 bg-white/5 rounded-xl border border-white/10",
            formData.features.hosting?.value && "border-brand-primary"
          )}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium">Hosting</h4>
                {!formData.features.hosting?.value && (
                  <p className="text-xs text-white/50">Toggle to set custom cost</p>
                )}
              </div>
              <Switch
                checked={!!formData.features.hosting?.value}
                onCheckedChange={(checked) => 
                  handleFeatureChange('hosting', checked, 'toggle', formData.hostingCost[formData.recurringInterval])
                }
                className="data-[state=checked]:bg-brand-primary"
              />
            </div>

            {formData.features.hosting?.value && (
              <div className="space-y-2 mt-2 pt-3 border-t border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-white/50 mb-1">Monthly Rate</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                      <input
                        type="number"
                        value={formData.hostingCost.monthly}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          hostingCost: {
                            ...prev.hostingCost,
                            monthly: parseFloat(e.target.value) || 0,
                            annually: (parseFloat(e.target.value) || 0) * 12 * 0.8 // 20% annual discount
                          }
                        }))}
                        className="w-full px-4 py-2 pl-8 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-1">Annual Rate (20% off)</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                      <input
                        type="number"
                        value={formData.hostingCost.annually}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          hostingCost: {
                            ...prev.hostingCost,
                            annually: parseFloat(e.target.value) || 0
                          }
                        }))}
                        className="w-full px-4 py-2 pl-8 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Digital Marketing & Social Media */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Digital Marketing Card */}
          <div className={cn(
            "flex flex-col p-4 bg-white/5 rounded-xl border border-white/10",
            formData.features.digitalMarketing?.value && "border-brand-primary"
          )}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium">Digital Marketing</h4>
                {!formData.features.digitalMarketing?.value && (
                  <p className="text-xs text-white/50">Toggle to set custom cost</p>
                )}
              </div>
              <Switch
                checked={!!formData.features.digitalMarketing?.value}
                onCheckedChange={(checked) => 
                  handleFeatureChange('digitalMarketing', checked, 'toggle', formData.digitalMarketingCost[formData.recurringInterval])
                }
                className="data-[state=checked]:bg-brand-primary"
              />
            </div>

            {formData.features.digitalMarketing?.value && (
              <div className="space-y-2 mt-2 pt-3 border-t border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-white/50 mb-1">Monthly Rate</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                      <input
                        type="number"
                        value={formData.digitalMarketingCost.monthly}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          digitalMarketingCost: {
                            ...prev.digitalMarketingCost,
                            monthly: parseFloat(e.target.value) || 0,
                            annually: (parseFloat(e.target.value) || 0) * 12 * 0.8 // 20% annual discount
                          }
                        }))}
                        className="w-full px-4 py-2 pl-8 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-1">Annual Rate (20% off)</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                      <input
                        type="number"
                        value={formData.digitalMarketingCost.annually}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          digitalMarketingCost: {
                            ...prev.digitalMarketingCost,
                            annually: parseFloat(e.target.value) || 0
                          }
                        }))}
                        className="w-full px-4 py-2 pl-8 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Social Media Card */}
          <div className={cn(
            "flex flex-col p-4 bg-white/5 rounded-xl border border-white/10",
            formData.features.socialMedia?.value && "border-brand-primary"
          )}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium">Social Media Management</h4>
                {!formData.features.socialMedia?.value && (
                  <p className="text-xs text-white/50">Toggle to set custom cost</p>
                )}
              </div>
              <Switch
                checked={!!formData.features.socialMedia?.value}
                onCheckedChange={(checked) => 
                  handleFeatureChange('socialMedia', checked, 'toggle', formData.socialMediaCost[formData.recurringInterval])
                }
                className="data-[state=checked]:bg-brand-primary"
              />
            </div>

            {formData.features.socialMedia?.value && (
              <div className="space-y-2 mt-2 pt-3 border-t border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-white/50 mb-1">Monthly Rate</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                      <input
                        type="number"
                        value={formData.socialMediaCost.monthly}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          socialMediaCost: {
                            ...prev.socialMediaCost,
                            monthly: parseFloat(e.target.value) || 0,
                            annually: (parseFloat(e.target.value) || 0) * 12 * 0.8 // 20% annual discount
                          }
                        }))}
                        className="w-full px-4 py-2 pl-8 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/50 mb-1">Annual Rate (20% off)</div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                      <input
                        type="number"
                        value={formData.socialMediaCost.annually}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          socialMediaCost: {
                            ...prev.socialMediaCost,
                            annually: parseFloat(e.target.value) || 0
                          }
                        }))}
                        className="w-full px-4 py-2 pl-8 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Billing Interval */}
        <div className="flex items-center gap-4">
          <label className="text-sm text-white/70">Billing Interval</label>
          <Select
            value={formData.recurringInterval}
            onValueChange={(value: 'monthly' | 'annually') => 
              setFormData(prev => ({ ...prev, recurringInterval: value }))}
          >
            <SelectTrigger className="w-[200px] bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-xl border-white/10">
              <SelectItem value="monthly" className="text-white hover:bg-white/10">
                Monthly
              </SelectItem>
              <SelectItem value="annually" className="text-white hover:bg-white/10">
                Annually (20% off)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Meeting Time */}
      <DateTimePicker
        value={formData.meetingTime ? new Date(formData.meetingTime).toISOString() : ''}
        onChange={(value) => setFormData(prev => ({
          ...prev,
          meetingTime: value ? new Date(value) : null
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
                    Project updated successfully!
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

        {/* Submit Button */}
        <HoverBorderGradient
          type="submit"
          disabled={status === 'submitting'}
          className="w-full sm:w-auto cursor-pointer"
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
                Update Project <ArrowRight className="w-4 h-4" />
              </>
            )}
          </span>
        </HoverBorderGradient>
      </div>
    </form>
  );
}