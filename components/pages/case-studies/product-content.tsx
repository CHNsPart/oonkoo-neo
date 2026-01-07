"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { products } from '@/constants/case-studies';
import { ContactModal } from '@/components/ui/contact-modal';

// Dynamically import components to avoid SSR issues
const CircularGallery = dynamic(() => import('@/components/CircularGallery'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-b from-brand-primary/5 to-transparent animate-pulse" />
  ),
});

const CurvedLoop = dynamic(() => import('@/components/CurvedLoop'), {
  ssr: false,
  loading: () => <div className="h-32" />,
});

// Get unique categories with "All" at the start
const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

// Gallery items for CircularGallery
const galleryItems = products.map(p => ({
  image: p.coverImage,
  text: p.name
}));

export default function ProductsPageContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = products.filter(p =>
    selectedCategory === 'All' || p.category === selectedCategory
  );

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section with CurvedLoop */}
      <section className="relative min-h-screen flex flex-col">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px]" />
        </div>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              Portfolio
            </motion.span>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              Case <span className="text-brand-primary">Studies</span>
            </h1>

            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Crafting exceptional digital experiences for visionary brands.
              Discover how we turn ambitious ideas into market-leading products.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-brand-primary">65+</span>
                <span>Products Shipped</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-brand-primary">98%</span>
                <span>Client Retention</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-brand-primary">5★</span>
                <span>Avg. Rating</span>
              </div>
            </div>
          </motion.div>
        </div>



      {/* CircularGallery Section */}
      <section className="relative py-12">
        <div className="h-[400px] md:h-[500px] w-full">
          <CircularGallery
            items={galleryItems}
            bend={3}
            textColor="#3CB371"
            borderRadius={0.05}
            showText={false}
            imageWidth={1000}
            imageHeight={750}
          />
        </div>
      </section>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4">
          {/* Section Header with Metallic Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-brand-primary">Work</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              A curated selection of digital products we&apos;ve crafted for industry leaders
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-brand-primary text-black shadow-lg shadow-brand-primary/25'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Project Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <Link key={product.id} href={`/case-studies/${product.slug}`}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative cursor-pointer rounded-2xl overflow-hidden border border-white/10 hover:border-brand-primary/30 transition-all duration-300"
                  >
                  {/* Cover Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={product.coverImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="inline-block px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-medium mb-2">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-white/60 text-sm line-clamp-2">{product.description}</p>

                    {/* Tech badges */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {product.tech.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {product.tech.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs">
                          +{product.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

        {/* CurvedLoop Marquee */}
        <section className="relative h-fit py-12">
          <CurvedLoop
            marqueeText="DIGITAL EXCELLENCE • PREMIUM SOLUTIONS • WEB APPS • MOBILE APPS • PLATFORMS • "
            speed={1.5}
            curveAmount={200}
            direction="left"
            className="text-brand-primary/20"
          />
        </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative flex flex-col justify-center items-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-primary/20 to-black/40 backdrop-blur-sm p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            {"Let's discuss how our solutions can help you achieve your goals."}
          </p>
          <HoverBorderGradient onClick={() => setIsModalOpen(true)}>
            <span className="flex items-center gap-2">
              Book a Meeting <ArrowRight className="w-4 h-4" />
            </span>
          </HoverBorderGradient>

          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-[80px]" />
        </motion.div>
      </section>

      <ContactModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        type="website"
        origin="Case Studies CTA"
      />
    </main>
  );
}
