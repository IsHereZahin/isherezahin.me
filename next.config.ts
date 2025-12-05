import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Define allowed image qualities
    qualities: [75, 80, 90, 100],

    // Replace domains with remotePatterns
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
      }
    ],
  },
};

export default nextConfig;
