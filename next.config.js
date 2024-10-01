/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.gstatic.com', 'nextjs.org'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  output: 'standalone',
};

module.exports = {
  webpack: (config, { isServer }) => {
    config.experiments = { asyncWebAssembly: true, layers: true };
    config.optimization.nodeEnv = false;
    return config;
  },
}