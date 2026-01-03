"use client";

import { motion } from "framer-motion";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  Code2,
  Users,
  Wrench,
  Rocket,
  Building2,
  HeartHandshake,
  Zap
} from "lucide-react";
import { HoverBorderGradient } from "@/components/ui/cta-button";
import dynamic from "next/dynamic";

// Dynamically import CircularGallery to avoid SSR issues with OGL
const CircularGallery = dynamic(() => import("@/components/CircularGallery"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-b from-brand-primary/5 to-transparent animate-pulse" />
  ),
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

// Case study gallery items
const galleryItems = [
  { image: "/case-studies/ad-iq.png", text: "AD-IQ Platform" },
  { image: "/case-studies/lienzo.png", text: "Lienzo Design" },
  { image: "/case-studies/op.png", text: "Ontario Pulse" },
  { image: "/case-studies/www.png", text: "Who Works When" },
  { image: "/case-studies/medicalprone.png", text: "Medical Prone" },
  { image: "/case-studies/ad-iq-app.jpg", text: "AD-IQ Mobile" },
];

// Services we offer
const services = [
  {
    icon: Code2,
    title: "Custom Development",
    description: "Full-stack web & mobile apps tailored to your vision"
  },
  {
    icon: Wrench,
    title: "App Maintenance",
    description: "24/7 support & continuous improvements for your software"
  },
  {
    icon: Users,
    title: "Team Augmentation",
    description: "Hire dedicated developers to scale your in-house team"
  },
  {
    icon: Building2,
    title: "Tech Recruitment",
    description: "Find top-tier developers for permanent positions"
  },
];

// Trust indicators
const trustIndicators = [
  "Enterprise-grade security",
  "Dedicated project manager",
  "Transparent pricing"
];

export default function ClientPortalPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen relative z-10">

        {/* Left Column - Gallery & Branding */}
        <div className="lg:w-1/2 relative flex flex-col">
          {/* Gallery Section */}
          <div className="h-[280px] lg:h-[50vh] relative">
            <CircularGallery
              items={galleryItems}
              bend={2}
              textColor="#3CB371"
              borderRadius={0.08}
              font="bold 24px Figtree"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Branding & Value Props */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image
                    src="/oonkoo_logo.svg"
                    alt="OonkoO"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">OonkoO</h2>
                  <p className="text-white/60 text-xs">Digital Excellence Partner</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight">
                  We Build <span className="text-brand-primary">Premium</span> Digital Products
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  From startups to enterprises, we transform ideas into powerful software solutions.
                  Join 65+ satisfied clients who trust us with their digital presence.
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-2 gap-3">
                {services.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="group p-3 rounded-xl bg-white/5 border border-white/10 hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all duration-300"
                  >
                    <service.icon className="w-5 h-5 text-brand-primary mb-1 group-hover:scale-110 transition-transform" />
                    <h4 className="font-semibold text-white text-xs">{service.title}</h4>
                    <p className="text-white/50 text-[10px] mt-0.5 leading-tight">{service.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Auth & CTA */}
        <div className="lg:w-1/2 flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-black via-black to-brand-primary/5">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            {/* Welcome Header */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-4">
                <Shield className="w-3 h-3 text-brand-primary" />
                <span className="text-brand-primary text-xs font-medium">Secure Client Portal</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                Client Portal
              </h1>
              <p className="text-white/70 text-sm">
                Submit project details, track progress, and collaborate with your dedicated team.
              </p>
            </motion.div>

            {/* Auth Card */}
            <motion.div
              variants={itemVariants}
              className="relative bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-hidden"
            >
              <div className="relative z-10 space-y-4">
                {/* What you get section */}
                {/* <div className="space-y-2">
                  <p className="text-white/80 font-medium text-xs uppercase tracking-wider">
                    Portal Access Includes
                  </p>
                  <div className="space-y-1.5">
                    {[
                      "Submit & manage project requests",
                      "Real-time project tracking dashboard",
                      "Direct communication with your team",
                      "Access to invoices & contracts"
                    ].map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-3 h-3 text-brand-primary flex-shrink-0" />
                        <span className="text-white/70 text-xs">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div> */}

                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3">
                  <LoginLink postLoginRedirectURL="/dashboard" className="block w-full">
                    <HoverBorderGradient
                      containerClassName="w-full"
                      className="w-full text-sm py-3 flex items-center justify-center"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Rocket className="w-4 h-4" />
                        Access Your Dashboard
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </HoverBorderGradient>
                  </LoginLink>

                  <LoginLink postLoginRedirectURL="/dashboard" className="block w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-6 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>New Client? Start Here</span>
                    </motion.button>
                  </LoginLink>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {trustIndicators.map((indicator) => (
                    <span
                      key={indicator}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-[10px]"
                    >
                      <Zap className="w-2.5 h-2.5 text-brand-primary" />
                      {indicator}
                    </span>
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-[10px] text-white/40">
                    Powered by <span className="text-brand-primary">Kinde</span> Authentication
                  </p>
                </div>
              </div>

              {/* Card Background Effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-brand-primary/10 blur-[100px] rounded-full" />
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-brand-primary/5 blur-[100px] rounded-full" />
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-5 grid grid-cols-3 gap-3"
            >
              {[
                { value: "65+", label: "Projects" },
                { value: "98%", label: "Success Rate" },
                { value: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-bold text-brand-primary">{stat.value}</div>
                  <div className="text-white/50 text-[10px]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
