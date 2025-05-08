"use client";

import { motion } from "framer-motion";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { HoverBorderGradient } from "@/components/ui/cta-button";

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

export default function AdminAuthPage() {

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Logo and Title */}
          <motion.div 
            variants={itemVariants}
            className="text-center mb-8"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <Image
                src="/oonkoo_logo.svg"
                alt="OonkoO Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Welcome
            </h1>
            <p className="text-white/70 text-lg">
              Sign in to access or create your projects
            </p>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            variants={itemVariants}
            className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 overflow-hidden"
          >
            <div className="relative z-10 flex flex-col justify-center items-center">
              <LoginLink postLoginRedirectURL="/dashboard">
                <HoverBorderGradient 
                  className="w-full text-base"
                >
                  <span className="flex items-center gap-2">
                    Sign In with Kinde 
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </HoverBorderGradient>
              </LoginLink>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/50">
                  Protected by OonkoO authentication system
                </p>
              </div>
            </div>

            {/* Card Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-brand-primary/20 blur-[100px] rounded-full" />
              <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-brand-primary/10 blur-[100px] rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}