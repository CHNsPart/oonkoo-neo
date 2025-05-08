"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Currency } from "@/lib/utils";
import Image from "next/image";

interface CurrencyToggleProps {
  currency: Currency;
  onToggle: (currency: Currency) => void;
  className?: string;
}

export function CurrencyToggle({ currency, onToggle, className }: CurrencyToggleProps) {
  return (
    <div className={cn("flex items-center gap-4 justify-center", className)}>
      <button
        onClick={() => onToggle('USD')}
        className={cn(
          "text-sm font-medium transition-colors flex gap-1 items-center",
          currency === 'USD' ? "text-white" : "text-white/60"
        )}
      >
        <Image 
          src="https://cdn.countryflags.com/thumbs/united-states-of-america/flag-round-250.png"          
          className={cn("w-4 rounded-full", currency === "USD" ? " opacity-100" : " opacity-30" )} 
          alt="canada" 
        /> USD
      </button>
      <div 
        className="relative w-14 h-7.5 border bg-black/40 rounded-full p-1 cursor-pointer"
        onClick={() => onToggle(currency === 'USD' ? 'CAD' : 'USD')}
      >
        <motion.div
          className="w-5 h-5 rounded-full bg-brand-primary"
          animate={{
            x: currency === 'USD' ? 0 : 24,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </div>
      <button
        onClick={() => onToggle('CAD')}
        className={cn(
          "text-sm font-medium transition-colors flex gap-1 items-center",
          currency === 'CAD' ? "text-white" : "text-white/60"
        )}
      >
        <img 
          src="https://cdn.countryflags.com/thumbs/canada/flag-round-250.png" 
          className={cn("w-4", currency === "CAD" ? " opacity-100" : " opacity-30" )} 
          alt="canada" 
        /> CAD
      </button>
    </div>
  );
}