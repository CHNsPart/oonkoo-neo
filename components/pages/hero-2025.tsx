"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { HoverBorderGradient } from "@/components/ui/cta-button";
import { ArrowRight, Sparkles, ChevronRight, Play, Zap, Globe, Users, Star, TrendingUp } from "lucide-react";
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
      rating: 5.0, 
      image: "/firms/goodfirms.jpeg",
      link: "https://www.goodfirms.co/company/oonkoo"
    },
    // { 
    //   name: "Trustpilot", 
    //   rating: 4.8, 
    //   image: "/firms/trustpilot.webp",
    //   link: "https://trustpilot.com"
    // },
    { 
      name: "Google", 
      rating: 5.0, 
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
      className="relative min-h-screen pt-12 w-full overflow-hidden"
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
          
          {/* Dynamic Asymmetrical Grid */}
          <div className="grid grid-cols-12 gap-6 min-h-[80vh]">
            
            {/* Left Column - Main Content */}
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-center space-y-8">
              
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 w-fit"
              >
                <div className="relative">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
                  </span>
                </div>
                <span className="text-brand-primary font-medium tracking-wide uppercase text-sm">
                  Premium Digital Solutions
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.85] tracking-tight">
                  <span className="block text-white">Create</span>
                  <div className="flex items-center gap-4">
                    <span className="text-brand-primary">Beyond</span>
                  </div>
                  <span className="block text-white">Limits</span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="max-w-2xl space-y-6"
              >
                <p className="text-xl lg:text-2xl text-white/80 leading-relaxed">
                  We transform ambitious visions into 
                  <span className="text-brand-primary font-semibold"> exceptional digital experiences </span>
                  that deliver measurable ROI and elevate your brand presence.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 pt-6">
                  <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                    <TrendingUp className="w-4 h-4 text-brand-primary" />
                    <span className="text-white/80 text-sm font-medium">2.3M+ Revenue Generated</span>
                  </div>
                  <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                    <Users className="w-4 h-4 text-brand-primary" />
                    <span className="text-white/80 text-sm font-medium">98% Success Rate</span>
                  </div>
                </div>
              </motion.div>

              {/* Trust Badges Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col gap-6 pt-6"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                  <span className="text-sm text-white/70 uppercase tracking-wider">Verified on</span>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  {trustBadges.map((badge, index) => (
                    <Link key={badge.name} href={badge.link} target="_blank" rel="noopener noreferrer">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center gap-3 text-white/60 hover:text-brand-primary transition-colors cursor-pointer group"
                      >
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 group-hover:border-brand-primary/50 transition-colors">
                          <Image
                            src={badge.image}
                            alt={badge.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{badge.name}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-brand-primary text-brand-primary" />
                            <span className="text-xs text-white/70">{badge.rating}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-center sm:flex-row gap-4 pt-8"
              >
                <Link href="/client-portal">
                  <HoverBorderGradient className="text-lg px-8 py-4">
                    <span className="flex items-center gap-3">
                      <Zap className="w-5 h-5" />
                      Start Your Project
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </HoverBorderGradient>
                </Link>
                
                <Link href="/case-studies">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white hover:bg-white/10 hover:border-brand-primary/50 transition-all duration-300"
                  >
                    <Play className="w-5 h-5" />
                    Explore Case Studies
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Right Column - Interactive Elements */}
            <div className="col-span-12 lg:col-span-5 space-y-6 mt-12 lg:mt-0">

              {/* Large Feature Card */}
              <Link href="/case-studies">
                <motion.div
                  initial={{ opacity: 0, x: 100, rotateY: -15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.7, duration: 1 }}
                  whileHover={{ y: -15, rotateY: 5 }}
                  className="relative h-80 rounded-[2rem] overflow-hidden group cursor-pointer bg-black border border-white/10"
                >
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  >
                    <source src="/heros-3d.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  
                  {/* Floating stats inside video */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="absolute top-6 right-6 bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
                  >
                    <div className="text-3xl font-bold text-white mb-1">65+</div>
                    <div className="text-sm text-white/70">Projects</div>
                  </motion.div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-brand-primary" />
                      <span className="text-brand-primary font-medium">Global Reach</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Transformative Solutions</h3>
                    <p className="text-white/80 text-sm">Premium digital experiences that drive exceptional results</p>
                  </div>
                </motion.div>
              </Link>

              {/* Two smaller cards row */}
              <div className="grid grid-cols-2 gap-6">
                
                {/* About Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="relative p-6 rounded-3xl bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 backdrop-blur-sm border border-brand-primary/20 group cursor-pointer overflow-hidden h-48"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/20 rounded-full blur-xl group-hover:bg-brand-primary/40 transition-colors duration-500" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center mb-3">
                        <Sparkles className="w-5 h-5 text-brand-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">OonkoO</h3>
                      <p className="text-white/70 text-sm">Innovation-first digital agency</p>
                    </div>
                    <Link href="/about-us">
                      <button className="flex items-center gap-1 text-brand-primary hover:gap-2 transition-all text-sm font-medium">
                        Our Story <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </motion.div>

                {/* Quick Contact */}
                <motion.div
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 1.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  onClick={() => setIsModalOpen(true)}
                  className="relative p-6 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 group cursor-pointer overflow-hidden h-48"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 via-brand-primary/5 to-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-3">
                        <ArrowRight className="w-5 h-5 text-brand-primary" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">
                        {"Let's Talk"}
                      </h4>
                      <p className="text-white/70 text-sm">Ready to transform your vision?</p>
                    </div>
                    <div className="text-brand-primary text-sm font-medium">
                      Get Started →
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
      >
        <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-0.5 h-8 bg-gradient-to-b from-brand-primary to-transparent"
        />
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