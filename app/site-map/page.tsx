"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { blogPosts } from "@/lib/data/blogs";
import { products } from "@/constants/case-studies";

// Define page categories for grouping
type PageCategory = "Main" | "Company" | "Case Studies" | "Blog" | "Client Area" | "Other";

interface SitemapLink {
  title: string;
  url: string;
  description?: string;
  category: PageCategory;
  priority: number;
}

export default function SiteMapPage() {
  const [sitemapLinks, setSitemapLinks] = useState<SitemapLink[]>([]);

  useEffect(() => {
    // Main pages
    const mainPages: SitemapLink[] = [
      {
        title: "Home",
        url: "/",
        description: "Modern digital solutions for business growth",
        category: "Main",
        priority: 1.0,
      },
      {
        title: "Services",
        url: "/services",
        description: "Explore our range of digital services",
        category: "Main",
        priority: 0.9,
      },
      {
        title: "Case Studies",
        url: "/case-studies",
        description: "Discover our digital solutions and case studies",
        category: "Main",
        priority: 0.9,
      },
      {
        title: "Pricing",
        url: "/pricing",
        description: "View our transparent pricing options",
        category: "Main",
        priority: 0.9,
      },
    ];

    // Company pages
    const companyPages: SitemapLink[] = [
      {
        title: "About Us",
        url: "/about-us",
        description: "Learn about OonkoO's story and mission",
        category: "Company",
        priority: 0.8,
      },
      {
        title: "Culture",
        url: "/culture",
        description: "Discover our company values and culture",
        category: "Company",
        priority: 0.7,
      },
      {
        title: "Careers",
        url: "/careers",
        description: "Join our team of digital innovators",
        category: "Company",
        priority: 0.8,
      },
    ];

    // Case Study pages
    const caseStudyPages: SitemapLink[] = products.map(product => ({
      title: product.name,
      url: `/case-studies/${product.slug}`,
      description: product.description.substring(0, 100) + (product.description.length > 100 ? '...' : ''),
      category: "Case Studies" as PageCategory,
      priority: 0.8,
    }));

    // Client area
    const clientPages: SitemapLink[] = [
      {
        title: "Client Portal",
        url: "/client-portal",
        description: "Access your client dashboard and projects",
        category: "Client Area",
        priority: 0.6,
      },
    ];

    // Blog pages
    const blogPages: SitemapLink[] = [
      {
        title: "Blog Home",
        url: "/blogs",
        description: "Explore our latest articles and insights",
        category: "Blog",
        priority: 0.8,
      },
      ...blogPosts.map(post => ({
        title: post.title,
        url: `/blogs/${post.slug}`,
        description: post.excerpt.substring(0, 120) + (post.excerpt.length > 120 ? '...' : ''),
        category: "Blog" as PageCategory,
        priority: 0.7,
      })),
    ];

    // Other pages
    const otherPages: SitemapLink[] = [
      {
        title: "Sitemap",
        url: "/site-map",
        description: "Complete overview of all pages on our website",
        category: "Other",
        priority: 0.5,
      },
      {
        title: "404 - Page Not Found",
        url: "/404",
        description: "Error page displayed when a page is not found",
        category: "Other",
        priority: 0.1,
      },
    ];

    // Combine all pages
    setSitemapLinks([
      ...mainPages,
      ...companyPages,
      ...caseStudyPages,
      ...clientPages,
      ...blogPages,
      ...otherPages,
    ]);
  }, []);

  // Group links by category
  const groupedLinks = sitemapLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<PageCategory, SitemapLink[]>);

  // Define category order
  const categoryOrder: PageCategory[] = ["Main", "Case Studies", "Company", "Blog", "Client Area", "Other"];
  const sortedCategories = categoryOrder.filter(cat => groupedLinks[cat]?.length > 0);

  return (
    <main className="min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Site<span className="text-brand-primary">map</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            {"A complete overview of all the pages available on our website to help you navigate and find what you're looking for."}
          </p>
        </motion.div>

        {/* Sitemap Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedCategories.map((category, categoryIndex) => {
            const links = groupedLinks[category];
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className={`col-span-1 ${category === "Case Studies" || category === "Blog" ? "md:col-span-2" : ""}`}
              >
                <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6 h-full">
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                    <h2 className="text-2xl font-semibold flex items-center">
                      <span className="relative">
                        {category}
                        <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-brand-primary/50 rounded-full"></span>
                      </span>
                    </h2>
                    <span className="text-sm text-white/40">{links.length} pages</span>
                  </div>

                  <ul className={`space-y-4 ${(category === "Case Studies" || category === "Blog") ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 space-y-0" : ""}`}>
                    {links.map((link, index) => (
                      <motion.li
                        key={link.url}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (categoryIndex * 0.1) + (index * 0.03) }}
                      >
                        <Link
                          href={link.url}
                          className="group block"
                        >
                          <div className="flex items-start">
                            <ChevronRight className="w-4 h-4 mt-1 text-brand-primary mr-2 transition-transform group-hover:translate-x-1 shrink-0" />
                            <div className="min-w-0">
                              <div className="flex items-center">
                                <span className="font-medium group-hover:text-brand-primary transition-colors truncate">
                                  {link.title}
                                </span>
                                <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-brand-primary shrink-0" />
                              </div>
                              {link.description && (
                                <p className="text-sm text-white/60 mt-1 line-clamp-2">
                                  {link.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-white/50 text-sm">
            Total pages: <span className="text-brand-primary font-medium">{sitemapLinks.length}</span>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
