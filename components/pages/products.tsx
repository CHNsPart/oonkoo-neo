'use client';

import { motion } from 'framer-motion';
import { ProductCard } from './cards/ProductCard';

const products = [
  {
    id: 1,
    name: "Employee Scheduling App",
    description: "A digital solution that streamlines workforce scheduling, automates shift management, and optimizes employee availability for businesses.",
    cursorImage: "/products/www.png",
    previewImage: "/products/www.png",
    company: "WhoWorksWhen",
    category: "In House App",
    tags: ["Enterprise", "AI", "Analytics"],
    link: "/products"
  },
  {
    id: 2,
    name: "DOOH Advertising Platform",
    description: "A platform designed to manage and deliver digital out-of-home advertising content across various screens and locations including mobile app.",
    cursorImage: "/products/ad-iq-app.jpg",
    previewImage: "/products/ad-iq-app.jpg",
    company: "AD-IQ",
    category: "Enterprise Solutions",
    tags: ["E-Commerce", "Scalable", "Modern"],
    link: "/products"
  },
  {
    id: 3,
    name: "Medical AI Platform",
    description: "An advanced platform that utilizes AI to assist healthcare professionals in diagnosing, predicting, and personalizing treatment plans for patients.",
    cursorImage: "/products/medicalprone.png",
    previewImage: "/products/medicalprone.png",
    company: "Asgar Ali Hospital",
    category: "Medical Solutions",
    tags: ["Mobile", "Cross-platform", "Native"],
    link: "/products"
  }
];

export default function Products() {
  return (
    <section className="py-32 container relative z-[1] overflow-hidden">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 flex flex-col justify-center items-center"
        >
          <span className="px-4 py-2 rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium mb-6 block">Our Products</span>
          <h2 className="text-4xl md:text-5xl text-center font-bold mb-6">Digital Solutions for Modern Business</h2>
          <p className="text-white/70 max-w-2xl text-lg text-center">
            Explore our cutting-edge digital products designed to transform your business and drive growth.
          </p>
        </motion.div>

        {/* Products List */}
        <div className="flex flex-col justify-center items-center w-full space-y-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}