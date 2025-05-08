// components/seo/blog-json-ld.tsx
import { BlogPost } from "@/types/blog";

export function BlogJsonLd({ blog }: { blog: BlogPost }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.coverImage,
    "datePublished": blog.date,
    "author": {
      "@type": "Person",
      "name": blog.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "OonkoO",
      "logo": {
        "@type": "ImageObject",
        "url": "https://oonkoo.com/oonkoo_logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://oonkoo.com/blogs/${blog.slug}`
    },
    "keywords": blog.tags.join(", ")
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}