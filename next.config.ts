import type { NextConfig } from "next";

// Images uploaded through the admin dashboard are served from Supabase Storage's public URLs.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
  : null;

const nextConfig: NextConfig = {
  // Self-contained server for the Docker image (Dockerfile); hosts like Vercel ignore it.
  output: "standalone",
  compiler: {
    // Keep console.error so server failures (e.g. Supabase unreachable) still show up in logs.
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "@tabler/icons-react",
      "lucide-react",
    ],
  },
  images: {
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: supabaseUrl.protocol.replace(":", "") as "http" | "https",
            hostname: supabaseUrl.hostname,
            port: supabaseUrl.port,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    // The local Supabase stack runs on 127.0.0.1, which next/image blocks by default. Allowed only
    // when Supabase itself is local (dev server, or the Docker build in compose.yaml); a hosted
    // Supabase URL keeps the block on.
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV !== "production" ||
      ["127.0.0.1", "localhost"].includes(supabaseUrl?.hostname ?? ""),
  },
};

export default nextConfig;
