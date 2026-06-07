"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export interface ArticlePost {
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
}

const mono = { fontFamily: 'var(--font-geist-mono)' } as const;

const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));

export function ArticleMeta({ post }: { post: ArticlePost }) {
  return (
    <div
      style={mono}
      className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-white/45"
    >
      <span className="text-brand-primary">{post.category}</span>
      <span className="h-1 w-1 rounded-full bg-white/20" />
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span className="h-1 w-1 rounded-full bg-white/20" />
      <span>{post.readTime}</span>
    </div>
  );
}

export function ArticleTags({ post, limit }: { post: ArticlePost; limit: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {post.tags.slice(0, limit).map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/45 transition-colors group-hover:border-white/20"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/** Large editorial feature — image beside copy. */
export function FeaturedArticle({ post }: { post: ArticlePost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/blogs/${post.slug}`}
        className="group grid lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        aria-label={post.title}
      >
        <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <div className="lg:col-span-5">
          <ArticleMeta post={post} />
          <h3 className="mt-5 text-2xl md:text-3xl font-semibold leading-snug tracking-tight transition-colors duration-300 group-hover:text-brand-primary">
            {post.title}
          </h3>
          <p className="mt-4 text-white/55 leading-relaxed line-clamp-3">{post.excerpt}</p>
          <div className="mt-6">
            <ArticleTags post={post} limit={3} />
          </div>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-brand-primary">
            Read article
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/** Refined minimal grid card. */
export function ArticleCard({ post, index = 0 }: { post: ArticlePost; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blogs/${post.slug}`} className="group block" aria-label={post.title}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="mt-5">
          <ArticleMeta post={post} />
          <h4 className="mt-3 text-lg font-semibold leading-snug tracking-tight transition-colors duration-300 group-hover:text-brand-primary line-clamp-2">
            {post.title}
          </h4>
          <p className="mt-2.5 text-sm text-white/50 leading-relaxed line-clamp-2">{post.excerpt}</p>
          <div className="mt-4">
            <ArticleTags post={post} limit={2} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
