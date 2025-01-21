// app/dashboard/pricing/page.tsx
"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { PriceToggle } from '@/components/pricing/price-toggle';
import { PricingCard } from '@/components/pricing/pricing-card';
import { BillingInterval } from '@/types/pricing';
import { pricingPlans } from '@/constants/pricing';
import { SaleBanner } from '@/components/pricing/sale-banner';
import { salesData } from '@/constants/sales';

export default function DashboardPricingPage() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');

  const regularPlans = pricingPlans.filter(plan => !plan.isEnterprise);
  const enterprisePlan = pricingPlans.find(plan => plan.isEnterprise);

  return (
    <div className="h-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Pricing Plans</h1>
        <p className="text-white/70 mt-2">
          Choose the perfect plan for your business needs
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Billing Toggle */}
        <div className="flex justify-center">
          <PriceToggle
            billingInterval={billingInterval}
            onToggle={setBillingInterval}
          />
        </div>

        {/* Sales Banners */}
        <div className="space-y-6">
          {salesData.map((sale) => (
            <SaleBanner key={sale.id} sale={sale} />
          ))}
        </div>

        {/* Regular Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regularPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PricingCard
                plan={plan}
                billingInterval={billingInterval}
              />
            </motion.div>
          ))}
        </div>

        {/* Enterprise Plan */}
        {enterprisePlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mx-auto w-fit"
          >
            <PricingCard
              plan={enterprisePlan}
              billingInterval={billingInterval}
            />
          </motion.div>
        )}

        {/* Additional Information */}
        <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">All Plans Include</h3>
            <p className="text-white/70">
              Premium Support 🟢 Regular Updates 🟢 Security Monitoring 🟢 Performance Optimization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}