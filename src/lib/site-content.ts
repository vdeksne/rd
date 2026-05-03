import { existsSync, readFileSync } from "fs";
import path from "path";
import { cache } from "react";
import {
  aboutContent,
  demoArtworks,
  homeHero,
  homeHeroFrame,
  portfolioDefaultSlideIndex,
  portfolioSlides,
  type Artwork,
  type PortfolioSlide,
} from "@/lib/demo-content";
import { SITE_PRIMARY_NAV } from "@/lib/site-nav";
import type { SiteOverrides } from "@/lib/site-overrides-types";

export const loadSiteOverrides = cache((): SiteOverrides => {
  try {
    const filePath = path.join(process.cwd(), "data", "site-overrides.json");
    if (!existsSync(filePath)) return {};
    const raw = readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as SiteOverrides;
    }
    return {};
  } catch {
    return {};
  }
});

export function getMergedPrimaryNav(): { href: string; label: string }[] {
  const items = loadSiteOverrides().nav?.items;
  if (items?.length) return items.map((i) => ({ href: i.href, label: i.label }));
  return SITE_PRIMARY_NAV.map((i) => ({ href: i.href, label: i.label }));
}

export function getMergedHomeHero() {
  return { ...homeHero, ...loadSiteOverrides().homeHero };
}

export function getMergedHomeHeroFrame() {
  return { ...homeHeroFrame, ...loadSiteOverrides().homeHeroFrame };
}

export function getMergedPortfolioSlides(): PortfolioSlide[] {
  const next = loadSiteOverrides().portfolioSlides;
  if (next?.length) return next;
  return portfolioSlides;
}

export function getMergedPortfolioDefaultSlideIndex(): number {
  const v = loadSiteOverrides().portfolioDefaultSlideIndex;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return portfolioDefaultSlideIndex;
}

export function getMergedArtworks(): Artwork[] {
  const next = loadSiteOverrides().artworks;
  if (next?.length) return next;
  return demoArtworks;
}

export function getMergedArtwork(slug: string): Artwork | null {
  return getMergedArtworks().find((a) => a.slug === slug) ?? null;
}

export function getMergedAboutContent() {
  const o = loadSiteOverrides().aboutContent;
  if (!o) return aboutContent;
  return {
    imageSrc: o.imageSrc ?? aboutContent.imageSrc,
    sections: o.sections ?? aboutContent.sections,
  };
}
