import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  eslint: {
    // Lint is a separate step (`npm run lint`) rather than a build blocker.
    // The remaining findings are stylistic: no-explicit-any, unused vars,
    // unescaped entities.
    ignoreDuringBuilds: true,
  },
  // Barrel-file imports from these pull far more into each route chunk than the
  // handful of symbols actually used.
  experimental: {
    optimizePackageImports: ["framer-motion", "date-fns", "lucide-react"],
  },
};

export default nextConfig;
