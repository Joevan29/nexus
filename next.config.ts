import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  
  experimental: {
    // serverActions: true, // Next 14+ sudah default true, tapi aman dihapus di v16
  }
};

export default nextConfig;