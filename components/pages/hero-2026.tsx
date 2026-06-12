"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "motion/react";
import { Instrument_Serif } from "next/font/google";
import { HoverBorderGradient } from "@/components/ui/cta-button";
import { ArrowRight, ArrowDown, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ContactModal } from "@/components/ui/contact-modal";
import { usePreloader } from "@/components/providers/preloader-provider";

// Display accent font — single italic cut, tiny payload, pairs with Geist
const accentSerif = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
});

// ---- Content ----
const STATS = [
  { value: "98%", label: "Client Success Rate" },
  { value: "65+", label: "Projects Delivered" },
];

const TRUST_LOGOS = [
  { name: "GoodFirms", image: "/firms/goodfirms.jpeg", link: "https://www.goodfirms.co/company/oonkoo" },
  { name: "Google", image: "/firms/google.svg", link: "https://g.co/kgs/HGxQPWe" },
  { name: "Clutch", image: "/firms/clutch.jpeg", link: "https://clutch.co/profile/oonkoo" },
];

const CAPABILITIES = [
  "Product Engineering",
  "Product Design",
  "Growth & Intelligence",
  "Mobile Engineering",
  "Cloud & DevOps",
  "Commerce Systems",
  "Content & Visibility",
];

// Geist Mono is loaded globally as a CSS variable in app/layout.tsx
const mono = { fontFamily: "var(--font-geist-mono)" } as const;

const lineEase = [0.22, 1, 0.36, 1] as const;

