"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Palette, ShoppingCart, Globe, Brain, Smartphone, Server, Lock, Gem, Bot } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { Tilt } from '@/components/ui/tilt';
import ContactForm from '@/components/pages/contact-form';
import Link from 'next/link';
import React, { useState } from 'react';
import { ContactModal } from '@/components/ui/contact-modal';
import ITTeam from '../pricing/it-team';

// Define service categories
const serviceCategories = [
  {
    id: 'digital-presence',
    name: 'Digital Presence',
    description: 'Establish your brand online with cutting-edge solutions',
    services: [
      {
        icon: Globe,
        title: 'Website Development',
        description: 'Custom websites built with modern technologies like Next.js 14, React, and Tailwind CSS. Perfect for businesses looking to establish a powerful online presence.',
        features: ['SEO Optimization', 'Mobile-First Design', 'Analytics Integration', 'Content Management'],
        technologies: ['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS'],
        price: 'Starting from $1,199'
      },
      {
        icon: ShoppingCart,
        title: 'E-Commerce Solutions',
        description: 'Full-featured online stores with seamless payment integration, inventory management, and customer analytics.',
        features: ['Multi-Payment Gateway', 'Inventory System', 'Order Management', 'Customer Analytics'],
        technologies: ['Shopify', 'WooCommerce', 'Custom Solutions', 'Payment APIs'],
        price: 'Starting from $1,499'
      },
      {
        icon: Palette,
        title: 'UI/UX Design',
        description: 'User-centric design solutions that combine aesthetics with functionality to create engaging digital experiences.',
        features: ['User Research', 'Wireframing', 'Prototyping', 'User Testing'],
        technologies: ['Figma', 'Adobe XD', 'Framer', 'Principle'],
        price: 'Starting from $500'
      }
    ]
  },
  {
    id: 'enterprise-solutions',
    name: 'Enterprise Solutions',
    description: 'Scalable solutions for growing businesses',
    services: [
      {
        icon: Server,
        title: 'Custom Software Development',
        description: 'Tailored software solutions that automate processes, improve efficiency, and drive business growth.',
        features: ['Scalable Architecture', 'API Integration', 'Cloud Deployment', 'Maintenance'],
        technologies: ['Node.js', 'Python', 'Docker', 'AWS/Azure'],
        price: 'Starting from $3,000'
      },
      {
        icon: Brain,
        title: 'AI & Machine Learning',
        description: 'Leverage the power of AI to automate tasks, gain insights, and make data-driven decisions.',
        features: ['Predictive Analytics', 'Natural Language Processing', 'Computer Vision', 'Automation'],
        technologies: ['TensorFlow', 'PyTorch', 'OpenAI', 'Scikit-learn'],
        price: 'Custom Quote  ↣'
      },
      {
        icon: Lock,
        title: 'Cybersecurity Solutions',
        description: '2025-ready security implementations to protect your digital assets and ensure compliance.',
        features: ['Security Audit', 'Threat Detection', 'Compliance Support', '24/7 Monitoring'],
        technologies: ['Zero Trust', 'Blockchain', 'AI Security', 'Cloud Security'],
        price: 'Custom Quote  ↣'
      }
    ]
  },
  {
    id: 'mobile-innovations',
    name: 'Mobile Innovations',
    description: 'Next-gen mobile solutions for the modern world',
    services: [
      {
        icon: Smartphone,
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
        features: ['Cross-Platform', 'Native Performance', 'Offline Support', 'Push Notifications'],
        technologies: ['React Native', 'Flutter', 'iOS', 'Android'],
        price: 'Starting from $2,999'
      },
      {
        icon: Bot,
        title: 'AR/VR Applications',
        description: 'Immersive experiences that blend digital content with the real world for training, marketing, or entertainment.',
        features: ['3D Modeling', 'Interactive Design', 'Performance Optimization', 'Cross-platform'],
        technologies: ['Unity', 'ARKit', 'ARCore', 'WebXR'],
        price: 'Custom Quote  ↣'
      },
      {
        icon: Gem,
        title: 'Progressive Web Apps',
        description: 'Web applications that offer native-like experience across all devices with offline capabilities.',
        features: ['Offline First', 'Push Notifications', 'App-like Experience', 'Cross-platform'],
        technologies: ['PWA', 'Service Workers', 'WebAssembly', 'IndexedDB'],
        price: 'Starting from $1,499'
      }
    ]
  }
];

export default function ServicePageContent() {
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
            Our Services
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Innovative Solutions
            <br />
            <span className="text-brand-primary">for Modern Business</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg mb-8">
            Transform your business with our comprehensive suite of IT services. 
            From web development to AI solutions, we deliver innovation that drives growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <HoverBorderGradient onClick={() => setIsModalOpen(true)}>
              <span className="flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </span>
            </HoverBorderGradient>
            <Link href={"/pricing"}>
              <HoverBorderGradient>
                View Pricing
              </HoverBorderGradient>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Services Categories */}
      {serviceCategories.map((category) => (
        <section key={category.id} className="container mx-auto px-4 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-brand-primary text-sm">{category.name}</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{category.description}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative h-full bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden p-8 group hover:bg-black/60 transition-all duration-300"
                >
                  <div className="relative flex flex-col justify-between items-start h-full z-10">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center mb-6">
                      {React.createElement(service.icon, { className: "w-6 h-6 text-brand-primary" })}
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-white/70 mb-6">{service.description}</p>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-white/70">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Price & CTA */}
                    <div className="mt-auto">
                      <div className="mb-4">
                        <span className='text-brand-light'>{service.price.slice(0, 14)}</span>
                        { service.price.length > 14 && 
                          <span className='text-brand-primary border rounded-full font-semibold px-2.5 py-1 text-xl bg-brand-primary/10'>{service.price.slice(14, 20)}</span>
                        }
                      </div>
                      <Link href="/pricing">
                        <HoverBorderGradient className="w-full">
                          <span className="flex items-center justify-center gap-2">
                            Get Started <ArrowRight className="w-4 h-4" />
                          </span>
                        </HoverBorderGradient>
                      </Link>
                    </div>
                  </div>

                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </motion.div>
            ))}
          </div>
        </section>
      ))}

      {/* Process Section */}
      <section className="container mx-auto px-4 mb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-primary text-sm">Our Process</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">How We Work</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Discovery',
              description: 'We deeply understand your business needs and objectives'
            },
            {
              step: '02',
              title: 'Strategy',
              description: 'Develop a comprehensive plan aligned with your goals'
            },
            {
              step: '03',
              title: 'Development',
              description: 'Build your solution using cutting-edge technologies'
            },
            {
              step: '04',
              title: 'Launch & Support',
              description: 'Deploy your solution and provide ongoing maintenance'
            }
          ].map((phase, index) => (
            <Tilt key={phase.step} className="h-full">
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
              >
                <div className="text-4xl font-bold text-brand-primary mb-4">{phase.step}</div>
                <h3 className="text-xl font-semibold mb-2">{phase.title}</h3>
                <p className="text-white/70">{phase.description}</p>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 mb-32">
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
            {"Let's discuss how our services can help you achieve your goals."}
          </p>
          <HoverBorderGradient onClick={() => setIsModalOpen(true)}>
            <span className="flex items-center gap-2">
              Schedule a Call <ArrowRight className="w-4 h-4" />
            </span>
          </HoverBorderGradient>

          <ContactModal 
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            type="website"
            origin="Services CTA"
          />

          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-[80px]" />
        </motion.div>
      </section>

      <ITTeam/>

      <ContactForm />
    </main>
  );
}