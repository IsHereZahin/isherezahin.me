import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Compiler for automatic memoization (Next.js 16 stable)
  reactCompiler: true,

  // Enable React strict mode for better development practices
  reactStrictMode: true,

  // Optimize for production builds
  poweredByHeader: false,

  // Compress responses
  compress: true,

  // Generate ETags for caching
  generateEtags: true,

  // Image optimization configuration
  images: {
    // Use modern image formats
    formats: ["image/avif", "image/webp"],

    // Define allowed image qualities
    qualities: [75, 85, 95],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],

    // Image sizes for optimized loading
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimum cache TTL for optimized images (1 week)
    minimumCacheTTL: 604800,

    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.theodorusclarence.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "framerusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "isherezahin.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // Experimental features for performance
  experimental: {
    // Enable 'use cache' directive for Cache Components (Next.js 16)
    useCache: true,

    // Optimize package imports for smaller bundles
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "framer-motion",
      "recharts",
    ],
  },

  // Custom headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // NOTE: Do NOT set custom Cache-Control on /_next/static or /_next/image.
      // Next.js already applies correct immutable caching to hashed static assets
      // in production, and /_next/image caching is controlled by images.minimumCacheTTL.
      // Overriding them caches Turbopack's stable dev chunk URLs for a year, which
      // breaks HMR (the browser keeps serving stale JS/CSS until a hard reload).
    ];
  },
};

export default nextConfig;
