'use client';

import { useEffect, useState } from 'react';
import MetallicPaint, { parseLogoImage } from './MetallicPaint';

interface MetallicPaintLogoProps {
  src: string;
  className?: string;
}

export default function MetallicPaintLogo({ src, className }: MetallicPaintLogoProps) {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImage() {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const file = new File([blob], 'logo.svg', { type: blob.type });
        const result = await parseLogoImage(file);
        setImageData(result.imageData);
      } catch (error) {
        console.error('Failed to load metallic paint image:', error);
      } finally {
        setLoading(false);
      }
    }

    loadImage();
  }, [src]);

  if (loading || !imageData) {
    return (
      <div className={`animate-pulse bg-white/5 rounded-full ${className}`} />
    );
  }

  return (
    <div className={className}>
      <MetallicPaint
        imageData={imageData}
        params={{
          patternScale: 2,
          refraction: 0.015,
          edge: 1,
          patternBlur: 0.005,
          liquid: 0.07,
          speed: 0.3
        }}
      />
    </div>
  );
}
