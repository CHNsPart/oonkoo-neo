"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { products } from '@/constants/products';
import { ProductPageCard } from '@/components/pages/cards/ProductPageCard';
import ContactForm from '@/components/pages/contact-form';
import { ContactModal } from '@/components/ui/contact-modal';

// Get unique categories
const categories = Array.from(new Set(products.map(p => p.category)));

export default function ProductsPageContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredProducts = products.filter(p => 
    selectedCategory === 'All' || p.category === selectedCategory
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex flex-col justify-center items-center"
        >
          <span className="px-4 py-2 rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium mb-6 inline-block">
            Our Solutions
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Cutting-edge Products
            <br />
            <span className="text-brand-primary">for Modern Business</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg mb-8">
            Discover our suite of innovative digital solutions designed to transform 
            your business operations and drive growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={"/pricing"}>
              <HoverBorderGradient>
                <span className="flex items-center gap-2">
                  Explore Solutions <ArrowRight className="w-4 h-4" />
                </span>
              </HoverBorderGradient>
            </Link>
            <HoverBorderGradient onClick={() => setIsModalOpen(true)}>
              <span className="flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </span>
            </HoverBorderGradient>
          </div>
        </motion.div>
      </section>

      <ContactModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        type="website"
        origin="Products CTA"
      />

      {/* Category Tabs */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-brand-primary text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Scroll Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="flex gap-4 overflow-x-auto pb-8">
          {filteredProducts.map((product) => (
            <ProductPageCard
              key={product.name}
              title={product.name}
              category={product.category}
              coverImage={product.coverImage}
              onClick={() => {
                setSelectedProduct(product);
                setSelectedImage(product.coverImage);
              }}
              isSelected={selectedProduct?.name === product.name}
            />
          ))}
        </div>
      </div>

      {/* Product Details Bento Grid */}
      <AnimatePresence mode="wait">
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="container mx-auto px-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Main Content Section - Spans 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Hero Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden aspect-video relative"
                >
                  <Image
                    src={selectedImage || selectedProduct.coverImage}
                    alt={selectedProduct.name}
                    fill
                    quality={100}
                    className="object-contain"
                  />
                </motion.div>

                {/* Title and Description */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-black/40 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-4">
                      <div>
                        <span className="text-brand-primary text-sm">{selectedProduct.category}</span>
                        <h2 className="text-2xl font-bold mt-2">{selectedProduct.name}</h2>
                      </div>
                      <p className="text-white/70">{selectedProduct.description}</p>
                      {selectedProduct.longDescription && (
                        <p className="text-white/70">{selectedProduct.longDescription}</p>
                      )}
                    </div>
                    <Link 
                      href={selectedProduct.link}
                      className="shrink-0 bg-brand-primary/20 p-3 rounded-full hover:bg-brand-primary/30 transition-colors"
                    >
                      <ExternalLink className="w-6 h-6 text-brand-primary" />
                    </Link>
                  </div>
                </motion.div>

                {/* Features and Tech Stack in Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-black/40 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
                  >
                    <h3 className="text-xl font-semibold mb-4">Features</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedProduct.features.map((feature) => (
                        <div 
                          key={feature}
                          className="flex items-center gap-2 text-white/70"
                        >
                          <Sparkles className="w-4 h-4 text-brand-primary shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Tech Stack - Conditional Render */}
                  {selectedProduct.tech && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-black/40 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
                    >
                      <h3 className="text-xl font-semibold mb-4">Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right Column - Supporting Information */}
              <div className="space-y-6">
                {/* Company Info - Moved up for importance */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-black/40 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-semibold mb-4">Company</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative size-20 rounded-xl overflow-hidden bg-black/20">
                      <Image
                        src={selectedProduct.companyLogo}
                        alt={selectedProduct.company}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">{selectedProduct.company}</h4>
                      <p className="text-white/70 text-sm">Client & Partner</p>
                    </div>
                  </div>
                </motion.div>

                {/* Image Gallery */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-black/40 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-semibold mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 gap-4 overflow-y-auto h-44 space-y-4">
                    {selectedProduct.images.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all py-8 shadow-md ${
                          selectedImage === image ? 'border-brand-primary' : 'border-transparent'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Mission and Vision Combined */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-black/40 backdrop-blur-sm rounded-3xl p-6 border border-white/10 space-y-6"
                >
                  {/* Mission */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Mission</h3>
                    <p className="text-white/70">{selectedProduct.mission}</p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10"></div>

                  {/* Vision */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Vision</h3>
                    <p className="text-white/70">{selectedProduct.vision}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="container mx-auto px-4 mt-32">
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
      
      <ContactForm />
    </main>
  );
}