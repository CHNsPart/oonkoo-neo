// components/pages/blog/BlogPostPage.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { BlogPost } from "@/types/blog";
import BlogSection from "./BlogPageSection";
import BlogFAQ from "./BlogFAQ";
import { HoverBorderGradient } from "@/components/ui/cta-button";
import { useEffect } from "react";
import { BlogJsonLd } from "@/components/seo/blog-json-ld";
import SocialShare from "./SocialShare";
import TableOfContents from "./TableOfContents";
import { BlogCard } from "@/components/pages/cards/BlogCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPostPageProps {
  blog: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostPage({ blog, relatedPosts }: BlogPostPageProps) {
  // This helps with SEO by updating the structured data
  useEffect(() => {
    // Add structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(blog.seo.structuredData);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [blog.seo.structuredData]);

  // Create section IDs for table of contents navigation
  const sections = blog.content.sections.map((section) => ({
    id: section.id || section.title.toLowerCase().replace(/\s+/g, '-'),
    title: section.title,
  }));

  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* BlogJsonLD component for structured data */}
      <BlogJsonLd blog={blog} />
      
      <div className="container mx-auto px-4">
        {/* Back to Blogs Link */}
        <div className="mb-8">
          <Link href="/blogs" className="flex items-center gap-2 text-brand-primary hover:text-brand-primaryLight transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>
        </div>
        
        {/* Blog Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
            {/* Feature Image */}
            <div className="relative aspect-[21/9] w-full">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
            </div>
            
            {/* Header Content */}
            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-brand-primary/90 text-black text-xs font-medium">
                  {blog.category}
                </span>
                {blog.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                {blog.title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-primary" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-primary" />
                  <time dateTime={blog.date}>{new Date(blog.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-primary" />
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Blog Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6 lg:p-10"
          >
          {/* Introduction */}
          {blog.content.introduction && (
            <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6">
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({...props}) => <p className="text-xl leading-relaxed" {...props} />,
                    strong: ({...props}) => <strong className="font-bold text-white" {...props} />,
                    em: ({...props}) => <em className="italic text-white/90" {...props} />,
                    a: ({...props}) => <a className="text-brand-primary hover:text-brand-primary/80 underline transition-colors" {...props} />,
                  }}
                >
                  {blog.content.introduction}
                </ReactMarkdown>
              </div>
            </div>
          )}
            
            {/* Blog Sections */}
            {blog.content.sections.map((section, index) => (
              <BlogSection 
                key={section.id || index}
                section={section}
                index={index}
              />
            ))}
            
            {/* FAQ Section */}
            {blog.content.faq && blog.content.faq.length > 0 && (
              <div 
                id="faq"
                className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
              >
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {blog.content.faq.map((faq, index) => (
                    <BlogFAQ key={index} faq={faq} index={index} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Conclusion */}
            {blog.content.conclusion && (
              <div 
                id="conclusion"
                className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
              >
                <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({...props}) => <p className="text-lg leading-relaxed text-white/80" {...props} />,
                      strong: ({...props}) => <strong className="font-bold text-white" {...props} />,
                      em: ({...props}) => <em className="italic text-white/90" {...props} />,
                      a: ({...props}) => <a className="text-brand-primary hover:text-brand-primary/80 underline transition-colors" {...props} />,
                    }}
                  >
                    {blog.content.conclusion}
                  </ReactMarkdown>
                </div>
                
                {/* Call to Action */}
                <div className="mt-8 text-center">
                  <Link href="/about-us">
                    <HoverBorderGradient>
                      <span>Get in Touch</span>
                    </HoverBorderGradient>
                  </Link>
                </div>
              </div>
            )}
            
            {/* Social Share */}
            <SocialShare 
              url={`https://oonkoo.com/blogs/${blog.slug}`} 
              title={blog.title} 
            />
          </motion.div>
          
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Table of Contents */}
            <div className="sticky top-24">
              <TableOfContents sections={sections} />
              
              {/* Author Info */}
              <div className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6 mt-12">
                <h3 className="text-xl font-bold mb-4">About the Author</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image 
                      src="/oonkoo-team.png" 
                      alt={blog.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{blog.author}</h4>
                    <p className="text-white/70 text-sm">Digital Design Team</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm">
                  The OonkoO team specializes in cutting-edge digital design and development solutions for businesses of all sizes.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((post, index) => (
                <BlogCard 
                  key={post.id}
                  post={post}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}