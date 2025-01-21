'use client';

import { motion } from 'motion/react';
import { Code2, Palette, Rocket } from 'lucide-react';
import { ServiceCard } from './cards/ServiceCard';

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Creating powerful, scalable web applications with cutting-edge technologies.",
    technologies: ["Next.js", "React", "TypeScript", "Node.js"],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Crafting beautiful, intuitive interfaces that users love to interact with.",
    technologies: ["Figma", "Adobe XD", "Webflow", "Framer"],
  },
  {
    icon: Rocket,
    title: "Digital Solutions",
    description: "Comprehensive digital solutions that drive business growth.",
    technologies: ["Analytics", "SEO", "Marketing", "Strategy"],
  }
];

export default function Services() {
  return (
    <section className="py-32 relative z-[1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center flex flex-col justify-center items-center mb-20"
        >
          <span className="px-4 py-2 w-fit rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium mb-6 block">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Services that Drive Growth</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            We combine technical excellence with creative innovation to deliver exceptional digital solutions.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>


    </section>
  );
}