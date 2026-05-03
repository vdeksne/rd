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

/**
 * Stripe Checkout / js.stripe.com may execute small inline bootstrap scripts.
 * If you configure CSP elsewhere (for example Vercel → Security Headers), do **not**
 * enable this middleware header until that policy is removed, or browsers will enforce
 * both policies together and hashes must appear in **each** policy.
 *
 * Enable from this repo: set `ENABLE_SITE_CSP=1` in `.env` / deployment env vars.
 *
 * Chrome may suggest additional sha256-* values in the console; append them to
 * `scriptSrcHashes` below.
 *
 * @see https://stripe.com/docs/security/guide#content-security-policy
 */
const scriptSrcHashes = [
  "sha256-BNulBYV1JXGvq9NQg7814ZyyVZCqfRI1aq5d+PSIdgI=",
  "sha256-vCjs+NPIECEYOAAtiJiOX2SbxlmFmaGz9RrmWyxVLsY=",
  "sha256-PKt54BqmsyRwYF7gUwqc7fERZlkOumZFh55IYZAHg1I=",
  /* prepare.js inline bootstrap (Chrome suggests this hash when blocked) */
  "sha256-3bzWVxQE32IZQKH9eh8KzyHuhXOlMrboDVVBRd0fWTU=",
] as const;

function contentSecurityPolicy(): string {
  const hashList = scriptSrcHashes.map((h) => `'${h}'`).join(" ");
  return [
    "default-src 'self'",
    `script-src 'self' https://js.stripe.com ${hashList}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.stripe.com https://r.stripe.com https://q.stripe.com https://errors.stripe.com https://merchant-ui-api.stripe.com https://checkout.stripe.com",
    "frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com",
    "upgrade-insecure-requests",
  ].join("; ");
}

const enableCsp = process.env.ENABLE_SITE_CSP === "1";

/**
 * `next/image` treats absolute URLs (e.g. https://your-site.vercel.app/images/…)
 * as remote — those hostnames must be allowed or Vercel returns 400 INVALID_IMAGE_OPTIMIZE_REQUEST.
 */
function imageRemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "*.vercel.app",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "*.public.blob.vercel-storage.com",
      pathname: "/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      pathname: "/**",
    },
  ];

  const addHost = (raw: string | undefined) => {
    if (!raw?.trim()) return;
    let host = raw.trim().replace(/^https?:\/\//, "").split("/")[0];
    host = host?.split(":")[0];
    if (!host) return;
    const protocol =
      host === "localhost" || host === "127.0.0.1" ? "http" : "https";
    if (
      patterns.some((p) => "hostname" in p && p.hostname === host &&
        p.protocol === protocol))
    {
      return;
    }
    patterns.push({ protocol: protocol as "http" | "https", hostname: host, pathname: "/**" });
  };

  addHost(process.env.VERCEL_URL);
  addHost(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl?.startsWith("http")) {
    try {
      addHost(new URL(siteUrl).hostname);
    } catch {
      /* ignore invalid URL */
    }
  }

  return patterns;
}

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
    remotePatterns: imageRemotePatterns(),
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  ...(enableCsp
    ? {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                {
                  key: "Content-Security-Policy",
                  value: contentSecurityPolicy(),
                },
              ],
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
