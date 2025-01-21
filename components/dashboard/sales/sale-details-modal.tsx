"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Mail, Building2, Phone, Calendar, Tag, Activity, FileText } from 'lucide-react';
import { SaleInquiry } from "@/hooks/use-sales";

interface SaleDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: SaleInquiry | null;
}

// Helper function for formatting currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Helper function for calculating discount percentage
const calculateDiscount = (original: number, sale: number) => {
  const discount = ((original - sale) / original) * 100;
  return Math.round(discount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new':
      return 'bg-blue-500/20 text-blue-500';
    case 'contacted':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'accepted':
      return 'bg-green-500/20 text-green-500';
    case 'rejected':
      return 'bg-red-500/20 text-red-500';
    default:
      return 'bg-brand-primary/20 text-brand-primary';
  }
};

export default function SaleDetailsModal({
  open,
  onOpenChange,
  data
}: SaleDetailsModalProps) {
  if (!data) return null;

  const discountPercentage = calculateDiscount(data.originalPrice, data.salePrice);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Sale Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats Card */}
          <div className="bg-brand-primary/10 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold">{data.name}</h2>
                <p className="text-white/70">{data.company || 'No company specified'}</p>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm ${getStatusColor(data.status)}`}>
                {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="flex items-center gap-4 p-3 bg-black/20 rounded-lg">
              <div>
                <p className="text-sm text-white/70">Original Price</p>
                <p className="text-lg line-through text-white/50">{formatPrice(data.originalPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-white/70">Sale Price</p>
                <p className="text-lg font-bold text-brand-primary">{formatPrice(data.salePrice)}</p>
              </div>
              <div className="ml-auto">
                <div className="px-3 py-1.5 bg-green-500/20 text-green-500 rounded-full">
                  {discountPercentage}% OFF
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-primary" />
                <span className="text-white/70">{data.email}</span>
              </div>
              {data.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-primary" />
                  <span className="text-white/70">{data.phone}</span>
                </div>
              )}
              {data.company && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-primary" />
                  <span className="text-white/70">{data.company}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sale Details */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold mb-3">Sale Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-primary" />
                <span className="text-white/70">Sale Type:</span>
                <span className="capitalize">{data.type.replace('_', ' ')}</span>
              </div>
              {data.description && (
                <div className="flex gap-2">
                  <FileText className="w-4 h-4 text-brand-primary shrink-0 mt-1" />
                  <div>
                    <span className="text-white/70 block">Description:</span>
                    <p className="mt-1">{data.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Information */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold mb-3">Timeline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-primary" />
                <span className="text-white/70">Created:</span>
                <span>{format(new Date(data.createdAt), 'PPp')}</span>
              </div>
              {data.meetingTime && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-primary" />
                  <span className="text-white/70">Meeting:</span>
                  <span>{format(new Date(data.meetingTime), 'PPp')}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-primary" />
                <span className="text-white/70">Last Updated:</span>
                <span>{format(new Date(data.updatedAt), 'PPp')}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}