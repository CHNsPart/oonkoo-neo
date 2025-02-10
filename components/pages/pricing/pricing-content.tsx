// app/pricing/page.tsx

"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PriceToggle } from '@/components/pages/pricing/price-toggle';
import { PricingCard } from '@/components/pages/pricing/pricing-card';
import { BillingInterval } from '@/types/pricing';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { pricingPlans } from '@/constants/pricing';
import ContactForm from '@/components/pages/contact-form';
import { ContactModal } from '@/components/ui/contact-modal';
import { salesData } from '@/constants/sales';
import { Currency } from '@/lib/utils';
import { CurrencyToggle } from '@/components/pages/pricing/currency-toggle';
import { SaleBanner } from './sale-banner';

export default function PricingPageContent() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');

  const regularPlans = pricingPlans.filter(plan => !plan.isEnterprise);
  const enterprisePlan = pricingPlans.find(plan => plan.isEnterprise);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>('USD');

  return (
    <main className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex flex-col justify-center items-center"
        >
          <span className="px-4 py-2 rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium mb-6 inline-block">
            Pricing
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Simple, transparent 
            <br />
            <span className="text-brand-primary">pricing for everyone</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg mb-8">
            Choose the perfect plan for your needs. All plans include maintenance and hosting options.
          </p>
        </motion.div>
      </section>

      {/* Sales Banners */}
      <section className="container mx-auto px-4 mb-16 space-y-6">
        {salesData.map((sale) => (
          <SaleBanner key={sale.id} sale={sale} currency={currency} />
        ))}
      </section>

      {/* Billing Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center flex flex-col justify-center items-center container mx-auto px-4 mb-16 space-y-6"
      >
        <PriceToggle
          billingInterval={billingInterval}
          onToggle={setBillingInterval}
        />
        <CurrencyToggle 
          currency={currency}
          onToggle={setCurrency}
        />
        <span className='text-gray-500 font-mono text-xs'>
          All prices are in {currency}
        </span>
      </motion.div>

      <section className="container mx-auto px-4 mb-16">
        {/* Regular Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                currency={currency}
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
              currency={'USD'}
            />
          </motion.div>
        )}
      </section>

      {/* Custom Quote Section */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative flex flex-col justify-center items-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-primary/20 to-black/40 backdrop-blur-sm p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want something totally customized?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            {"Let's discuss your specific needs and create a tailored solution for your business."}
          </p>

          <HoverBorderGradient onClick={() => setIsModalOpen(true)}>
            <span className="flex items-center gap-2">
              Request Custom Quote <ArrowRight className="w-4 h-4" />
            </span>
          </HoverBorderGradient>

          <ContactModal 
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            type="website"
            origin="Pricing Quote"
          />

          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-[80px]" />
        </motion.div>
      </section>

      <ContactForm />
    </main>
  );
}