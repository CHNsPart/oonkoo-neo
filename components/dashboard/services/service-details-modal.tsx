"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Calendar, DollarSign, Activity } from 'lucide-react';
import Image from 'next/image';
import { servicePlans } from '@/constants/services';
import { UserService } from '@/types/service';

interface ServiceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: UserService | null;
}

export default function ServiceDetailsModal({
  open,
  onOpenChange,
  data
}: ServiceDetailsModalProps) {
  if (!data) return null;

  const servicePlan = servicePlans.find(plan => plan.id === data.serviceId);
  const price = servicePlan?.price[data.billingInterval as 'monthly' | 'annually'] || 0;
  const serviceTemplate = servicePlans.find(s => s.id === data.serviceId);
  if (!serviceTemplate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Service Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats Card */}
          <div className="bg-brand-primary/10 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Image
                  src={serviceTemplate.icon}
                  alt={serviceTemplate.title}
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div>
                  <h2 className="text-xl font-bold">{serviceTemplate.title}</h2>
                  <p className="text-white/70">{data.userEmail}</p>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm ${
                data.status === 'active' ? 'bg-green-500/20 text-green-500' :
                data.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                data.status === 'paused' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-blue-500/20 text-blue-500'
              }`}>
                {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold mb-3">Service Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-primary" />
                <div>
                  <span className="text-white/70 text-sm">Billing</span>
                  <p className="capitalize">{data.billingInterval}</p>
                </div>
              </div> */}
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-primary" />
                <div>
                  <span className="text-white/70 text-sm">Price</span>
                  <p className="text-brand-primary">
                    ${price.toLocaleString()}/{data.billingInterval}
                    {data.billingInterval === 'annually' && (
                      <span className="text-xs text-green-500 ml-2">(20% off)</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-primary" />
                <div>
                  <span className="text-white/70 text-sm">Start Date</span>
                  <p>{format(new Date(data.startDate), 'PP')}</p>
                </div>
              </div>
              {data.endDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-primary" />
                  <div>
                    <span className="text-white/70 text-sm">End Date</span>
                    <p>{format(new Date(data.endDate), 'PP')}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-primary" />
                <div>
                  <span className="text-white/70 text-sm">Last Updated</span>
                  <p>{format(new Date(data.updatedAt), 'PP')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold mb-3">Service Features</h3>
            <div className="grid grid-cols-1 gap-2">
              {serviceTemplate.serviceDescription.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-white/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}