'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LoadingScreen from '../loader/loading-screen';

interface LoaderWrapperProps {
  children: React.ReactNode;
}

const LoaderWrapper = ({ children }: LoaderWrapperProps) => {
  const [showLoader, setShowLoader] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show loader only on home page
    if (pathname === '/') {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, [pathname]);

  return (
    <>
      {showLoader && <LoadingScreen />}
      <main className="w-full">
        {children}
      </main>
    </>
  );
};

export default LoaderWrapper;