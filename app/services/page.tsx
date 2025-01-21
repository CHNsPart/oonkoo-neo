import ServicePageContent from '@/components/pages/services/service-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IT Services for Modern Business | Web, Mobile & Enterprise Solutions | OonkoO',
  description: 'Transform your business with our comprehensive IT services. From web development to AI solutions, we deliver cutting-edge technology solutions for 2025 and beyond.',
  keywords: 'IT services, web development, mobile apps, AI solutions, enterprise software, digital transformation, cloud computing, cybersecurity',
};

export default function ServicesPage() {
  return <ServicePageContent />;
}