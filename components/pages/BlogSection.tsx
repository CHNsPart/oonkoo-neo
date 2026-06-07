// components/pages/BlogSection.tsx
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { blogPosts } from '@/lib/data/blogs';
import { cn } from '@/lib/utils';
import { ArticleCard, FeaturedArticle } from './cards/article-card';

const mono = { fontFamily: 'var(--font-geist-mono)' } as const;

// Categories derived from the posts themselves
const categories = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))];

export default function BlogSection() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? blogPosts
      : blogPosts.filter(
          (p) => p.category === activeCategory || p.tags.includes(activeCategory)
        );

  const [featured, ...rest] = filtered;
  const grid = rest.slice(0, 3);

  return (
    <section className="py-24 sm:py-32 w-full relative z-[1]" id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — editorial split */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
        >
          <div>
            <span style={mono} className="text-xs uppercase tracking-[0.24em] text-brand-primary">
              Insights
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Thought leadership, distilled.
            </h2>
          </div>
          <Link
            href="/blogs"
            className="group hidden sm:inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-brand-primary"
          >
            View all articles
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* Category filter — subtle mono text links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-white/10 pb-8 mb-14 overflow-x-auto scrollbar-hide"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={mono}
              className={cn(
                'whitespace-nowrap text-xs uppercase tracking-[0.16em] transition-colors duration-200',
                activeCategory === category
                  ? 'text-brand-primary'
                  : 'text-white/40 hover:text-white/80'
              )}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Featured */}
        {featured && (
          <div className="mb-20">
            <FeaturedArticle key={featured.id} post={featured} />
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {grid.map((post, index) => (
            <ArticleCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Mobile-only view-all */}
        <div className="mt-14 flex justify-center sm:hidden">
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-brand-primary"
          >
            View all articles
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
