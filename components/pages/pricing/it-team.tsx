'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Users2, Zap, ShieldCheck } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import Image from 'next/image';
import Link from 'next/link';

const TALENT_URL = 'https://talent.oonkoo.com/';

const proof = [
  { icon: Users2, label: 'Senior-led · 1:5' },
  { icon: Zap, label: 'Ships in 15 days' },
  { icon: ShieldCheck, label: '1 in 125 vetted' },
];

export default function ITTeam() {
  return (
    <section className="mb-32 container mx-auto sm:px-6 lg:px-4">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-brand-primary/25 blur-[110px]" />

        <div className="grid lg:grid-cols-2 lg:min-h-[580px]">
          {/* ── Left: the pitch ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:p-14"
          >
            {/* Brand row */}
            <div className="mb-7 flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-primary" />
              </span>
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-brand-primary">
                OonkoO Talent
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight">
              An engineering pod, for the price of{' '}
              <span className="text-brand-primary">one senior contractor.</span>
            </h2>

            {/* Hero savings */}
            <div className="mt-8 flex items-end gap-5">
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.18em] text-white/45">From</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-6xl font-bold leading-none text-brand-primary">$4</span>
                  <span className="text-lg text-white/60">/hr</span>
                </div>
              </div>
              <div className="flex flex-col items-start gap-1.5 pb-1">
                <span className="text-xl font-semibold text-white/35 line-through decoration-white/30">
                  $80/hr
                </span>
                <span className="rounded-full bg-brand-primary/15 px-2.5 py-0.5 text-xs font-semibold text-brand-primary">
                  Save up to 95%
                </span>
              </div>
            </div>

            {/* Proof chips */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {proof.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/75"
                >
                  <Icon className="h-3.5 w-3.5 text-brand-primary" />
                  {label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link href={TALENT_URL} target="_blank" rel="noopener noreferrer">
                <HoverBorderGradient className="cursor-pointer">
                  <span className="flex items-center gap-2 px-3 py-2 text-base font-medium">
                    Start a pod <ArrowUpRight className="h-4 w-4" />
                  </span>
                </HoverBorderGradient>
              </Link>
              <Link
                href={TALENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-brand-primary"
              >
                See how it works
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* ── Right: the visual ── */}
          <div className="relative h-full w-full min-h-[320px]">
            <Image
              src="/products/oonkoo-talent-poster-people.png"
              alt="An OonkoO Talent engineering pod"
              fill
              className="h-full w-full object-cover"
            />
            {/* Blend the photo into the card */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/90 lg:via-black/10 lg:to-transparent" />

            {/* Floating trust badge */}
            <div className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/50 px-3.5 py-1.5 backdrop-blur-md">
              <span className="text-xs font-medium text-white/80">2-week paid trial · cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
