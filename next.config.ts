import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Linting runs separately (`npm run lint`); Next 15's build-time ESLint
  // integration doesn't detect the ESLint 9 flat config, so skip it here.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',  // Allows all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**',  // Allows all HTTP domains
      }
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "media-src 'self' * data: blob:; img-src 'self' * data: blob:;"
          }
        ],
      },
    ];
  }
};

export default nextConfig;
