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

  // Calculate one-time costs from features
  const oneTimeCosts = Object.entries(parsedFeatures)
    .filter(([key]) => key !== 'maintenance' && key !== 'hosting')
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    .reduce((acc, [_, feature]) => acc + feature.cost, 0);

  // Get recurring costs
  const maintenanceCost = parsedFeatures.maintenance?.cost || 0;
  const hostingCost = parsedFeatures.hosting?.cost || 0;
  const totalRecurringCost = maintenanceCost + hostingCost;

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
              {Object.entries(parsedFeatures)
                .filter(([key]) => key !== 'maintenance' && key !== 'hosting')
                .map(([key, feature]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-white/70">{feature.name || key}</span>
                    <span>${feature.cost.toLocaleString()}</span>
                  </div>
                ))
              }
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total One-time</span>
                  <span className="text-brand-primary">${oneTimeCosts.toLocaleString()}</span>
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
              {parsedFeatures.maintenance?.value && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Maintenance</span>
                  <div className="text-right">
                    <span>${parsedFeatures.maintenance.cost.toLocaleString()}</span>
                    <span className="text-xs text-white/50">/{project.recurringInterval}</span>
                  </div>
                </div>
              )}
              {/* Hosting Cost */}
              {parsedFeatures.hosting?.value && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Hosting</span>
                  <div className="text-right">
                    <span>${parsedFeatures.hosting.cost.toLocaleString()}</span>
                    <span className="text-xs text-white/50">/{project.recurringInterval}</span>
                  </div>
                </div>
              )}
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
                      ${totalRecurringCost.toLocaleString()}/{project.recurringInterval}
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
              <div className="text-2xl font-bold">${oneTimeCosts.toLocaleString()}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-white/70">
                Recurring ({project.recurringInterval})
              </div>
              <div className="text-2xl font-bold">
                ${totalRecurringCost.toLocaleString()}
              </div>
            </div>
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