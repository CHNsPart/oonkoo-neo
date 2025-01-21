// components/dashboard/clients/client-details-modal.tsx
"use client";

import { User } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from 'date-fns';
import { User as UserIcon, Calendar, Mail, UserCheck } from 'lucide-react';
import Image from "next/image";

interface ClientDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: User | null;  // Changed from 'client' to 'data'
}

export default function ClientDetailsModal({
  open,
  onOpenChange,
  data    // Changed from 'client' to 'data'
}: ClientDetailsModalProps) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Client Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4">
            {data.profileImage ? (
              <Image
                src={data.profileImage}
                alt={data.firstName || 'Profile'}
                height={20}
                width={20}
                className="w-20 h-20 rounded-xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-brand-primary" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold">
                {data.firstName} {data.lastName}
              </h3>
              <p className="text-white/70">{data.email}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-brand-primary mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Member Since</span>
              </div>
              <p className="text-lg">
                {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-brand-primary mb-2">
                <UserCheck className="w-4 h-4" />
                <span className="text-sm">Role</span>
              </div>
              <p className="text-lg capitalize">
                {data.roles || 'User'}
              </p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-primary" />
              <span>Email Verified</span>
              <span className="ml-auto">
                {data.lastLoginAt ? (
                  <span className="text-green-500">Yes</span>
                ) : (
                  <span className="text-yellow-500">No</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-primary" />
              <span>Last Login</span>
              <span className="ml-auto">
                {data.lastLoginAt ? (
                  formatDistanceToNow(new Date(data.lastLoginAt), { addSuffix: true })
                ) : (
                  'Never'
                )}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}