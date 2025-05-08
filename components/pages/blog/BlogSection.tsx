// components/pages/BlogSection.tsx
"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import React, { useState } from 'react';
import { BlogCard } from '../cards/BlogCard';
import { blogPosts } from '@/lib/data/blogs';
import BlogPost from './BlogPost';




// Categories extracted from blog posts
const categories = ['All', 'Business', 'Digital Transformation', 'Web Design', 'Innovation', 'Digital Marketing', 'E-Commerce'];

export default function BlogSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Filter posts by category
  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory || post.tags.includes(activeCategory));

  return (
    <section className="py-16 sm:py-24 lg:py-32 w-full relative z-[1] overflow-hidden" id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="px-4 py-2 rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium mb-6 inline-block">
            Latest Insights
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Thought Leadership & Insights
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg">
            Stay ahead of the curve with our latest articles on technology trends, 
            digital innovation, and business transformation.
          </p>
        </motion.div>

        {/* Category Filter - Mobile Scrollable */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex overflow-x-auto scrollbar-hide gap-3 mb-10 pb-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-brand-primary text-black font-medium'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Featured Blog Post */}
        {filteredPosts.length > 0 && (
          <BlogCard 
            post={filteredPosts[0]} 
            index={0} 
            isFeatured={true} 
          />
        )}

        {/* Blog Post Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPosts.slice(1).map((post, index) => (
            <BlogPost
              key={post.id}
              post={post}
              index={index + 1}
              isFeatured={false}
            />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center flex justify-center w-full"
        >
          <Link href="/blogs">
            <HoverBorderGradient>
              <span className="flex items-center gap-2">
                Browse All Articles <ArrowRight className="w-4 h-4" />
              </span>
            </HoverBorderGradient>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}