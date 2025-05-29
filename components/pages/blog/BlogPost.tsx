"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ChevronRight } from 'lucide-react';
import { Tilt } from '@/components/ui/tilt';

interface BlogPostProps {
  post: {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    tags: string[];
  };
  index: number;
  isFeatured?: boolean;
}

export default function BlogPost({ post, index, isFeatured = false }: BlogPostProps) {
  // Format date for display and SEO
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  if (isFeatured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 w-full"
      >
        <div className="relative rounded-3xl overflow-hidden aspect-[21/9] border border-white/10 group">
          {/* Background Image */}
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
            <div className="max-w-3xl">
              {/* Category and Date */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-brand-primary/90 text-black text-sm font-medium">
                  {post.category}
                </span>
                <time 
                  dateTime={post.date} 
                  className="flex items-center gap-1 text-white/70 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.date)}
                </time>
              </div>
              
              {/* Title and Excerpt */}
              <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-brand-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-white/70 mb-6 max-w-2xl">
                {post.excerpt}
              </p>
              
              {/* Author and Read More */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-primary" />
                  <span className="text-white/70">{post.author}</span>
                </div>
                <Link href={`/blogs/${post.slug}`} aria-label={`Read full article about ${post.title}`}>
                  <span className="flex items-center gap-1 text-brand-primary group-hover:gap-2 transition-all">
                    Read More <ChevronRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Tilt className="h-full">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="h-full relative bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden group hover:border-brand-primary/50 transition-all duration-300"
      >
        {/* Post Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-full bg-brand-primary/90 text-black text-xs font-medium">
              {post.category}
            </span>
          </div>
        </div>
        
        {/* Post Content */}
        <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
          {/* Meta info */}
          <div className="flex items-center justify-between text-sm text-white/70 mb-3">
            <time dateTime={post.date} className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.date)}
            </time>
            <span>{post.readTime}</span>
          </div>
          
          {/* Title and excerpt */}
          <h3 className="text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-white/70 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs text-white/50 px-2 py-1 rounded-full bg-white/5">
                {tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-white/50 px-2 py-1 rounded-full bg-white/5">
                +{post.tags.length - 2} more
              </span>
            )}
          </div>
        </div>
        
        {/* Read more link */}
        <Link 
          href={`/blogs/${post.slug}`}
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-4 bg-gradient-to-t from-black/90 to-transparent"
          aria-label={`Read full article about ${post.title}`}
        >
          <span className="flex items-center gap-1 text-brand-primary group-hover:gap-2 transition-all">
            Read Article <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
      </motion.article>
    </Tilt>
  );
}