import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las imágenes subidas en prod viven en Vercel Blob. Habilitamos que
    // next/image las optimice/sirva. El host real es un subdominio de
    // *.blob.vercel-storage.com (p. ej. <store>.public.blob.vercel-storage.com).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
