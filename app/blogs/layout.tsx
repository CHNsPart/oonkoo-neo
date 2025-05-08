// app/blog/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog | Digital Insights & Expertise | OonkoO",
  description: "Explore our latest articles on digital transformation, web development, and business strategies to stay ahead in the rapidly evolving digital landscape.",
  keywords: "digital transformation, web development, business strategy, OonkoO blog, digital insights, technology trends, web design, e-commerce, digital marketing",
  openGraph: {
    title: "Blog | Digital Insights & Expertise | OonkoO",
    description: "Explore our latest articles on digital transformation, web development, and business strategies to stay ahead in the rapidly evolving digital landscape.",
    images: [
      {
        url: "/og-blog-image.png",
        width: 1200,
        height: 630,
        alt: "OonkoO Blog"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Digital Insights & Expertise | OonkoO",
    description: "Explore our latest articles on digital transformation, web development, and business strategies to stay ahead in the rapidly evolving digital landscape.",
    images: ["/og-blog-image.png"]
  }
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}