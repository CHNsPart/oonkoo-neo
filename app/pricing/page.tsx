import PricingPageContent from '@/components/pages/pricing/pricing-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Transparent Pricing | Digital Solution Packages | OonkoO",
  description: "Explore our flexible pricing plans for web development, mobile apps, and enterprise solutions. Find the perfect package for your business needs and budget.",
  keywords: "pricing plans, service packages, development costs, IT service pricing, web development pricing, mobile app costs, enterprise solutions",
};

export default function PricingPage() {
  return <PricingPageContent />;
}