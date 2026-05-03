import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nodeModules = path.join(configDir, "node_modules");

const webpackResolveAliases: Record<string, string> = {
  tailwindcss: path.join(nodeModules, "tailwindcss"),
  "tw-animate-css": path.join(nodeModules, "tw-animate-css"),
  "shadcn/tailwind.css": path.join(nodeModules, "shadcn/dist/tailwind.css"),
};

const nextConfig: NextConfig = {
  // Turbopack: lock project root when parent lockfiles confuse discovery.
  // Note: Tailwind `@import "tailwindcss"` in dev is resolved via webpack (--webpack); see npm "dev" script.
  turbopack: {
    root: configDir,
  },
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    const existing = config.resolve.alias;
    const alias =
      existing && typeof existing === "object" && !Array.isArray(existing)
        ? { ...existing }
        : {};
    Object.assign(alias, webpackResolveAliases);
    config.resolve.alias = alias;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
