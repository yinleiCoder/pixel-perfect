/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amicable-chameleon-487.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
