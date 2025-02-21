"use client";

import { Project } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { CalendarRange, Box, RefreshCw } from 'lucide-react';
import { pricingPlans } from "@/constants/pricing";
import Image from "next/image";

interface ProjectDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

export default function ProjectDetailsModal({
  open,
  onOpenChange,
  project
}: ProjectDetailsModalProps) {
  const [parsedFeatures, setParsedFeatures] = useState<Record<string, {
    type: string;
    value: boolean | string;
    cost: number;
    name?: string;
    isRecurring?: boolean;
    monthlyRate?: number;
    annualRate?: number;
  }>>({});

  useEffect(() => {
    if (project?.features) {
      try {
        const features = typeof project.features === 'string' 
          ? JSON.parse(project.features)
          : project.features;
        setParsedFeatures(features);
      } catch (error) {
        console.error('Error parsing features:', error);
        setParsedFeatures({});
      }
    }
  }, [project]);

  if (!project) return null;

  // Get the plan definition to access detailed feature options
  const planDefinition = pricingPlans.find(p => p.id === project.planType);

  // Separate the features into different categories - improved filter logic for one-time features
  const oneTimeFeatures = Object.entries(parsedFeatures)
    .filter(([key, feature]) => {
      // Explicitly check for custom features that are NOT recurring
      if (key.startsWith('custom-')) {
        return feature.value === true && feature.isRecurring === false;
      }
      // Filter out maintenance, hosting, socialMedia, digitalMarketing
      if (key === 'maintenance' || key === 'hosting' || 
          key === 'socialMedia' || key === 'digitalMarketing') {
        return false;
      }
      
      // If it's a custom feature, treat it as recurring by default (filter it out from one-time)
      // if (key.startsWith('custom-')) {
      //   return false;
      // }
      
      // For all other features, include if they're explicitly marked as non-recurring
      // or if isRecurring isn't specified
      // return feature.isRecurring === false || feature.isRecurring === undefined;
      return feature.value === true || (typeof feature.value === 'string' && feature.value !== '');
    });

  // Get recurring features - considering both explicitly marked recurring features AND any custom features
  // const recurringFeatures = {
  //   maintenance: parsedFeatures.maintenance,
  //   hosting: parsedFeatures.hosting,
  //   digitalMarketing: parsedFeatures.digitalMarketing,
  //   socialMedia: parsedFeatures.socialMedia,
  //   ...Object.fromEntries(
  //     Object.entries(parsedFeatures)
  //       .filter(([key, feature]) => 
  //         (key.startsWith('custom-') && feature.value === true) && 
  //         (feature.isRecurring === true || feature.isRecurring === undefined)
  //       )
  //   )
  // };

  const recurringFeatures = Object.fromEntries(
    Object.entries(parsedFeatures)
      .filter(([key, feature]) => {
        // Include system recurring features
        if ((key === 'maintenance' || key === 'hosting' || 
             key === 'socialMedia' || key === 'digitalMarketing') && 
             feature?.value === true) {
          return true;
        }
        
        // For custom features - ONLY include if explicitly marked as recurring
        if (key.startsWith('custom-')) {
          return feature.value === true && feature.isRecurring === true;
        }
        
        return false;
      })
  );

  // Calculate recurring costs total
  const recurringCostsTotal = Object.values(recurringFeatures)
    .filter(feature => feature && feature.value)
    .reduce((sum, feature) => sum + (feature?.cost || 0), 0);

  // Calculate one-time costs total (should match project.oneTimePrice)
  const oneTimeCostsTotal = oneTimeFeatures
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, feature]) => {
      if (feature.type === 'toggle') {
        return feature.value === true;
      } else if (feature.type === 'select' || feature.type === 'tiers') {
        return typeof feature.value === 'string' && feature.value !== '';
      }
      return false;
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .reduce((sum, [_, feature]) => sum + feature.cost, 0);

  // Helper function to get detailed info for select/tier features
  const getDetailedFeatureInfo = (featureId: string, value: string) => {
    const featureDef = planDefinition?.features.find(f => f.id === featureId);
    
    if (featureDef?.type === 'select' && featureDef.options) {
      const option = featureDef.options.find(o => o.id === value);
      return {
        label: option?.name || value,
        icon: option?.icon || null
      };
    }
    
    if (featureDef?.type === 'tiers' && featureDef.tiers) {
      const tier = featureDef.tiers.find(t => t.id === value);
      return {
        label: tier?.name || value,
        icon: tier?.icon || null
      };
    }
    
    return {
      label: value,
      icon: null
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Project Details
          </DialogTitle>
        </DialogHeader>

        {/* Quick Summary Card */}
        <div className="bg-brand-primary/10 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{project.name}</h2>
              <p className="text-white/70">{project.company || 'No company specified'}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-sm ${
              project.status === 'approved' ? 'bg-green-500/20 text-green-500' :
              project.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
              project.status === 'completed' ? 'bg-blue-500/20 text-blue-500' :
              'bg-yellow-500/20 text-yellow-500'
            }`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </div>
          </div>
        </div>

        {/* Comprehensive Cost Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* One-time Costs */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Box className="text-brand-primary w-5 h-5" />
              <h3 className="font-semibold text-lg">One-time Deliverables</h3>
            </div>
            <div className="space-y-2">
              {oneTimeFeatures.length > 0 ? (
                oneTimeFeatures.map(([key, feature]) => {
                  // Skip if toggle type and value is false
                  if (feature.type === 'toggle' && feature.value === false) {
                    return null;
                  }
                  
                  // Special handling for select/tier type features
                  if ((feature.type === 'select' || feature.type === 'tiers') && typeof feature.value === 'string' && feature.value) {
                    const detailedInfo = getDetailedFeatureInfo(key, feature.value);
                    
                    return (
                      <div key={key} className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-white/70">{feature.name || key}: </span>
                          <div className="flex items-center gap-1">
                            {detailedInfo.icon && (
                              <Image 
                                src={detailedInfo.icon} 
                                alt={detailedInfo.label} 
                                width={16} 
                                height={16} 
                                className="object-contain" 
                              />
                            )}
                            <span className="text-brand-primary">{detailedInfo.label}</span>
                          </div>
                        </div>
                        <span>${feature.cost.toLocaleString()}</span>
                      </div>
                    );
                  }
                  
                  // For toggle features with value=true
                  if (feature.type === 'toggle' && feature.value === true) {
                    return (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-white/70">{feature.name || key}</span>
                        <span>${feature.cost.toLocaleString()}</span>
                      </div>
                    );
                  }
                  
                  // For any other valid feature types
                  return null;
                })
              ) : (
                <div className="text-sm text-white/50 italic">No one-time deliverables</div>
              )}
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total One-time</span>
                  <span className="text-brand-primary">${oneTimeCostsTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recurring Costs */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="text-brand-primary w-5 h-5" />
              <h3 className="font-semibold text-lg">Recurring Services</h3>
            </div>
            <div className="space-y-2">
              {/* Maintenance Cost */}
              {recurringFeatures.maintenance?.value && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Maintenance</span>
                  <div className="text-right">
                    <span>${recurringFeatures.maintenance.cost.toLocaleString()}</span>
                    <span className="text-xs text-white/50">/{project.recurringInterval}</span>
                  </div>
                </div>
              )}
              {/* Hosting Cost */}
              {recurringFeatures.hosting?.value && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Hosting</span>
                  <div className="text-right">
                    <span>${recurringFeatures.hosting.cost.toLocaleString()}</span>
                    <span className="text-xs text-white/50">/{project.recurringInterval}</span>
                  </div>
                </div>
              )}
              {/* Social Media Cost */}
              {recurringFeatures.socialMedia?.value && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Social Media Management</span>
                  <div className="text-right">
                    <span>${recurringFeatures.socialMedia.cost.toLocaleString()}</span>
                    <span className="text-xs text-white/50">/{project.recurringInterval}</span>
                  </div>
                </div>
              )}
              {/* Digital Marketing Cost */}
              {recurringFeatures.digitalMarketing?.value && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Digital Marketing</span>
                  <div className="text-right">
                    <span>${recurringFeatures.digitalMarketing.cost.toLocaleString()}</span>
                    <span className="text-xs text-white/50">/{project.recurringInterval}</span>
                  </div>
                </div>
              )}
              
              {/* Custom Recurring Features */}
              {Object.entries(parsedFeatures)
                .filter(([key, feature]) => 
                  key.startsWith('custom-') && 
                  feature.value === true &&
                  feature.isRecurring === true
                )
                .map(([key, feature]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-white/70">{feature.name}</span>
                    <div className="text-right">
                      <span>${feature.cost.toLocaleString()}</span>
                      <span className="text-xs text-white/50">/{project.recurringInterval}</span>
                    </div>
                  </div>
                ))
              }
              
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span>Regular Price</span>
                    {project.originalPrice && project.recurringInterval === 'annually' && (
                      <span className="text-white/50 line-through">
                        ${project.originalPrice.toLocaleString()}/{project.recurringInterval}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Recurring</span>
                    <span className="text-brand-primary">
                      ${recurringCostsTotal.toLocaleString()}/{project.recurringInterval}
                      {project.recurringInterval === 'annually' && (
                        <span className="text-xs text-green-500 ml-2">(20% off)</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Investment Summary */}
        <div className="bg-brand-primary/20 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-lg mb-3">Total Investment</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-white/70">Initial Payment</div>
              <div className="text-2xl font-bold">${oneTimeCostsTotal.toLocaleString()}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-white/70">
                Recurring ({project.recurringInterval})
              </div>
              <div className="text-2xl font-bold">
                ${recurringCostsTotal.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Project Specifications */}
        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-lg mb-3">Project Specifications</h3>
          <div className="space-y-3">
            {/* Display platform selection if present */}
            {parsedFeatures.platform && typeof parsedFeatures.platform.value === 'string' && parsedFeatures.platform.value && (
              <div className="flex items-start gap-2">
                <div className="bg-brand-primary/20 p-2 rounded-lg mt-1">
                  <Box className="text-brand-primary w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium">Platform</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {(() => {
                      const platformInfo = getDetailedFeatureInfo('platform', parsedFeatures.platform.value as string);
                      return (
                        <>
                          {platformInfo.icon && (
                            <Image 
                              src={platformInfo.icon} 
                              alt={platformInfo.label} 
                              width={20} 
                              height={20} 
                              className="object-contain" 
                            />
                          )}
                          <span className="text-brand-primary">{platformInfo.label}</span>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
            
            {/* Display pages selection if present */}
            {parsedFeatures.pages && typeof parsedFeatures.pages.value === 'string' && parsedFeatures.pages.value && (
              <div className="flex items-start gap-2">
                <div className="bg-brand-primary/20 p-2 rounded-lg mt-1">
                  <Box className="text-brand-primary w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium">Pages</h4>
                  <div className="mt-1">
                    {(() => {
                      const pagesInfo = getDetailedFeatureInfo('pages', parsedFeatures.pages.value as string);
                      return <span className="text-brand-primary">{pagesInfo.label}</span>;
                    })()}
                  </div>
                </div>
              </div>
            )}
            
            {/* Other select/tier type features */}
            {Object.entries(parsedFeatures)
              .filter(([key, feature]) => 
                (feature.type === 'select' || feature.type === 'tiers') && 
                typeof feature.value === 'string' &&
                feature.value && 
                key !== 'platform' && 
                key !== 'pages'
              )
              .map(([key, feature]) => (
                <div key={key} className="flex items-start gap-2">
                  <div className="bg-brand-primary/20 p-2 rounded-lg mt-1">
                    <Box className="text-brand-primary w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">{feature.name || key}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {(() => {
                        const infoDetail = getDetailedFeatureInfo(key, feature.value as string);
                        return (
                          <>
                            {infoDetail.icon && (
                              <Image 
                                src={infoDetail.icon} 
                                alt={infoDetail.label} 
                                width={20} 
                                height={20} 
                                className="object-contain" 
                              />
                            )}
                            <span className="text-brand-primary">{infoDetail.label}</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Additional Project Details */}
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-lg mb-3">Project Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-white/70 mb-1">Contact</div>
              <div>{project.email}</div>
              {project.phone && <div>{project.phone}</div>}
            </div>
            <div>
              <div className="text-white/70 mb-1">Solution Type</div>
              <div className="capitalize">{project.planType}</div>
            </div>
            <div>
              <div className="text-white/70 mb-1">Meeting Scheduled</div>
              <div className="flex items-center gap-1">
                <CalendarRange className="size-4 text-brand-primary" />
                {project.meetingTime 
                  ? new Date(project.meetingTime).toLocaleString()
                  : 'Not scheduled'}
              </div>
            </div>
            <div>
              <div className="text-white/70 mb-1">Created</div>
              <div>{new Date(project.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}