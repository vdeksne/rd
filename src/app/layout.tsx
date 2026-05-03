import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { getMergedHomeHeroFrame } from "@/lib/site-content";

export const metadata: Metadata = {
  title: {
    default: "Raivis Deutschman — Fine Art",
    template: "%s — Raivis Deutschman",
  },
  description:
    "Curated fine-art photography and editions. E-commerce experience for collectors.",
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
