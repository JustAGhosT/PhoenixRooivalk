/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  images: {
    unoptimized: true, // Required for static exports
  },
  webpack: (config) => {
    // This ensures that the @ alias works in both development and production
    config.resolve.alias = {
      ...config.resolve.alias,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      "@": require("path").resolve(__dirname, "src"),
    };
    return config;
  },
  // Add any other Next.js configurations here
};

module.exports = nextConfig;
