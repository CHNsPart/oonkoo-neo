"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BillingInterval } from "@/types/pricing";

interface PriceToggleProps {
  billingInterval: BillingInterval;
  onToggle: (interval: BillingInterval) => void;
  className?: string;
}

export function PriceToggle({ billingInterval, onToggle, className }: PriceToggleProps) {
  return (
    <div className={cn("flex items-center gap-4 justify-center", className)}>
      <button
        onClick={() => onToggle('monthly')}
        className={cn(
          "text-sm font-medium transition-colors",
          billingInterval === 'monthly' ? "text-white" : "text-white/60"
        )}
      >
        Monthly
      </button>
      <div 
        className="relative w-14 h-7.5 border bg-black/40 rounded-full p-1 cursor-pointer"
        onClick={() => onToggle(billingInterval === 'monthly' ? 'annually' : 'monthly')}
      >
        <motion.div
          className="w-5 h-5 rounded-full bg-brand-primary"
          animate={{
            x: billingInterval === 'monthly' ? 0 : 24,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </div>
      <button
        onClick={() => onToggle('annually')}
        className={cn(
          "text-sm font-medium transition-colors",
          billingInterval === 'annually' ? "text-white" : "text-white/60"
        )}
      >
        Annually
        <span className="px-2 py-1 rounded-full bg-brand-primaryLight/5 border border-white/10 ml-1.5 text-brand-primary text-xs ">Save 20%</span>
      </button>
    </div>
  );
}