"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, CheckCircle2, AlertCircle, PlusCircle, X } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { cn } from '@/lib/utils';
import { pricingPlans } from '@/constants/pricing';
import { Switch } from "@/components/ui/switch";

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
  type: 'toggle' | 'select' | 'tiers';
  value: boolean | string;
  cost: number;
  name?: string;
}

interface ProjectWithParsedFeatures {
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
}

const planTypes = [
  { value: 'uiux', label: 'UI/UX Design' },
  { value: 'webdev', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile Development' },
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
        value: feature.value
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
      id: initialData?.id || `temp-${Date.now()}`, // Temporary ID for new projects
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
        monthly: 299,
        annually: 2868,
      },
      hostingCost: {
        monthly: 49,
        annually: 470,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (initialData) {
      return {
        ...defaultData,
        ...initialData,
        features: initialRegularFeatures,
        customFeatures: initialCustomFeatures,
        // Ensure we keep the maintenance and hosting costs
        maintenanceCost: {
          monthly: 299,
          annually: 2868,
        },
        hostingCost: {
          monthly: 49,
          annually: 470,
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
            ?.name
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
      customFeatures: prev.customFeatures.map(f =>
        f.id === id ? { ...f, [field]: value } : f
      ),
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // Initialize features object with existing features
      const activeFeatures: Record<string, Feature> = {};

      // Add predefined features that are active
      Object.entries(formData.features).forEach(([key, feature]) => {
        if ((feature.type === 'toggle' && feature.value === true) ||
            (feature.type !== 'toggle' && feature.value !== false && feature.value !== '')) {
          activeFeatures[key] = {
            type: feature.type,
            value: feature.value,
            cost: feature.cost,
            name: feature.name || ''
          };
        }
      });

      // Add maintenance and hosting as features if they're active
      if (formData.features.maintenance?.value) {
        activeFeatures.maintenance = {
          type: 'toggle',
          value: true,
          cost: formData.maintenanceCost[formData.recurringInterval],
          name: 'Maintenance'
        };
      }

      if (formData.features.hosting?.value) {
        activeFeatures.hosting = {
          type: 'toggle',
          value: true,
          cost: formData.hostingCost[formData.recurringInterval],
          name: 'Hosting'
        };
      }

      // Add custom features
      formData.customFeatures.forEach(feature => {
        if (feature.name) {
          activeFeatures[feature.id] = {
            type: feature.type,
            value: feature.value,
            cost: feature.cost,
            name: feature.name
          };
        }
      });

      // Calculate costs
      const oneTimePrice = Object.entries(activeFeatures)
        .filter(([key, feature]) => 
          key !== 'maintenance' && 
          key !== 'hosting' && 
          feature.value === true
        )
        // eslint-disable-next-line  @typescript-eslint/no-unused-vars
        .reduce((sum, [_, feature]) => sum + feature.cost, 0);

      const recurringPrice = (
        (activeFeatures.maintenance?.value ? formData.maintenanceCost[formData.recurringInterval] : 0) +
        (activeFeatures.hosting?.value ? formData.hostingCost[formData.recurringInterval] : 0)
      );

      // Create submission data
      const submissionData = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        meetingTime: formData.meetingTime,
        planType: formData.planType,
        features: activeFeatures,
        oneTimePrice,
        recurringPrice,
        recurringInterval: formData.recurringInterval,
        totalPrice: oneTimePrice + recurringPrice,
        status: formData.status || 'pending'
      };

      console.log('Submitting data:', submissionData);
      await onSubmit(submissionData);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pricingPlans
            .find(p => p.id === formData.planType)
            ?.features.map((planFeature) => {
              const existingFeature = formData.features[planFeature.id];
              return (
                <div 
                  key={planFeature.id}
                  className={cn(
                    "flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10",
                    existingFeature?.value && "border-brand-primary"
                  )}
                >
                  <div className="space-y-1">
                    <h4 className="font-medium">{planFeature.name}</h4>
                    <p className="text-sm text-white/50">Cost: ${planFeature.cost}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50">
                      {existingFeature?.value ? 'Active' : 'Inactive'}
                    </span>
                    <Switch
                      checked={!!existingFeature?.value}
                      onCheckedChange={(checked) => 
                        handleFeatureChange(planFeature.id, checked, 'toggle', planFeature.cost || 0)
                      }
                      className="data-[state=checked]:bg-brand-primary"
                    />
                  </div>
                </div>
              );
            })}
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
              className="relative grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <button
                type="button"
                onClick={() => handleRemoveCustomFeature(feature.id)}
                className="absolute -top-2 -right-2 size-6 flex items-center justify-center bg-black/60 text-white/50 hover:text-red-500 rounded-full border border-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="sm:col-span-2">
                <div className="text-xs text-white/50 mb-1">Feature Name</div>
                <input
                  type="text"
                  placeholder="Enter feature name"
                  value={feature.name}
                  onChange={(e) => handleCustomFeatureChange(feature.id, 'name', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                />
              </div>

              <div>
                <div className="text-xs text-white/50 mb-1">Cost ($)</div>
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