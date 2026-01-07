interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  features: string[];
  tech: string[];
  coverImage: string;
  images: string[];
  mission: string;
  vision: string;
  category: string;
  company: string;
  companyLogo: string;
  link: string;
}

interface CaseStudyJsonLdProps {
  product: Product;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://oonkoo.com';

export function CaseStudyJsonLd({ product }: CaseStudyJsonLdProps) {
  const canonicalUrl = `${baseUrl}/case-studies/${product.slug}`;
  const ogImage = product.coverImage.startsWith('http')
    ? product.coverImage
    : `${baseUrl}${product.coverImage}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": canonicalUrl,
    "name": product.name,
    "headline": `${product.name} - ${product.category} Case Study`,
    "description": product.longDescription || product.description,
    "url": canonicalUrl,
    "image": {
      "@type": "ImageObject",
      "url": ogImage,
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Organization",
      "name": "OonkoO",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/oonkoo_logo.svg`
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "OonkoO",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/oonkoo_logo.svg`
      }
    },
    "about": {
      "@type": "Organization",
      "name": product.company,
      "logo": product.companyLogo.startsWith('http')
        ? product.companyLogo
        : `${baseUrl}${product.companyLogo}`
    },
    "genre": product.category,
    "keywords": [product.name, product.category, ...product.tech, ...product.features].join(', '),
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": product.name,
      "applicationCategory": product.category,
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "url": product.link
      }
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "OonkoO",
      "url": baseUrl
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Case Studies",
          "item": `${baseUrl}/case-studies`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.name,
          "item": canonicalUrl
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
