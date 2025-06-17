/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["i.ibb.co", "localhost"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // matches /api/anything
        destination: "http://localhost:5000/api/:path*", // rewrites to your backend
      },
    ];
  },
};

export default nextConfig;
