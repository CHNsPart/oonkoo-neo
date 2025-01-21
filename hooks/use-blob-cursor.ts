"use client";

import { useEffect } from 'react';

export const useBlobCursor = () => {
  useEffect(() => {
    const blob = document.getElementById("cursor-blob");
    
    const handlePointerMove = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      
      blob?.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
      }, { duration: 3000, fill: "forwards" });
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);
};