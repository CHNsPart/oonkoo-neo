"use client";

import { useEffect } from 'react';

export function BlobCursor() {
  useEffect(() => {
    const blob = document.getElementById("blob");

    const handlePointerMove = (event: PointerEvent) => { 
      const { clientX, clientY } = event;
      
      blob?.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
      }, { 
        duration: 3000, 
        fill: "forwards",
        easing: "ease"
      });
    }

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <>
      <div id="blob" 
        style={{
          backgroundColor: 'white',
          height: '34vmax',
          aspectRatio: '1',
          position: 'fixed', // Changed from absolute to fixed
          left: '50%',
          top: '50%',
          translate: '-50% -50%',
          borderRadius: '50%',
          background: 'linear-gradient(to right, #3CB371, #000000)',
          animation: 'rotate 20s infinite',
          opacity: 0.8,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div id="blur" 
        style={{
          height: '100%',
          width: '100%',
          position: 'fixed', // Changed from absolute to fixed
          top: 0,
          left: 0,
          zIndex: 1,
          backdropFilter: 'blur(12vmax)',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}