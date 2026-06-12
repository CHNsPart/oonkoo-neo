'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import LoadingScreen from '../loader/loading-screen';
import { PreloaderContext } from '../providers/preloader-provider';

interface LoaderWrapperProps {
  children: React.ReactNode;
}

const LoaderWrapper = ({ children }: LoaderWrapperProps) => {
  const pathname = usePathname();

  // Decided synchronously so the preloader is part of the server-rendered
  // HTML (no post-hydration pop-in). It runs only for the initial document
  // load on the home page — client-side navigations never re-trigger it.
  const [isPreloading, setIsPreloading] = useState(() => pathname === '/');
  const [mountLoader, setMountLoader] = useState(isPreloading);

  return (
    <PreloaderContext.Provider value={{ isPreloading }}>
      {mountLoader && (
        <LoadingScreen
          // Flip as the fade-out starts so the hero entrance overlaps the
          // fade instead of waiting behind it.
          onFadeStart={() => setIsPreloading(false)}
          onDone={() => setMountLoader(false)}
        />
      )}
      <main className="w-full">
        {children}
      </main>
    </PreloaderContext.Provider>
  );
};

export default LoaderWrapper;
