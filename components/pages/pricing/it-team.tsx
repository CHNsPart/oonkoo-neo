import { useState } from 'react';
import { motion } from 'framer-motion';
import { ContactModal } from '@/components/ui/contact-modal';
import { ArrowRight, Users2, Clock, Globe2, Briefcase, CheckCircle2, Brain } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import Image from 'next/image';

const features = [
  {
    icon: Users2,
    title: 'Expert Team',
    description: 'Access to pre-vetted senior developers, designers, and tech leads'
  },
  {
    icon: Clock,
    title: 'Flexible Engagement',
    description: 'Project-based, full-time, or part-time – tailored to your needs'
  },
  {
    icon: Globe2,
    title: 'Global Talent',
    description: 'Diverse team across time zones for round-the-clock development'
  },
  {
    icon: Brain,
    title: 'Specialized Skills',
    description: 'Expertise in cutting-edge technologies and industry best practices'
  }
];

const skills = [
  'Frontend Development',
  'Backend Engineering',
  'UI/UX Design',
  'DevOps & Cloud',
  'AI/ML Development',
  'Mobile Development',
  'QA & Testing',
  'Project Management'
];

export default function ITTeam() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="mb-32">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl p-16">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-brand-primary/30 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-brand-primary/20 rounded-full blur-[100px]" />

        <div className="relative z-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-brand-primary text-sm">Remote Tech Teams</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Build Your Dream Team with OonkoO
            </h2>
            <p className="text-white/70">
              Whether you need a complete development team or specialized experts, 
              we provide flexible staffing solutions that scale with your business needs.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Column - Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  >
                    <feature.icon className="w-8 h-8 text-brand-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Skills Tags */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Available Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm rounded-full bg-brand-primary/10 text-brand-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Image and CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-8">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                  alt="Remote Team Collaboration"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Engagement Models */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-primary" />
                  Flexible Engagement Models
                </h3>
                <div className="space-y-3">
                  {[
                    'Full-time dedicated teams',
                    'Project-based engagement',
                    'Hourly/Weekly contracts',
                    'Staff augmentation'
                  ].map((model) => (
                    <div key={model} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                      <span className="text-white/70">{model}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              {"Ready to build your dream team? Let's discuss how our expert developers can help accelerate your project development."}
            </p>
            <div className='flex justify-center w-full'>
              <HoverBorderGradient className='cursor-pointer' onClick={() => setIsModalOpen(true)}>
                <span className="flex items-center gap-2 py-5 px-5">
                  Build Your Team <ArrowRight className="w-4 h-4" />
                </span>
              </HoverBorderGradient>
            </div>
          </motion.div>
        </div>
      </div>

      <ContactModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        type="website"
        origin="Tech Team Inquiry"
      />
    </section>
  );
}