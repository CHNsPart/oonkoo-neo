// Path: components/pages/ServiceCard.tsx

'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cursor } from '@/components/ui/cursor';
import { ArrowRight } from 'lucide-react';
import { Tilt } from '@/components/ui/tilt';
import Link from 'next/link';

export function ServiceCard({ service, index }: {
  service: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    title: string;
    description: string;
    technologies: string[];
    video?: string;
  };
  index: number;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = service.icon;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePositionChange = (x: number, y: number) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const isInside = 
        x >= rect.left && 
        x <= rect.right && 
        y >= rect.top && 
        y <= rect.bottom;
      setIsHovering(isInside);
    }
  };

  return (
    <div className="relative h-full">
      {isMounted && (
        <Cursor
          attachToParent
          variants={{
            initial: { scale: 0.3, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.3, opacity: 0 },
          }}
          springConfig={{
            bounce: 0.001,
            damping: 20,
            stiffness: 300
          }}
          transition={{
            ease: 'easeInOut',
            duration: 0.15,
          }}
          onPositionChange={handlePositionChange}
          className="mix-blend-difference"
        >
          <motion.div
            animate={{
              width: isHovering ? 120 : 20,
              height: isHovering ? 40 : 20,
            }}
            className="flex items-center justify-center rounded-full bg-brand-primary"
          >
            <AnimatePresence>
              {isHovering && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="inline-flex w-full items-center justify-center"
                >
                  <span className="inline-flex items-center text-sm text-black font-medium">
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Cursor>
      )}

      <Link href={"/pricing"} className='cursor-none'>
        <Tilt
          rotationFactor={10}
          springOptions={{
            stiffness: 300,
            damping: 30
          }}
          className="h-full"
        >
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            animate={{
              borderColor: isHovering
                ? 'rgba(60, 179, 113, 0.4)'
                : 'rgba(255, 255, 255, 0.1)',
            }}
            className="relative h-full bg-black/40 backdrop-blur-sm rounded-3xl border overflow-hidden p-8 flex flex-col"
          >
            {/* Subtle video backdrop on hover */}
            {isMounted && service.video && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={false}
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <video
                  src={service.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover opacity-25"
                />
                {/* Brand tint + legibility scrim */}
                <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
              </motion.div>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
              <Icon size={56} className="mb-6 size-14" />

              <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
              <p className="text-white/70 mb-6">{service.description}</p>

              <div className="mt-auto">
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-sm px-3 py-1 rounded-full bg-white/5 text-white/70 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </Tilt>
      </Link>
    </div>
  );
}