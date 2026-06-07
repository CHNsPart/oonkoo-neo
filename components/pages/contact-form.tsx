"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Success
      setStatus('success');
      setName('');
      setEmail('');

      // Reset form after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);

    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
      
      // Reset error after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 relative">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative my-24 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-primary/20 to-black/40 p-12 backdrop-blur-sm"
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-primary/20 blur-[100px]" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          {/* Left: copy */}
          <div className="lg:flex-1">
            <h2 className="mb-3 text-3xl font-bold sm:text-4xl">{"Let's Connect"}</h2>
            <p className="max-w-md text-white/70">
              Ready to transform your digital presence? Get in touch with us.
            </p>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4 lg:flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === 'submitting'}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'submitting'}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Submit + status */}
            <div className="flex flex-col items-center gap-4 pt-1 sm:flex-row sm:items-center sm:justify-end">
              {/* Status Messages */}
              {status !== 'idle' && status !== 'submitting' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm"
                >
                  {status === 'success' && (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Message sent successfully!</span>
                    </>
                  )}
                  {status === 'error' && (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-500">{errorMessage}</span>
                    </>
                  )}
                </motion.div>
              )}

              <HoverBorderGradient>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="flex items-center gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <>
                      Sending...
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </>
                  ) : (
                    <>
                      Get started <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </HoverBorderGradient>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}