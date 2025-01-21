// components/dashboard/inquiries/inquiry-details-modal.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Mail, Building2, Phone, Calendar, DollarSign, FileText, Box, Activity, AlertCircle } from 'lucide-react';
import { ProjectInquiry } from "@/hooks/use-inquiries";

interface InquiryDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ProjectInquiry | null;
}

export default function InquiryDetailsModal({
  open,
  onOpenChange,
  data
}: InquiryDetailsModalProps) {
  if (!data) return null;

  // Format project type for display
  const formatProjectType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get status color based on current status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-500';
      case 'contacted':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'in_discussion':
        return 'bg-purple-500/20 text-purple-500';
      case 'quoted':
        return 'bg-orange-500/20 text-orange-500';
      case 'accepted':
        return 'bg-green-500/20 text-green-500';
      case 'rejected':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-brand-primary/20 text-brand-primary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Inquiry Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats Card */}
          <div className="bg-brand-primary/10 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{data.name || 'Anonymous Inquiry'}</h2>
                <p className="text-white/70">{data.company || 'No company specified'}</p>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-sm ${getStatusColor(data.status)}`}>
                {formatProjectType(data.status)}
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

          {/* Project Details */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold mb-3">Project Details</h3>
            <div className="flex flex-col justify-between space-y-4">
              <div className="flex items-center">
                <div className="flex items-center gap-2 w-1/2">
                  <Box className="w-4 h-4 text-brand-primary" />
                  <span className="text-white/70">Project Type:</span>
                  <span>{formatProjectType(data.project)}</span>
                </div>
                <>
                  {data.budget && (
                    <div className="flex items-center gap-2 w-1/2">
                      <DollarSign className="w-4 h-4 text-brand-primary" />
                      <span className="text-white/70">Budget:</span>
                      <span>${data.budget.toLocaleString()}</span>
                    </div>
                  )}
                </>
              </div>
              {data.description && (
                <div className="flex gap-2 max-w-md">
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
            <h3 className="font-semibold mb-3">Timeline & Source</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Origin Information */}
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-primary" />
                <span className="text-white/70">Source:</span>
                <span className="capitalize">{data.origin || 'Website'}</span>
              </div>
              {data.meetingTime && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-primary" />
                  <span className="text-white/70">Meeting Time:</span>
                  <span>{format(new Date(data.meetingTime), 'PPp')}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-primary" />
                <span className="text-white/70">Created:</span>
                <span>{format(new Date(data.createdAt), 'PPp')}</span>
              </div>
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