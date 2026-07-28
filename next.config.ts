import type { NextConfig } from "next";

const legacyPages = ["default", "anasayfa", "books", "blogs", "contact", "product1", "login", "signup", "profile", "logout"];

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      { source: "/Default.aspx", destination: "/", permanent: true },
      { source: "/default.aspx", destination: "/", permanent: true },
      { source: "/anasayfa", destination: "/", permanent: true },
      ...legacyPages
        .filter((page) => !["default", "anasayfa"].includes(page))
        .flatMap((page) => [{ source: `/${page}.aspx`, destination: `/${page}`, permanent: true }]),
    ];
  },
};

export default nextConfig;
