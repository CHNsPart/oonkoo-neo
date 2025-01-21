"use client"

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Tilt } from '@/components/ui/tilt';

interface ProductPageCardProps {
  coverImage: string;
  title: string;
  category: string;
  onClick: () => void;
  isSelected: boolean;
}

export function ProductPageCard({ 
  coverImage, 
  title, 
  category,
  onClick,
  isSelected
}: ProductPageCardProps) {
  return (
    <Tilt
      rotationFactor={15}
      springOptions={{
        stiffness: 300,
        damping: 30
      }}
      className='p-2'
    >
      <motion.div
        onClick={onClick}
        className={`relative w-[300px] h-[200px] rounded-3xl overflow-hidden cursor-pointer group ${
          isSelected ? 'ring-2 ring-brand-primary' : 'border border-white/10'
        }`}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        {/* Image */}
        <div className="relative w-full h-full">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-black/40 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-brand-primary mb-2">{category}</p>
              <h3 className="text-xl font-semibold text-white group-hover:text-brand-primary transition-colors">
                {title}
              </h3>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-brand-primary/20 p-2 rounded-full"
            >
              <ArrowUpRight className="w-5 h-5 text-brand-primary" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
}