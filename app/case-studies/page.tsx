import ProductsPageContent from '@/components/pages/case-studies/product-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Products & Case Studies | OonkoO Digital Solutions',
  description: "Explore our portfolio of successful digital products and transformative solutions. See how we have helped businesses achieve their goals through innovative technology.",
  keywords: "digital products, case studies, portfolio, success stories, client projects, digital solutions, web applications, mobile apps",
};

export default function ProductPage() {
  return <ProductsPageContent />;
}