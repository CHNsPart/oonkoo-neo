"use client";

import { useState } from "react";
import { Play, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserService } from "@/types/service";
import { servicePlans } from "@/constants/services";

interface ActivateServiceButtonProps {
  service: UserService;
  onActivate: (serviceId: string, adminNotes?: string) => Promise<void>;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ActivateServiceButton({
  service,
  onActivate,
  variant = "default",
  size = "default",
}: ActivateServiceButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const servicePlan = servicePlans.find((p) => p.id === service.serviceId);

  const handleActivate = async () => {
    setLoading(true);
    setError(null);

    try {
      await onActivate(service.id, adminNotes || undefined);
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setAdminNotes("");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate service");
    } finally {
      setLoading(false);
    }
  };

  // Only show for pending services
  if (service.status !== "pending") {
    return null;
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className="bg-green-500/20 hover:bg-green-500/30 text-green-500 border-green-500/20"
      >
        <Play className="w-4 h-4 mr-2" />
        Activate Service
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black/95 backdrop-blur-xl border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Play className="w-5 h-5 text-green-500" />
              Activate Service
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Activate this service to start the billing period. The client will
              be charged starting from today.
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="py-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Service Activated!</p>
              <p className="text-white/70 text-sm">
                Billing period has started from today.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                {/* Service Info */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="font-medium mb-3">Service Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Service</span>
                      <span className="font-medium">{servicePlan?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Client</span>
                      <span>{service.userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Billing</span>
                      <span className="capitalize">{service.billingInterval}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Price</span>
                      <span className="text-brand-primary">
                        ${servicePlan?.price[service.billingInterval as "monthly" | "annually"]?.toLocaleString()}
                        /{service.billingInterval}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Admin Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Add internal notes about this activation..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="bg-white/5 border-white/10 resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-white/50 mt-1">
                    These notes are only visible to admins.
                  </p>
                </div>

                {/* Warning */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm">
                  <p className="flex items-start gap-2 text-yellow-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      This action will start the billing cycle immediately. Make
                      sure payment has been received before activating.
                    </span>
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                    {error}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                  className="border-white/10 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleActivate}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Activate Service
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
