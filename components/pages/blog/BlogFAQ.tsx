// components/pages/blog/BlogFAQ.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { BlogFAQ as BlogFAQType } from "@/types/blog";
import { cn } from "@/lib/utils";

export default function BlogFAQ({ 
  faq, 
  index 
}: { 
  faq: BlogFAQType; 
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-xl border border-white/10"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-4 text-left"
        aria-expanded={isOpen}
      >
        <h3 className="font-semibold">{faq.question}</h3>
        <ChevronDown 
          className={cn(
            "w-5 h-5 transition-transform", 
            isOpen && "transform rotate-180"
          )} 
        />
      </button>
      
      {isOpen && (
        <div className="p-4 pt-0 border-t border-white/10">
          <p className="text-white/70 pt-4">{faq.answer}</p>
        </div>
      )}
    </motion.div>
  );
}