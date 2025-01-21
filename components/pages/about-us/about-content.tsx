"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Target } from 'lucide-react';
import Image from 'next/image';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { Tilt } from '@/components/ui/tilt';
import React, { useState } from 'react';
import ContactForm from '@/components/pages/contact-form';
import Link from 'next/link';
import { ContactModal } from '@/components/ui/contact-modal';

const values = [
  {
    icon: Sparkles,
    title: "Innovation First",
    description: "We push boundaries and embrace cutting-edge technologies to deliver exceptional solutions."
  },
  {
    icon: Heart,
    title: "Client Success",
    description: "Your success is our priority. We work closely with you to understand and achieve your goals."
  },
  {
    icon: Target,
    title: "Quality Driven",
    description: "We maintain the highest standards in everything we do, from code to design to client service."
  }
];

export default function AboutPageContent() {
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
            About OonkoO
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Who <span className="text-brand-primary">We</span> Are
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-xl mb-8">
            A global collective of innovators, designers, and developers crafting digital excellence through creativity and technical mastery.
          </p>
          <Link href={"/career"}>
            <HoverBorderGradient>
              <span className="flex items-center gap-2">
                Join Our Team <ArrowRight className="w-4 h-4" />
              </span>
            </HoverBorderGradient>
          </Link>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="container mx-auto px-4 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ x: -20 }}
            whileInView={{ x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square lg:aspect-auto lg:h-[600px]"
          >
            <div className="relative h-full w-full rounded-3xl overflow-hidden">
              <Image
                src="/oonkoo_logo.svg"
                alt="Our Team"
                fill
                className="object-contain p-5"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            {/* Floating Stats */}
            <motion.div
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-3xl font-bold text-brand-primary">6+</h4>
                  <p className="text-sm text-white/70">Years Experience</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-brand-primary">25+</h4>
                  <p className="text-sm text-white/70">Team Members</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-brand-primary">65+</h4>
                  <p className="text-sm text-white/70">Projects Delivered</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-brand-primary text-sm">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-bold">Building Digital Excellence</h2>
            <div className="space-y-4 text-white/70">
              <p>
                {"Founded with a vision to bridge the gap between global talent and local impact, OonkoO has grown into a dynamic force in digital innovation. Our journey began with a simple belief: exceptional technology should be accessible to businesses of all sizes."}
              </p>
              <p>
                {"Today, we're proud to be trusted by organizations worldwide, delivering cutting-edge solutions that drive real business outcomes. Our team spans continents, bringing diverse perspectives and expertise to every project."}
              </p>
              <p>
                {"We don't just build digital solutions; we craft experiences that resonate, platforms that perform, and partnerships that last. Our commitment to excellence is matched only by our passion for innovation."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-primary text-sm">Our Values</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">What Drives Us Forward</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Tilt key={value.title} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="h-full bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-8 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center mb-6">
                  {React.createElement(value.icon, { className: "w-6 h-6 text-brand-primary" })}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                <p className="text-white/70">{value.description}</p>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* CTA Section with Email */}
      <section className="container mx-auto px-4 mt-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative flex flex-col justify-center items-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-primary/5 to-black backdrop-blur-sm p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Have a Question?</h2>
          <p className="text-white/70">
            Email us at{' '}
            <a 
              href="mailto:oonkoo.mail@gmail.com" 
              className="text-brand-primary hover:text-brand-primaryLight transition-colors"
            >
              oonkoo.mail@gmail.com
            </a>
          </p>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 mt-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative flex flex-col justify-center items-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-primary/20 to-black/40 backdrop-blur-sm p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Join us in creating the next generation of digital solutions.
          </p>
          <HoverBorderGradient onClick={() => setIsModalOpen(true)}>
            <span className="flex items-center gap-2">
              Get in Touch <ArrowRight className="w-4 h-4" />
            </span>
          </HoverBorderGradient>

          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-[80px]" />
        </motion.div>

        <ContactModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          type="website"
          origin="About CTA"
        />
      </section>

      <ContactForm/>
    </main>
  );
}