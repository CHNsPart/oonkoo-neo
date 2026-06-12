'use client';

import { createContext, useContext } from 'react';

interface PreloaderContextValue {
  /** True while the full-screen logo preloader is covering the page. */
  isPreloading: boolean;
}

export const PreloaderContext = createContext<PreloaderContextValue>({
  isPreloading: false,
});

/**
 * Lets below-the-loader content (e.g. the hero) delay its entrance
 * choreography until the preloader starts fading out. Defaults to
 * `isPreloading: false` outside the provider, so consumers animate
 * immediately on pages without a preloader.
 */
export function usePreloader() {
  return useContext(PreloaderContext);
}
