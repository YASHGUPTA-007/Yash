/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["assets.aceternity.com"], // your image host
  },
  typescript: {
    ignoreBuildErrors: true, // skips all TypeScript errors during build
  },
};

export default nextConfig;
