import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      '127.0.0.1',
      'www.jcprola.com',
      'img.freepik.com',
      'www.softgenix.space',
      'softgenix.space', // ✅ Agrega este
    ],
  },
};

export default nextConfig;
