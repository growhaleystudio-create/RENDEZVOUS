const CMS_URL = process.env.CMS_URL || 'https://rendezvous-cms.vercel.app';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/dashboard',
        destination: `${CMS_URL}/dashboard`,
      },
      {
        source: '/dashboard/:path*',
        destination: `${CMS_URL}/dashboard/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/dasborad',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/dasborad/:path*',
        destination: '/dashboard/:path*',
        permanent: true,
      },
      {
        source: '/dasboard',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/dasboard/:path*',
        destination: '/dashboard/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
