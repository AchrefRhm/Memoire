/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "i.ibb.co", // example image CDN
      "localhost", // local dev
      "k8s-threetie-mainlb-11c5700e30-1182053200.us-east-1.elb.amazonaws.com", // your AWS ALB domain
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // e.g. /api/users
        destination: "http://k8s-threetie-mainlb-11c5700e30-1182053200.us-east-1.elb.amazonaws.com/api/:path*", // rewrites to backend via ALB
      },
    ];
  },
};

export default nextConfig;
