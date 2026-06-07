// components/pages/blog/BlogPostPage.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BlogPost } from "@/types/blog";
import BlogPageSection from "./BlogPageSection";
import BlogFAQ from "./BlogFAQ";
import { HoverBorderGradient } from "@/components/ui/cta-button";
import { useEffect } from "react";
import { BlogJsonLd } from "@/components/seo/blog-json-ld";
import SocialShare from "./SocialShare";
import TableOfContents from "./TableOfContents";
import { ArticleCard } from "@/components/pages/cards/article-card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPostPageProps {
  blog: BlogPost;
  relatedPosts: BlogPost[];
}

const mono = { fontFamily: "var(--font-geist-mono)" } as const;

const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(
    new Date(dateString)
  );

export default function BlogPostPage({ blog, relatedPosts }: BlogPostPageProps) {
  // Inject structured data for SEO
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(blog.seo.structuredData);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [blog.seo.structuredData]);

  const sections = blog.content.sections.map((section) => ({
    id: section.id || section.title.toLowerCase().replace(/\s+/g, "-"),
    title: section.title,
  }));

  return (
    <main className="min-h-screen pt-28 pb-24">
      <BlogJsonLd blog={blog} />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/blogs"
          style={mono}
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-brand-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          All articles
        </Link>

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-10 max-w-3xl text-center"
        >
          <div
            style={mono}
            className="flex flex-wrap items-center justify-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-white/45"
          >
            <span className="text-brand-primary">{blog.category}</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <time dateTime={blog.date}>{formatDate(blog.date)}</time>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>{blog.readTime}</span>
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/55 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Author */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/10">
              <Image src="/oonkoo-team.png" alt={blog.author} fill className="object-cover" />
            </div>
            <span className="text-sm text-white/70">{blog.author}</span>
          </div>
        </motion.header>

        {/* ── Cover ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 max-w-5xl"
        >
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
            <Image src={blog.coverImage} alt={blog.title} fill priority className="object-cover" />
          </div>
        </motion.div>

        {/* ── Body ── */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Content */}
          <div className="lg:col-span-8 lg:col-start-1">
            {/* Lead / introduction */}
            {blog.content.introduction && (
              <div className="prose prose-invert prose-lg max-w-none border-b border-white/10 pb-10 mb-12">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ ...props }) => (
                      <p className="text-xl leading-relaxed text-white/75" {...props} />
                    ),
                    strong: ({ ...props }) => <strong className="font-semibold text-white" {...props} />,
                    em: ({ ...props }) => <em className="italic text-white/90" {...props} />,
                    a: ({ ...props }) => (
                      <a className="text-brand-primary underline transition-colors hover:text-brand-primary/80" {...props} />
                    ),
                  }}
                >
                  {blog.content.introduction}
                </ReactMarkdown>
              </div>
            )}

            {/* Sections */}
            <div className="space-y-14">
              {blog.content.sections.map((section, index) => (
                <BlogPageSection key={section.id || index} section={section} index={index} />
              ))}
            </div>

            {/* FAQ */}
            {blog.content.faq && blog.content.faq.length > 0 && (
              <div id="faq" className="scroll-mt-28 mt-16 border-t border-white/10 pt-12">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
                  Frequently asked questions
                </h2>
                <div className="space-y-3">
                  {blog.content.faq.map((faq, index) => (
                    <BlogFAQ key={index} faq={faq} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Conclusion */}
            {blog.content.conclusion && (
              <div id="conclusion" className="scroll-mt-28 mt-16 border-t border-white/10 pt-12">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-5">Conclusion</h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ ...props }) => (
                        <p className="text-lg leading-relaxed text-white/75" {...props} />
                      ),
                      strong: ({ ...props }) => <strong className="font-semibold text-white" {...props} />,
                      em: ({ ...props }) => <em className="italic text-white/90" {...props} />,
                      a: ({ ...props }) => (
                        <a className="text-brand-primary underline transition-colors hover:text-brand-primary/80" {...props} />
                      ),
                    }}
                  >
                    {blog.content.conclusion}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-14 rounded-2xl border border-white/10 bg-gradient-to-br from-brand-primary/10 to-transparent p-8 text-center sm:p-10">
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Have a project in mind?
              </h3>
              <p className="mx-auto mt-2 max-w-md text-white/55">
                Let&apos;s turn your idea into something exceptional.
              </p>
              <div className="mt-6 flex justify-center">
                <Link href="/about-us">
                  <HoverBorderGradient>
                    <span className="flex items-center gap-2 px-2 py-1">
                      Get in touch <ArrowRight className="h-4 w-4" />
                    </span>
                  </HoverBorderGradient>
                </Link>
              </div>
            </div>

            {/* Social share */}
            <div className="mt-12 border-t border-white/10 pt-8">
              <SocialShare url={`https://oonkoo.com/blogs/${blog.slug}`} title={blog.title} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-3 lg:col-start-10 order-first lg:order-none">
            <div className="sticky top-28 space-y-10">
              <TableOfContents sections={sections} />

              {/* Tags */}
              {blog.tags.length > 0 && (
                <div className="hidden lg:block">
                  <p
                    style={mono}
                    className="mb-4 text-[11px] uppercase tracking-[0.18em] text-white/40"
                  >
                    Topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/45"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* ── Related ── */}
        {relatedPosts.length > 0 && (
          <div className="mt-28 border-t border-white/10 pt-14">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <span style={mono} className="text-xs uppercase tracking-[0.24em] text-brand-primary">
                  Keep reading
                </span>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">Related articles</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {relatedPosts.map((post, index) => (
                <ArticleCard key={post.id} post={post} index={index} />
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
