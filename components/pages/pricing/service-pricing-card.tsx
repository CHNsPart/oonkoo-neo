"use client";

import { ServicePlan } from "@/types/service";
import { BillingInterval } from "@/types/pricing";
import { Currency, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { ServiceMeetingModal } from "./service-meeting-modal";

interface ServicePricingCardProps {
  service: ServicePlan;
  billingInterval: BillingInterval;
  currency: Currency;
}

export function ServicePricingCard({ 
  service, 
  billingInterval,
  currency 
}: ServicePricingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const price = service.price[billingInterval];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6 flex flex-col h-full"
    >
      {/* Header */}
      <div className="mb-6">
        <span className="flex items-center gap-2">
          <Image 
            src={service.icon} 
            alt={service.title} 
            width={24} 
            height={24} 
            className="object-contain"
          />
          <h3 className="text-2xl font-bold">{service.title}</h3>
        </span>
        <p className="text-white/70 mt-2">{service.description}</p>
      </div>

      {/* Pricing */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {formatCurrency(price, currency)}
          </span>
          <span className="text-white/70">/{billingInterval}</span>
        </div>
        {billingInterval === 'annually' && (
          <span className="text-sm text-green-500">Save 20%</span>
        )}
      </div>

      {/* Features */}
      <div className="flex-1 mb-6">
        <div className="space-y-3">
          {service.serviceDescription.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
              <span className="text-white/70">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div onClick={() => setIsModalOpen(true)}>
        <button className="w-full mt-6 px-6 py-3 bg-brand-primary rounded-full text-black font-medium hover:bg-brand-primary/90 transition-colors">
          Get Started
        </button>
      </div>

      {/* Meeting Modal */}
      <ServiceMeetingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        service={service}
        billingInterval={billingInterval}
      />
    </motion.div>
  );
}