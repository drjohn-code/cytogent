import type { NextConfig } from "next";

// Canonical form: https://cytogent.com, apex, no trailing slash (BRIEF §2).
const nextConfig: NextConfig = {
  trailingSlash: false,
  // src/proxy.ts strips trailing slashes itself, so legacy URLs like /resources/ redirect in one hop.
  skipTrailingSlashRedirect: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
