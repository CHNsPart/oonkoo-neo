// Path: components/pages/ProductCard.tsx

'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cursor } from '@/components/ui/cursor';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Tilt } from '@/components/ui/tilt';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    cursorImage: string;
    previewImage: string;
    company: string;
    category: string;
    tags: string[];
    link: string;
  };
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
    <div className="group w-full flex md:gap-6">
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
          className=""
        >
          <motion.div
            animate={{
              width: isHovering ? 300 : 20,
              height: isHovering ? 200 : 20,
            }}
            className="flex items-center justify-center rounded-2xl border-2 border-brand-primary/50 overflow-hidden"
          >
            <AnimatePresence>
              {isHovering && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="relative w-full h-full"
                  >
                    <span className='absolute z-50 w-full h-full flex justify-center items-center'>
                      <span className='text-black font-mono tracking-tighter bg-white px-4 py-2.5 rounded-full'>
                        Case Study
                      </span>
                    </span>
                    <Image
                      src={product.cursorImage}
                      alt={product.name}
                      fill
                      className="object-cover rounded-2xl"
                    />
                  </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Cursor>
      )}

      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="flex-1 flex flex-col justify-between bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden p-8 hover:bg-black/60 transition-all duration-300"
        onClick={() => window.location.href = product.link}
      >
        <div>
          {/* company and Category */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-white/70">🟢 {product.company}</span>
            <span className="text-sm text-white/70">•</span>
            <span className="text-sm text-white/70">{product.category}</span>
          </div>

          {/* Title and Description */}
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-3">{product.name}</h3>
            <p className="text-white/70">{product.description}</p>
          </div>
        </div>

        {/* Open Case Link */}
        <Link 
          href={product.link}
          className="inline-flex items-center text-sm text-white/90 hover:text-brand-primary transition-colors duration-200"
        >
          Open case
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </motion.div>

      {/* Right Card - Preview */}
      <Tilt
        rotationFactor={10}
        springOptions={{
          stiffness: 300,
          damping: 30
        }}
        className="h-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="hidden md:block w-[500px] h-auto aspect-[4/3] relative bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden flex-shrink-0"
        >
          <Image
            src={product.previewImage}
            alt={`Preview of ${product.name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
        </motion.div>
      </Tilt>
    </div>
  );
}