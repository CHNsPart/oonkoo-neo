// Path: components/pages/blog/BlogPageSection.tsx

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BlogSection as BlogSectionType } from "@/types/blog";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogPageSection({
  section,
  index
}: {
  section: BlogSectionType;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      id={section.id}
      className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-brand-primary">{section.title}</h2>

      {section.image && (
        <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden">
          <Image
            src={section.image}
            alt={section.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="prose prose-invert prose-lg max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({...props}) => <h1 className="text-3xl font-bold my-4" {...props} />,
            h2: ({...props}) => <h2 className="text-2xl font-bold my-3 text-brand-primary" {...props} />,
            h3: ({...props}) => <h3 className="text-xl font-semibold my-3 text-brand-primary/90" {...props} />,
            h4: ({...props}) => <h4 className="text-lg font-medium my-2" {...props} />,
            p: ({...props}) => <p className="my-3 text-white/80 leading-relaxed" {...props} />,
            a: ({...props}) => <a className="text-brand-primary hover:text-brand-primary/80 underline transition-colors" {...props} />,
            ul: ({...props}) => <ul className="list-disc pl-6 my-4 space-y-2" {...props} />,
            ol: ({...props}) => <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />,
            li: ({...props}) => <li className="mb-1" {...props} />,
            blockquote: ({...props}) => (
              <blockquote className="border-l-4 border-brand-primary pl-4 italic my-4 text-white/70" {...props} />
            ),
            strong: ({...props}) => <strong className="font-bold text-white" {...props} />,
            em: ({...props}) => <em className="italic text-white/90" {...props} />,
            hr: ({...props}) => <hr className="my-6 border-white/20" {...props} />,
            code: ({className, ...props}) => {
              // Check if this is an inline code block based on the className
              const isInline = !className || !className.includes('language-');
              return isInline 
                ? <code className="px-1.5 py-0.5 bg-white/10 rounded text-brand-primary" {...props} />
                : <code className="block p-4 bg-black/60 rounded-lg my-4 overflow-x-auto" {...props} />;
            },
            pre: ({...props}) => <pre className="bg-black/60 p-4 rounded-lg my-6 overflow-x-auto" {...props} />,
            // Enhanced table styling
            table: ({...props}) => (
              <div className="my-6 overflow-hidden rounded-xl border border-white/20 bg-black/50 backdrop-blur-sm shadow-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10" {...props} />
                </div>
              </div>
            ),
            thead: ({...props}) => <thead className="bg-black/40" {...props} />,
            tbody: ({...props}) => <tbody className="divide-y divide-white/10" {...props} />,
            tr: ({...props}) => <tr className="transition-colors hover:bg-white/5" {...props} />,
            th: ({...props}) => <th className="px-6 py-4 text-left text-sm font-semibold text-brand-primary uppercase tracking-wider" {...props} />,
            td: ({...props}) => <td className="px-6 py-4 text-sm whitespace-normal text-white/80" {...props} />,
          }}
        >
          {section.content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}