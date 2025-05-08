"use client";

import { motion } from "framer-motion";
import { HoverBorderGradient } from "@/components/ui/cta-button";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ContactModal } from "@/components/ui/contact-modal";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 pb-8 pt-20 sm:pt-24 z-[1]">
      <div className="h-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        {/* Main Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-3 bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-center"
        >
          <span className="px-4 py-2 w-fit rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary font-medium mb-6 block">
            Digital Excellence
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Bring your<br className="hidden sm:block" />
            vision to life.<br className="hidden sm:block" />
            <span className="text-brand-primary">Right here.</span>
          </h1>
          <p className="text-white/70 mb-6 sm:mb-8 max-w-md text-base sm:text-lg">
            We create stunning digital experiences that captivate your audience and drive results.
          </p>
          <Link className="w-fit" href={"/client-portal"}>
            <HoverBorderGradient className="inline-block w-full sm:w-auto">
              <span className="flex items-center justify-center sm:justify-start gap-2">
                Start Project <ArrowRight className="w-4 h-4" />
              </span>
            </HoverBorderGradient>
          </Link>
        </motion.div>

        {/* About Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full h-full relative bg-gradient-to-br from-brand-primary/20 to-black/40 backdrop-blur-sm p-6 rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between"
        >
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-full bg-brand-primary/20 backdrop-blur-sm flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-brand-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{"We're OonkoO"}</h3>
            <p className="text-sm text-white/70">Founded with a passion for digital excellence</p>
          </div>
          <Link href={"/about-us"}>
            <button className="text-sm text-white/90 flex items-center gap-1 hover:gap-2 transition-all mt-4">
              Learn our story <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>

        {/* Video Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full h-full col-span-1 min-h-64 lg:col-span-2 relative bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden group"
        >
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-125 transition-transform duration-700"
          >
            <source src="/heros-3d.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-xl font-semibold mb-2">Innovation First</h3>
            <p className="text-sm text-white/70">Pushing boundaries in digital design</p>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full h-full bg-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-white/10 flex items-center"
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full">
            <div>
              <h4 className="text-3xl sm:text-4xl font-bold text-brand-primary">65+</h4>
              <p className="text-xs sm:text-sm text-white/70">Projects Completed</p>
            </div>
            <div>
              <h4 className="text-3xl sm:text-4xl font-bold text-brand-primary">98%</h4>
              <p className="text-xs sm:text-sm text-white/70">Client Satisfaction</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full h-full col-span-1 lg:col-span-2 bg-gradient-to-r from-brand-primary/20 to-black/40 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0"
        >
          <div>
            <h3 className="text-xl font-semibold mb-2 text-center sm:text-left">Ready to start?</h3>
            <p className="text-white/70 text-center sm:text-left">{"Let's create something extraordinary together"}</p>
          </div>
          <div onClick={() => setIsModalOpen(true)}>
            <HoverBorderGradient className="w-full sm:w-auto">
              <ContactModal 
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                type="Website"
                origin="Hero CTA"
              />
              <span className="flex justify-center">Contact Us</span>
            </HoverBorderGradient>
          </div>
        </motion.div>

        {/* Background Gradients */}
        <div className="absolute -z-10 inset-0">
          <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-brand-primary/10 rounded-full blur-[90px]" />
        </div>
      </div>
    </div>
  );
}