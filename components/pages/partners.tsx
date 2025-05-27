"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import Image from "next/image";
import { motion } from "framer-motion";

// Partner logos array with their paths
const partners = [
  { src: "/partners/COMPENDIUM.svg", alt: "COMPENDIUM" },
  { src: "/partners/glauco-sheild.svg", alt: "glauco-sheild.ai" },
  { src: "/partners/op.svg", alt: "Ontario Pulse" },
  { src: "/partners/oa.svg", alt: "Omni Attention" },
  { src: "/partners/rp.svg", alt: "Red Planet Empire" },
  { src: "/partners/lienzo.svg", alt: "Lienzo" },
  { src: "/partners/kolom.svg", alt: "Kolom.ai" },
  { src: "/partners/www.svg", alt: "Who Works When" },
  { src: "/partners/cg.png", alt: "City Group" },
  { src: "/partners/ss.png", alt: "Stay Score" },
  { src: "/partners/booring.png", alt: "The Booring Platform" },
  { src: "/partners/full_logo_white.png", alt: "AD-IQ" },
  { src: "/partners/glo.png", alt: "Glo" },
  { src: "/partners/banbase.png", alt: "Banbase" },
];

export default function Partners() {
  return (
    <section className="w-full pt-24 md:pt-32 relative z-[1] overflow-hidden">
      <span className="px-4 py-2 rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary mb-6 font-medium block mx-auto w-fit">
        Some of our prestigious clients
      </span>
      <section className="w-full">
        <div className="mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <InfiniteSlider 
              duration={30} 
              durationOnHover={0}
              className="w-full py-4"
            >
              {partners.map((partner, index) => (
                <div 
                  key={index}
                  className="relative flex items-center justify-center min-w-[200px] h-24 px-8 group"
                >
                  <div className="relative w-full h-full transition-all duration-300 filter grayscale hover:grayscale-0 hover:scale-110">
                    <div className="relative w-32 h-16">
                      <Image
                        src={partner.src}
                        alt={partner.alt}
                        fill
                        className="object-contain"
                        quality={100}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteSlider>
          </motion.div>
        </div>
      </section>
    </section>
  );
}