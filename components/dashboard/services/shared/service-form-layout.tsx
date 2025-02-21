"use client";

import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceFormLayoutProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

export function ServiceFormLayout({ isAdmin, children }: ServiceFormLayoutProps) {
  return (
    <div className="space-y-6">
      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-primary/10 rounded-xl p-4 border border-brand-primary/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-brand-primary mt-0.5" />
            <div className="space-y-2">
              <p className="text-white/90">For any query or support please contact us:</p>
              <a 
                href="mailto:oonkoo.mail@gmail.com"
                className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primaryLight transition-colors"
              >
                <Mail className="w-4 h-4" />
                oonkoo.mail@gmail.com
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
      <div className={cn(
        "bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6",
        !isAdmin && "opacity-90"
      )}>
        {children}
      </div>
    </div>
  );
}