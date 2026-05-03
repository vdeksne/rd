import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { getMergedHomeHeroFrame } from "@/lib/site-content";

const siteDescription =
  "Curated fine-art photography and editions. E-commerce experience for collectors.";
const faviconLogo = "/images/logo_small.png";
const ogLogo = "/images/logo.png";

function stripTrailingSlash(s: string) {
  return s.replace(/\/+$/, "");
}

/** Crawlers require absolute HTTPS image URLs — avoid localhost URLs on Vercel when env omits NEXT_PUBLIC_SITE_URL. */
function resolveMetadataBase(): URL {
  const siteUrl = stripTrailingSlash(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "",
  );
  if (siteUrl.startsWith("http")) return new URL(siteUrl);

  const productionHostRaw =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ??
    process.env.VERCEL_URL?.trim();
  if (productionHostRaw) {
    const host = stripTrailingSlash(
      productionHostRaw.replace(/^https?:\/\//, ""),
    );
    return new URL(`https://${host}`);
  }

  return new URL("http://localhost:3000");
}

const metadataBase = resolveMetadataBase();

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Raivis Deutschman — Fine Art",
    template: "%s — Raivis Deutschman",
  },
  description: siteDescription,
  icons: {
    icon: [{ url: faviconLogo, type: "image/png", sizes: "any" }],
    shortcut: [{ url: faviconLogo, type: "image/png" }],
    apple: [{ url: ogLogo, type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Raivis Deutschman — Fine Art",
    description: siteDescription,
    type: "website",
    locale: "en_US",
    siteName: "Raivis Deutschman",
    images: [
      {
        url: ogLogo,
        alt: "Raivis Deutschman — Fine Art",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Raivis Deutschman — Fine Art",
    description: siteDescription,
    images: [ogLogo],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { topPaddingDesktopPx } = getMergedHomeHeroFrame();
  const htmlStyle = {
    "--home-hero-top": `${topPaddingDesktopPx}px`,
  } as CSSProperties;

  return (
    <html lang="en" className="h-full antialiased" style={htmlStyle}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
