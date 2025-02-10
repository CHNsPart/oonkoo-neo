"use client";

// components/pricing/sale-banner.tsx
import { motion } from 'framer-motion';
import { Gift, Timer, Star, Sparkles, ArrowRight } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { type Sale } from '@/constants/sales';
import { useState } from 'react';
import { Currency, formatCurrency } from '@/lib/utils';
import { SaleModal } from './sale-modal';

const iconMap = {
  gift: Gift,
  timer: Timer,
  star: Star,
  sparkles: Sparkles,
};

interface SaleBannerProps {
  sale: Sale;
  currency: Currency;
}

export function SaleBanner({ sale, currency }: SaleBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const Icon = iconMap[sale.icon];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-brand-primary/10 to-black/40 backdrop-blur-sm p-8 text-center"
      >
        <div className="absolute inset-0 bg-[url('/winter-pattern.svg')] opacity-5" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-brand-primary/20 p-3 rounded-2xl">
              <Icon className="w-8 h-8 text-brand-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold">{sale.name}</h3>
              <p className="text-white/70 text-sm max-w-xs">{sale.description}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-2 text-center">
              <div className="text-white/50 line-through text-sm">
                {formatCurrency(sale.originalPrice, currency)}
              </div>
              <div className="text-2xl font-bold text-brand-primary">
                {formatCurrency(sale.salePrice, currency)}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Timer className="w-4 h-4 text-brand-primary" />
              <span className="text-sm">Available till {sale.validUntil}</span>
            </div>
            <div onClick={() => setIsModalOpen(true)}>
              <HoverBorderGradient>
                <span className="flex items-center gap-2">
                  Grab Now <ArrowRight className="w-4 h-4" />
                </span>
              </HoverBorderGradient>
            </div>
          </div>
        </div>
      </motion.div>

      <SaleModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        sale={sale}
      />
    </>
  );
}