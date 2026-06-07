import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  // SVGR — import *.svg as React components (Turbopack / dev).
  // Use `import url from './x.svg?url'` when you need the file URL instead.
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  // SVGR — import *.svg as React components (Webpack / production build).
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (rule: any) => rule?.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Keep *.svg?url working as a URL import
      { ...fileLoaderRule, test: /\.svg$/i, resourceQuery: /url/ },
      // Convert all other *.svg imports into React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ["@svgr/webpack"],
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
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
