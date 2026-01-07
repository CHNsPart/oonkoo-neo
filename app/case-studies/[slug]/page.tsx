import { notFound } from 'next/navigation';
import { products } from '@/constants/case-studies';
import type { Metadata } from 'next';
import CaseStudyContent from '@/components/pages/case-studies/case-study-content';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://oonkoo.com';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Case Study Not Found | OonkoO',
      description: 'The requested case study could not be found.',
    };
  }

  // Create a rich description combining available info
  const metaDescription = product.longDescription
    ? `${product.longDescription.slice(0, 150)}...`
    : product.description;

  // Build comprehensive keywords
  const keywords = [
    product.name,
    product.category,
    product.company,
    'case study',
    'portfolio',
    'OonkoO',
    'software development',
    'web development',
    ...product.tech,
    ...product.features,
  ].join(', ');

  // Canonical URL
  const canonicalUrl = `${baseUrl}/case-studies/${product.slug}`;

  // Ensure coverImage is absolute URL
  const ogImage = product.coverImage.startsWith('http')
    ? product.coverImage
    : `${baseUrl}${product.coverImage}`;

  return {
    title: `${product.name} | ${product.category} Case Study | OonkoO`,
    description: metaDescription,
    keywords,
    authors: [{ name: 'OonkoO', url: baseUrl }],
    creator: 'OonkoO',
    publisher: 'OonkoO',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title: `${product.name} - ${product.category} | OonkoO Case Study`,
      description: metaDescription,
      url: canonicalUrl,
      siteName: 'OonkoO',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${product.name} - ${product.category} Case Study by OonkoO`,
        },
      ],
      locale: 'en_US',
      tags: [...product.tech, product.category, 'Case Study'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | OonkoO Case Study`,
      description: metaDescription,
      images: [ogImage],
      creator: '@oonkoo',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    category: product.category,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Find next and previous products for navigation
  const currentIndex = products.findIndex((p) => p.slug === slug);
  const nextProduct = products[currentIndex + 1] || null;
  const prevProduct = products[currentIndex - 1] || null;

  return (
    <CaseStudyContent
      product={product}
      nextProduct={nextProduct}
      prevProduct={prevProduct}
    />
  );
}
