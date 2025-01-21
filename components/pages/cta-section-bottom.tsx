// Path: components/pages/cta-section-bottom.tsx

'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Globe2, Cloud } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/cta-button';
import { InfiniteSlider } from '../ui/infinite-slider';
import { Tilt } from '../ui/tilt';
import Link from 'next/link';

const stats = [
  { 
    label: 'Projects Delivered', 
    value: '65+',
    icon: Globe2,
    description: 'Successful projects worldwide'
  },
  { 
    label: 'Client Satisfaction', 
    value: '98%',
    icon: Star,
    description: 'Happy clients and counting'
  },
  { 
    label: 'Years Experience', 
    value: '6+',
    icon: Sparkles,
    description: 'Extensive industry expertise'
  },
  { 
    label: 'Team Members', 
    value: '25+',
    icon: Cloud,
    description: 'Skilled industry professionals'
  }
];

const services = [
  {
    title: 'Web Apps',
    description: 'Next.js & React',
    video: 'https://cdn.pixabay.com/video/2016/09/05/4941-181472380_tiny.mp4'
  },
  {
    title: 'Mobile Apps',
    description: 'iOS & Android',
    video: 'https://cdn.pixabay.com/video/2023/06/30/169445-841382824_tiny.mp4'
  },
  {
    title: 'UI/UX Design',
    description: 'User-centered design',
    video: 'https://cdn.pixabay.com/video/2020/10/19/52823-471089056_tiny.mp4'
  },
  {
    title: 'Branding',
    description: 'Identity & Strategy',
    video: 'https://cdn.pixabay.com/video/2019/06/17/24497-344562750_tiny.mp4'
  },
  {
    title: 'AI Solutions',
    description: 'ML & Analytics',
    video: 'https://cdn.pixabay.com/video/2020/08/21/47802-451812879_tiny.mp4'
  },
  {
    title: 'Cloud Native',
    description: 'AWS & Azure',
    video: 'https://cdn.pixabay.com/video/2023/10/10/184489-873483996_tiny.mp4'
  },
  {
    title: 'E-Commerce',
    description: 'Online Stores',
    video: 'https://cdn.pixabay.com/video/2024/11/19/242111_tiny.mp4'
  },
  {
    title: 'AR/VR',
    description: 'Immersive Tech',
    video: 'https://cdn.pixabay.com/video/2017/01/12/7249-199191048_tiny.mp4'
  }
];

export default function CTABottom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: false });

  // Scroll driven animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Video animations with spring physics for smoother transitions
  const springConfig = { stiffness: 100, damping: 30, mass: 0.5 };

  // Main video animations
  const mainVideoWidth = useTransform(scrollYProgress, [0.3, 0.5], ["80%", "100%"]);
  const mainVideoBorderRadius = useTransform(scrollYProgress, [0.1, 0.5], ["500px", "0px"]);
  const mainVideoScale = useSpring(
    useTransform(scrollYProgress, [0.3, 0.5], [0.9, 1]),
    springConfig
  );

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Services scroll with spring physics
  const servicesX = useSpring(
    useTransform(scrollYProgress, [0.3, 0.8], [0, -1200]),
    springConfig
  );


  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden pt-16 sm:pt-24 lg:pt-32 z-[1]"
    >
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Main content container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={textRef}
          style={{ y, scale, opacity }}
          className="text-center"
        >
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <span className="px-4 py-2 rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium">
              {"Let's Create Together"}
            </span>
          </motion.div>

          {/* Header */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6"
          >
            Ready to Transform
            <br />
            Your Digital Presence?
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/70 mb-12 max-w-2xl mx-auto"
          >
            Join the ranks of businesses that have revolutionized their online presence with our cutting-edge solutions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <Link href={"/pricing"}>
              <HoverBorderGradient className="w-full sm:w-auto">
                <span className="flex items-center justify-center gap-2">
                  Start Your Project <ArrowRight className="w-4 h-4" />
                </span>
              </HoverBorderGradient>
            </Link>
            <Link href={"/products"}>
              <HoverBorderGradient className="w-full sm:w-auto">
                View Our Work
              </HoverBorderGradient>
            </Link>
          </motion.div>

          {/* Video Section */}
          <motion.div
            ref={videoRef}
            style={{ 
              width: mainVideoWidth,
              borderRadius: mainVideoBorderRadius,
              scale: mainVideoScale
            }}
            className="relative mx-auto overflow-hidden mb-20 aspect-video"
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://cdn.pixabay.com/video/2022/06/21/121535-724710039_tiny.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <Tilt
                key={stat.label}
                rotationFactor={10}
                springOptions={{
                  stiffness: 300,
                  damping: 30
                }}
                className="h-full"
              >
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 * index }}
                className="group bg-black/20 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 border border-white/10 hover:border-brand-primary/50 transition-colors duration-300"
              >
                <div className="size-12 rounded-xl bg-brand-primary/20 flex items-center justify-center mb-4 group-hover:bg-brand-primary/30 transition-colors duration-300">
                  {React.createElement(stat.icon, { className: "w-6 h-6 text-brand-primary" })}
                </div>
                <div className="font-bold text-4xl text-brand-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-white/70 font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-white/40">{stat.description}</div>
              </motion.div>
              </Tilt>
            ))}
          </div>

          {/* Enhanced Services Scroll */}
          <div className="">
            <InfiniteSlider 
              duration={30} 
              durationOnHover={0}
              className="w-full py-4"
            >
              <motion.div 
                style={{ x: servicesX }}
                className="flex gap-6 mb-20 w-max px-4"
              >
                {services.map((service) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, margin: "-100px" }}
                    className="relative w-[300px] h-[400px] rounded-[30px] overflow-hidden group cursor-pointer"
                  >
                    <Link href={"/pricing"}>
                      {/* Video Background */}
                      <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                      >
                        <source src={service.video} type="video/mp4" />
                      </video>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
                      
                      {/* Content */}
                      <div className="absolute inset-0 p-8 flex flex-col justify-end items-start transform group-hover:translate-y-[-10px] transition-transform duration-500">
                        <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-brand-primary transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-white/70 text-sm mb-4 transform">
                          {service.description}
                        </p>
                        
                        {/* Learn More Text */}
                        <div className="flex items-center gap-2 text-sm text-white/90 group-hover:text-brand-primary transition-colors duration-300">
                          Explore <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </InfiniteSlider>
          </div>
        </motion.div>
      </div>
    </section>
  );
}