'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';

const products = [
  {
    name: 'OonkoO Talent',
    detail: 'Senior-led engineering pods, embedded in your team from $4/hr.',
    poster: '/products/oonkoo-talent-poster.png',
    logo: '/products/oonkoo-talent.svg',
    logoSize: {
        width: 72,
        height: 72
    },
    cta: 'Hire or Start a Pod',
    href: 'https://talent.oonkoo.com/',
  },
  {
    name: 'OonkoO UI',
    detail: 'Production-ready React components, fully shadcn/ui compatible.',
    poster: '/products/oonkoo-ui-poster.png',
    logo: '/products/oonkoo-ui.svg',
    logoSize: {
        width: 32,
        height: 32
    },
    cta: 'Get React Components',
    href: 'https://ui.oonkoo.com/',
  },
];

export default function Ecosystem() {
  return (
    <section className="py-32 relative z-[1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center flex flex-col justify-center items-center mb-20"
        >
          <span className="px-4 py-2 w-fit rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium mb-6 block">
            OonkoO Ventures
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built by <span className="text-brand-primary">OonkoO</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Products we designed, shipped, and scaled in-house — now available to you.
          </p>
        </motion.div>

        {/* Product Posters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Link
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={product.name}
                className="group relative block aspect-square overflow-hidden rounded-3xl border border-white/10"
              >
                {/* Poster shell — full 1:1 image */}
                <Image
                  src={product.poster}
                  alt={product.name}
                  height={896}
                  width={896}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />

                {/* Details + CTA */}
                <div className="absolute inset-x-5 bottom-5 flex flex-col md:flex-row md:items-end justify-between gap-3">
                  <div>
                    <Image
                      src={product.logo}
                      alt="OonkoO Logo"
                      height={product.logoSize.height}
                      width={product.logoSize.width}
                      className="mb-1 opacity-80"
                    />
                    <h3 className="text-2xl font-semibold text-white">{product.name}</h3>
                    <p className="mt-1 max-w-lg text-xs leading-relaxed text-white/55">
                      {product.detail}
                    </p>
                  </div>
                  <HoverBorderGradient className="flex shrink-0 items-center gap-1.5 px-6 py-4 text-sm">
                    {product.cta}
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </HoverBorderGradient>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
