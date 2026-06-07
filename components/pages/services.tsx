'use client';

import { motion } from 'motion/react';
import { OonkooIcons } from '@/components/ui/oonkoo-icon';
import { ServiceCard } from './cards/ServiceCard';

const services = [
  {
    icon: OonkooIcons.Code,
    title: "Product Engineering",
    description: "We build scalable web applications with production-grade architecture and AI woven into the core, not bolted on after launch.",
    technologies: ["Next.js", "React", "TypeScript", "AI/LLM"],
    video: "https://cdn.pixabay.com/video/2016/09/05/4941-181472380_tiny.mp4",
  },
  {
    icon: OonkooIcons.Palatte,
    title: "Product Design",
    description: "We design interfaces people trust and return to, balancing brand, usability, and conversion at every screen.",
    technologies: ["Figma", "Design Systems", "Prototyping", "Framer"],
    video: "https://cdn.pixabay.com/video/2020/10/19/52823-471089056_tiny.mp4",
  },
  {
    icon: OonkooIcons.LineChart,
    title: "Growth & Intelligence",
    description: "We turn product data into decisions, combining analytics, automation, and AI to compound growth long after launch.",
    technologies: ["Analytics", "SEO", "Automation", "Strategy"],
    video: "https://cdn.pixabay.com/video/2020/08/21/47802-451812879_tiny.mp4",
  },
  {
    icon: OonkooIcons.Smartphone,
    title: "Mobile Engineering",
    description: "We ship native-grade mobile apps from a single codebase — tuned for speed, offline resilience, and on-device AI.",
    technologies: ["iOS", "Android", "React Native", "Expo"],
    video: "https://cdn.pixabay.com/video/2023/06/30/169445-841382824_tiny.mp4",
  },
  {
    icon: OonkooIcons.Cloud,
    title: "Cloud & DevOps",
    description: "We architect infrastructure that scales on demand and ships continuously, so your team moves fast without breaking production.",
    technologies: ["AWS", "Vercel", "Docker", "CI/CD"],
    video: "https://cdn.pixabay.com/video/2023/10/10/184489-873483996_tiny.mp4",
  },
  {
    icon: OonkooIcons.ShoppingBag,
    title: "Commerce Systems",
    description: "We build high-conversion storefronts on headless commerce, engineered for performance, payments, and revenue at scale.",
    technologies: ["Shopify", "Stripe", "Headless", "Conversion"],
    video: "https://cdn.pixabay.com/video/2024/11/19/242111_tiny.mp4",
  },
  {
    icon: OonkooIcons.BookOpen,
    title: "Documents & Collateral",
    description: "We craft portfolio books, catalogs, and pitch decks that make your company as credible on paper as it is in the room.",
    technologies: ["Portfolio", "Catalog", "Pitch Decks", "Print"],
    video: "https://cdn.pixabay.com/video/2019/06/17/24497-344562750_tiny.mp4",
  },
  {
    icon: OonkooIcons.Megaphone,
    title: "Content & Visibility",
    description: "We manage social, produce content, and engineer visibility — ranking you on search and surfacing you inside AI answer engines.",
    technologies: ["Social", "Content", "SEO", "AEO"],
    video: "https://cdn.pixabay.com/video/2017/01/12/7249-199191048_tiny.mp4",
  },
  {
    icon: OonkooIcons.Users,
    title: "OonkoO POD",
    description: "Our People-On-Demand model embeds dedicated senior and junior engineers — full-time or part-time — to maintain, scale, or staff your team.",
    technologies: ["Dedicated Teams", "Staff Aug", "Maintenance", "Full/Part-time"],
    video: "https://cdn.pixabay.com/video/2020/08/21/47802-451812879_tiny.mp4",
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
          <span className="px-4 py-2 w-fit rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium mb-6 block">What We Build</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Engineered to{" "}
            <span className="text-brand-primary">Outperform</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            We pair senior engineering with applied AI to ship products that move real metrics — not just demos that look good on a slide.
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
