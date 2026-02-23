import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8090",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8091",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8092",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8090",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8091",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8092",
      },
      {
        protocol: "http",
        hostname: "178.18.245.174",
      },
      {
        protocol: "https",
        hostname: "api.ruhshonatort.com",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
