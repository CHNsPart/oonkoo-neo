"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import FuzzyText from "@/components/FuzzyText";
import { HoverBorderGradient } from "@/components/ui/cta-button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Fuzzy 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <FuzzyText
            fontSize="clamp(6rem, 20vw, 14rem)"
            fontWeight={900}
            color="#3CB371"
            baseIntensity={0.15}
            hoverIntensity={0.6}
            enableHover={true}
            fuzzRange={25}
            direction="horizontal"
            glitchMode={true}
            glitchInterval={3000}
            glitchDuration={150}
          >
            404
          </FuzzyText>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
          className="mt-4 space-y-4"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Page Not Found
          </h1>
          <p className="text-white/50 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 20 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/">
            <HoverBorderGradient>
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </span>
            </HoverBorderGradient>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex items-center gap-3 text-white/30 text-sm"
        >
          <span className="w-12 h-px bg-white/20" />
          <span>Lost in the void</span>
          <span className="w-12 h-px bg-white/20" />
        </motion.div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-primary/30 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </main>
  );
}
