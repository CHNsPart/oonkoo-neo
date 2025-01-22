// Path: components/pages/cards/ReviewCard.tsx

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface ReviewCardProps {
  review: {
    id: number;
    name: string;
    position: string;
    image: string;
    review: string;
    rating: number;
  };
  index: number;
  style?: React.CSSProperties;
}

export function ReviewCard({ review, index, style }: ReviewCardProps) {
  // Use useMemo to ensure consistent rotation value
  const rotation = useMemo(() => {
    // Use a deterministic value based on index instead of random
    const rotations = [2, -3, 1, -2, 3];
    return rotations[index % rotations.length];
  }, [index]);

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 100, 
        rotate: rotation 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        rotate: rotation,
        transition: {
          type: "spring",
          stiffness: 50,
          damping: 20,
          delay: index * 0.15
        }
      }}
      whileHover={{ 
        scale: 1.02,
        rotate: 0,
        zIndex: 10,
        transition: { duration: 0.2 }
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="absolute"
      style={style}
    >
      <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 w-[320px]">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={review.image}
              alt={review.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium text-white/90">{review.name}</h4>
            <p className="text-sm text-white/60">{review.position}</p>
          </div>
        </div>

        {/* Review Text */}
        <p className="text-base text-white/80 mb-4">
          {`"${review.review}"`}
        </p>

        {/* Rating */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < review.rating ? 'fill-brand-primary text-brand-primary' : 'text-white/20'
              )}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}