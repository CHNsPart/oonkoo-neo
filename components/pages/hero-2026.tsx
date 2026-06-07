"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { FlutedGlass } from "@paper-design/shaders-react";
import { HoverBorderGradient } from "@/components/ui/cta-button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ContactModal } from "@/components/ui/contact-modal";

// ---- Content (copy refined for the 2026 / AI-forward positioning) ----
const STATS = [
  { value: "98%", label: "Client Success Rate" },
  { value: "65+", label: "Projects Delivered" },
];

const TRUST_LOGOS = [
  { name: "GoodFirms", image: "/firms/goodfirms.jpeg", link: "https://www.goodfirms.co/company/oonkoo" },
  { name: "Google", image: "/firms/google.svg", link: "https://g.co/kgs/HGxQPWe" },
  { name: "Clutch", image: "/firms/clutch.jpeg", link: "https://clutch.co/profile/oonkoo" },
];

// Geist Mono is loaded globally as a CSS variable in app/layout.tsx
const mono = { fontFamily: "var(--font-geist-mono)" } as const;

export default function Hero2026() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax for the atmospheric background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useSpring(useTransform(mouseX, [-1, 1], [-18, 18]), { stiffness: 60, damping: 20 });
  const bgY = useSpring(useTransform(mouseY, [-1, 1], [-12, 12]), { stiffness: 60, damping: 20 });

  // Scroll-driven fade so the hero dissolves elegantly into the page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const contentY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -120]), {
    stiffness: 80,
    damping: 24,
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouseX.set(((e.clientX - r.left) / r.width) * 2 - 1);
      mouseY.set(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100svh] w-full overflow-hidden bg-black"
    >
      {/* ============================ BACKGROUND ============================ */}
      <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-[-6%] z-0">
        {/* Reused hero video — the flowing 3D atmosphere */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/heros-3d.mp4" type="video/mp4" />
        </video>

        {/* Fluted-glass shader: animated ribbed texture over the video */}
        {mounted && (
          <FlutedGlass
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            className="opacity-[0.50]"
            colorBack="#00000000"
            colorShadow="#000000"
            colorHighlight="#ffffff"
            shadows={0.94}
            highlights={0.04}
            size={0.5}
            shape="wave"
            angle={146}
            distortionShape="flat"
            distortion={0.59}
            shift={0}
            stretch={0.33}
            blur={1}
            edges={0.11}
            margin={0}
            grainMixer={0.57}
            grainOverlay={0.84}
            scale={2.08}
            fit="cover"
            speed={0.4}
          />
        )}
      </motion.div>

      {/* Brand color grading + legibility scrims */}
      <div className="absolute inset-0 z-[1] bg-brand-primary/10 mix-blend-overlay" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-transparent via-black/20 to-black/10" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      {/* ============================ CONTENT ============================ */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-center px-6 pt-22 pb-44 lg:px-10"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-7 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-brand-primary/60" />
          <span
            style={mono}
            className="text-xs uppercase tracking-[0.28em] text-brand-primary"
          >
            AI-Powered Digital Studio
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.92] tracking-tight text-white"
        >
          Build the{" "}
          <br />
          <span className="bg-gradient-to-tr from-brand-primary/40 via-brand-primaryDark to-brand-primary bg-clip-text text-transparent">
            AI-Native
          </span>{" "}
          Future.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          style={mono}
          className="mt-8 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base"
        >
          We design and engineer AI-powered products, platforms, and brands
          pairing world-class craft with intelligence that drives measurable ROI
          for ambitious companies.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
        >
          <button onClick={() => setIsModalOpen(true)}>
            <HoverBorderGradient className="px-7 py-3.5 text-base">
              <span className="flex items-center gap-2.5">
                Start Your Project
                <ArrowRight className="h-5 w-5" />
              </span>
            </HoverBorderGradient>
          </button>

          <Link href="/case-studies">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-base text-white backdrop-blur-sm transition-colors duration-300 hover:border-brand-primary/50 hover:bg-white/[0.06]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary/15 transition-colors group-hover:bg-brand-primary/25">
                <Play className="h-3.5 w-3.5 fill-brand-primary text-brand-primary" />
              </span>
              View Our Work
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* ============================ BOTTOM BAR ============================ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute inset-x-0 bottom-0 z-20"
      >
        <div className="mx-auto max-w-[1400px] px-6 pb-8 lg:px-10">
          <div className="flex flex-col gap-8 border-t border-white/10 pt-7 lg:flex-row lg:items-end lg:justify-between">
            {/* Stats */}
            <div className="flex md:flex-wrap gap-x-10 gap-y-6">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-bold text-white sm:text-4xl">
                    {stat.value}
                  </div>
                  <div
                    style={mono}
                    className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50 sm:text-sm"
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Trusted by */}
            <div className="flex flex-col gap-3 lg:items-end">
              <span
                style={mono}
                className="hidden uppercase tracking-[0.22em] text-white/40 sm:block sm:text-sm"
              >
                Trusted by ambitious teams worldwide
              </span>
              <div className="flex items-center gap-3">
                {TRUST_LOGOS.map((logo) => (
                  <Link
                    key={logo.name}
                    href={logo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-sm transition-colors hover:border-brand-primary/40"
                  >
                    <span className="relative h-6 w-6 overflow-hidden rounded">
                      <Image src={logo.image} alt={logo.name} fill className="object-contain" />
                    </span>
                    <span className="text-sm font-medium text-white/70">{logo.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <ContactModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        type="Website"
        origin="Hero 2026 CTA"
      />
    </div>
  );
}
