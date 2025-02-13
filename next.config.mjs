/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amicable-chameleon-487.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "dutiful-rook-363.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