export default function Hero2026() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hold the entrance choreography while the logo preloader covers the page;
  // it flips false as the loader starts fading, so the reveals overlap the fade.
  const { isPreloading } = usePreloader();

  // Mouse parallax — applied only to the aurora layer (transform-only, cheap)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(useTransform(mouseX, [-1, 1], [-24, 24]), { stiffness: 50, damping: 20 });
  const glowY = useSpring(useTransform(mouseY, [-1, 1], [-16, 16]), { stiffness: 50, damping: 20 });

  // Scroll-driven dissolve so the hero hands off elegantly to the page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const contentY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -110]), {
    stiffness: 80,
    damping: 24,
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

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
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-black"
    >
      {/* ============================ BACKGROUND ============================ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {/* Aurora — pre-faded radial gradients, drift on transform only */}
        <motion.div style={{ x: glowX, y: glowY }} className="absolute inset-0">
          <div className="hero26-aurora hero26-aurora-a" />
          <div className="hero26-aurora hero26-aurora-b" />
        </motion.div>

        {/* Blueprint column grid */}
        <div className="absolute inset-0 mx-auto hidden max-w-[1400px] px-6 md:block lg:px-10">
          <div className="grid h-full grid-cols-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-l border-white/[0.05] last:border-r" />
            ))}
          </div>
        </div>

        {/* Film grain */}
        <div className="hero26-grain absolute inset-0" />

        {/* Hand-off fade into the page below */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* ============================ CONTENT ============================ */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 pb-20 pt-36 lg:px-10"
      >
        {/* Crosshair detail */}
        <span
          aria-hidden="true"
          style={mono}
          className="absolute left-5 top-28 hidden select-none text-sm text-white/20 lg:block"
        >
          +
        </span>
        <span
          aria-hidden="true"
          style={mono}
          className="absolute bottom-8 right-9 hidden select-none text-sm text-white/20 lg:block"
        >
          +
        </span>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isPreloading ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: lineEase }}
          className="mb-8 flex items-center gap-3"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-primary" />
          </span>
          <span
            style={mono}
            className="text-xs uppercase tracking-[0.3em] text-brand-primary"
          >
            AI-Powered Software & Design Agency
          </span>
          <span className="h-px w-12 bg-gradient-to-r from-brand-primary/60 to-transparent" />
        </motion.div>

        {/* Headline — per-line mask reveals */}
        <h1 className="max-w-6xl text-[clamp(2.6rem,7.2vw,6.5rem)] font-bold leading-[0.98] tracking-tight text-white">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span
              initial={{ y: "112%" }}
              animate={isPreloading ? undefined : { y: "0%" }}
              transition={{ delay: 0.25, duration: 0.9, ease: lineEase }}
              className="block"
            >
              A smarter way to
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span
              initial={{ y: "112%" }}
              animate={isPreloading ? undefined : { y: "0%" }}
              transition={{ delay: 0.38, duration: 0.9, ease: lineEase }}
              className="block"
            >
              design, build &<br className="sm:hidden" /> maintain
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.14em]">
            <motion.span
              initial={{ y: "112%" }}
              animate={isPreloading ? undefined : { y: "0%" }}
              transition={{ delay: 0.51, duration: 0.9, ease: lineEase }}
              className="block"
            >
              <em
                className={`${accentSerif.className} bg-gradient-to-tr from-brand-primaryDark via-brand-primary to-brand-primaryLight bg-clip-text pr-[0.1em] font-normal text-transparent`}
              >
                software with AI.
              </em>
            </motion.span>
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isPreloading ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.8, ease: lineEase }}
          style={mono}
          className="mt-8 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base"
        >
          OonkoO pairs senior product designers and engineers with applied AI —
          taking your software from first wireframe to launch, and maintaining
          it long after.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isPreloading ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.8, ease: lineEase }}
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
              className="group flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-base text-white transition-colors duration-300 hover:border-brand-primary/50 hover:bg-white/[0.06]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary/15 transition-colors group-hover:bg-brand-primary/25">
                <Play className="h-3.5 w-3.5 fill-brand-primary text-brand-primary" />
              </span>
              View Our Work
            </motion.button>
          </Link>
        </motion.div>

        {/* Rotating badge / scroll cue */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={isPreloading ? undefined : { opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          aria-label="Scroll to explore"
          className="group absolute right-10 top-1/2 hidden h-28 w-28 -translate-y-1/2 items-center justify-center xl:flex"
        >
          <svg
            viewBox="0 0 120 120"
            className="absolute inset-0 h-full w-full animate-[spin_22s_linear_infinite] transition-opacity duration-300 group-hover:opacity-100 opacity-70"
          >
            <defs>
              <path
                id="hero26-circle"
                d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
              />
            </defs>
            <text
              style={mono}
              className="fill-white/50 text-[9px] uppercase"
              letterSpacing="3.2"
            >
              <textPath href="#hero26-circle">
                Oonkoo · Digital Studio · Scroll to Explore ·
              </textPath>
            </text>
          </svg>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-brand-primary/60">
            <ArrowDown className="h-4 w-4 text-brand-primary transition-transform duration-300 group-hover:translate-y-0.5" />
          </span>
        </motion.button>
      </motion.div>

      {/* ============================ TICKER ============================ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isPreloading ? undefined : { opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="relative z-10 overflow-hidden border-y border-white/[0.08] py-3.5"
      >
        <div className="hero26-marquee flex w-max items-center">
          {[...CAPABILITIES, ...CAPABILITIES].map((capability, i) => (
            <span
              key={i}
              aria-hidden={i >= CAPABILITIES.length}
              className="flex items-center whitespace-nowrap"
            >
              <span
                style={mono}
                className="text-xs uppercase tracking-[0.25em] text-white/40"
              >
                {capability}
              </span>
              <span className="mx-8 text-[10px] text-brand-primary/70">✦</span>
            </span>
          ))}
        </div>
      </motion.div>

      {/* ============================ BOTTOM BAR ============================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isPreloading ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10"
      >
        <div className="mx-auto max-w-[1400px] px-6 py-7 lg:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* Stats */}
            <div className="flex gap-x-10 gap-y-6 md:flex-wrap">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={i > 0 ? "border-l border-white/10 pl-10" : undefined}
                >
                  <div className="text-2xl font-bold text-white sm:text-4xl">
                    {stat.value}
                  </div>
                  <div
                    style={mono}
                    className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50"
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
                className="hidden text-xs uppercase tracking-[0.22em] text-white/40 sm:block"
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
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 transition-colors hover:border-brand-primary/40"
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
