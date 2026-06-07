"use client";

import { LogoCarousel, type Logo } from "@/components/ui/logo-carousel";
import Image from "next/image";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

// Create image-based logo components for partners
const createImageLogo = (src: string, alt: string): React.ComponentType<{ className?: string }> => {
  const ImageLogo = ({ className }: { className?: string }) => (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        quality={100}
      />
    </div>
  );
  ImageLogo.displayName = alt;
  return ImageLogo;
};

// Partner logos as components
const partnerLogos: Logo[] = [
  { name: "COMPENDIUM", id: 1, img: createImageLogo("/partners/COMPENDIUM.svg", "COMPENDIUM") },
  { name: "Glauco Shield", id: 2, img: createImageLogo("/partners/glauco-sheild.svg", "Glauco Shield") },
  { name: "Ontario Pulse", id: 3, img: createImageLogo("/partners/op.svg", "Ontario Pulse") },
  { name: "Omni Attention", id: 4, img: createImageLogo("/partners/oa.svg", "Omni Attention") },
  { name: "Stay Score", id: 5, img: createImageLogo("/partners/ss.png", "Stay Score") },
  { name: "Red Planet Empire", id: 10, img: createImageLogo("/partners/rp.svg", "Red Planet Empire") },
  { name: "Lienzo", id: 6, img: createImageLogo("/partners/lienzo.svg", "Lienzo") },
  { name: "Kolom.ai", id: 7, img: createImageLogo("/partners/kolom.svg", "Kolom.ai") },
  { name: "Who Works When", id: 8, img: createImageLogo("/partners/www.svg", "Who Works When") },
  { name: "City Group", id: 9, img: createImageLogo("/partners/cg.png", "City Group") },
  { name: "The Booring Platform", id: 11, img: createImageLogo("/partners/booring.png", "The Booring Platform") },
  { name: "AD-IQ", id: 12, img: createImageLogo("/partners/full_logo_white.png", "AD-IQ") },
  { name: "Glo", id: 13, img: createImageLogo("/partners/glo.png", "Glo") },
  { name: "Banbase", id: 14, img: createImageLogo("/partners/banbase.png", "Banbase") },
  { name: "Taqneo", id: 15, img: createImageLogo("/partners/taqneo.svg", "Taqneo") },
];

export default function Partners() {
  // Responsive column count: 2 on mobile, 3 on tablet, 5 on desktop
  const [columnCount, setColumnCount] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 768) setColumnCount(6);
      else if (width < 1024) setColumnCount(3);
      else setColumnCount(5);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  return (
    <section className="w-full pt-24 md:pt-32 relative z-[1] overflow-hidden">
      <span className="px-4 py-2 rounded-full bg-brand-primaryLight/5 border border-white/10 text-sm text-brand-primary mb-12 font-medium block mx-auto w-fit">
        Some of our prestigious clients & ventures
      </span>
      <section className="w-full">
        <div className="mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 2.2, duration: 3 }}
            className="w-full flex justify-center"
          >
            <LogoCarousel
              columnCount={columnCount}
              logos={partnerLogos}
              className="grid grid-cols-2 gap-4 justify-items-center md:flex md:gap-4 md:justify-center"
            />
          </motion.div>
        </div>
      </section>
    </section>
  );
}