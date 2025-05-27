"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { HoverBorderGradient } from "@/components/ui/cta-button";
import { ArrowRight, ChevronRight, Play, Zap, Globe, Users, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ContactModal } from "@/components/ui/contact-modal";
import Image from "next/image";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -300]));
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.5], [0, 10]));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left - rect.width / 2) / 25);
        mouseY.set((e.clientY - rect.top - rect.height / 2) / 25);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const trustBadges = [
    { 
      name: "GoodFirms", 
      rating: 4.9, 
      image: "/firms/goodfirms.jpeg",
      link: "https://www.goodfirms.co/company/oonkoo"
    },
    { 
      name: "Trustpilot", 
      rating: 4.8, 
      image: "/firms/trustpilot.webp",
      link: "https://trustpilot.com"
    },
    { 
      name: "Google", 
      rating: 4.9, 
      image: "/firms/google.svg",
      link: "https://g.co/kgs/HGxQPWe"
    },
    { 
      name: "Clutch", 
      rating: 5.0, 
      image: "/firms/clutch.jpeg",
      link: "https://clutch.co/profile/oonkoo"
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Primary floating orb */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y, rotateX }}
        className="relative z-10 min-h-screen"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* Left Side - Badge and Main Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Brand Badge */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
                  </span>
                </div>
                <span className="text-brand-primary font-medium tracking-wide uppercase text-sm">
                  OonkoO
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight text-white">
                  Your<br />
                  Journey<br />
                  To <span className="text-brand-primary">Digital</span><br />
                  Excellence.
                </h1>
                
                {/* Decorative Icon */}
                <div className="inline-block ml-4">
                  <Globe className="w-8 h-8 text-brand-primary" />
                </div>
              </div>

              {/* Copyright */}
              <div className="text-white/60 text-sm">
                OonkoO<br />
                Copyright©2025
              </div>
            </motion.div>

            {/* Right Side - Video Card */}
            <Link href="/case-studies">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative h-[400px] lg:h-[500px] bg-black/30 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden group cursor-pointer"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                >
                  <source src="/heros-3d.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Top Right Badge */}
                <div className="absolute top-4 right-4 bg-brand-primary rounded-lg p-2">
                  <ArrowRight className="w-5 h-5 text-black" />
                </div>

                {/* Service Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-brand-primary rounded-full text-black text-xs font-medium">
                    Website Design
                  </span>
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium border border-white/20">
                    Branding
                  </span>
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium border border-white/20">
                    Development
                  </span>
                </div>

                {/* Stats Badge */}
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                  <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="text-4xl font-black text-white mb-1">+65</div>
                    <div className="text-xs text-brand-primary font-medium uppercase tracking-wider">
                      Projects<br />
                      Delivered
                    </div>
                  </div>
                </div>

                {/* Bottom Description */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/80 text-sm leading-relaxed">
                    We thrive on the challenge of turning ideas into reality, blending 
                    cutting-edge technology with artistic flair to produce truly 
                    remarkable work from visually stunning designs to immersive 
                    interactive experiences.
                  </p>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Massive OONKOO Typography */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-[12rem] sm:text-[16rem] lg:text-[20rem] xl:text-[24rem] font-black leading-none tracking-tighter text-white/10 select-none pointer-events-none">
              OONKOO
            </h2>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-brand-primary rounded-3xl p-8 lg:p-12 relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGC0aXRoIGQ9Ik0xIDFIMzkiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-30" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Side */}
              <div className="flex items-center gap-6">
                {/* Logo placeholder */}
                <div className="w-16 h-16 rounded-full bg-black/20 flex items-center justify-center">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-4xl lg:text-5xl font-black text-black">
                    Digital Agency.
                  </h3>
                </div>
              </div>

              {/* Right Side - CTA */}
              <div className="flex items-center gap-4">
                <HoverBorderGradient>
                  <Link href="/client-portal" className="flex items-center gap-3">
                    <Zap className="w-5 h-5" />
                    Start Project
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </HoverBorderGradient>
                
                <Link href="/case-studies">
                  <button className="bg-black/20 text-black px-6 py-3 rounded-full font-medium hover:bg-black/30 transition-colors flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    View Cases
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Trust Badges - Subtle Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 bg-black/30 backdrop-blur-sm rounded-3xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
              <span className="text-sm text-white/70 uppercase tracking-wider">Verified on</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {trustBadges.map((badge, index) => (
                <Link key={badge.name} href={badge.link} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    className="flex flex-col items-center group cursor-pointer p-3 rounded-2xl hover:bg-brand-primary/5 transition-colors"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 group-hover:border-brand-primary/50 transition-colors mb-3">
                      <Image
                        src={badge.image}
                        alt={badge.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-white/80 mb-1">{badge.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-brand-primary text-brand-primary" />
                      <span className="text-xs text-white/70">{badge.rating}</span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Contact Modal */}
      <ContactModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        type="Website"
        origin="Hero CTA"
      />
    </div>
  );
}