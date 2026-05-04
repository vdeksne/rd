import { existsSync, readFileSync } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
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
import {
  isBlobOverridesConfigured,
  readSiteOverridesFromBlobIfConfigured,
} from "@/lib/site-overrides-blob";
import type { SiteOverrides } from "@/lib/site-overrides-types";

function readSiteOverridesFromDisk(): SiteOverrides {
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
}

/**
 * Resolves overrides: Blob (`BLOB_READ_WRITE_TOKEN`), else `data/site-overrides.json`.
 * When Blob is configured, the live payload normally comes from Blob. If the read fails (bad token,
 * network, etc.), we fall back to disk so pages still render; check logs for
 * `[site-content] Blob overrides unavailable`.
 */
export async function resolveSiteOverrides(): Promise<SiteOverrides> {
  if (!isBlobOverridesConfigured()) {
    return readSiteOverridesFromDisk();
  }
  try {
    const fromBlob = await readSiteOverridesFromBlobIfConfigured();
    if (fromBlob !== null) return fromBlob;
  } catch (e) {
    console.error(
      "[site-content] Blob overrides unavailable; falling back to data/site-overrides.json.",
      e,
    );
  }
  return readSiteOverridesFromDisk();
}

/**
 * Same as {@link resolveSiteOverrides} plus `noStore()` for App Router renders.
 */
export async function loadSiteOverrides(): Promise<SiteOverrides> {
  noStore();
  return resolveSiteOverrides();
}

export async function getMergedPrimaryNav(): Promise<{ href: string; label: string }[]> {
  const o = await loadSiteOverrides();
  const items = o.nav?.items;
  if (items?.length) return items.map((i) => ({ href: i.href, label: i.label }));
  return SITE_PRIMARY_NAV.map((i) => ({ href: i.href, label: i.label }));
}

export async function getMergedHomeHero() {
  const o = await loadSiteOverrides();
  return { ...homeHero, ...o.homeHero };
}

export async function getMergedHomeHeroFrame() {
  const o = await loadSiteOverrides();
  return { ...homeHeroFrame, ...o.homeHeroFrame };
}

export async function getMergedPortfolioSlides(): Promise<PortfolioSlide[]> {
  const o = await loadSiteOverrides();
  const next = o.portfolioSlides;
  if (next?.length) return next;
  return portfolioSlides;
}

export async function getMergedPortfolioDefaultSlideIndex(): Promise<number> {
  const o = await loadSiteOverrides();
  const v = o.portfolioDefaultSlideIndex;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return portfolioDefaultSlideIndex;
}

export async function getMergedArtworks(): Promise<Artwork[]> {
  const o = await loadSiteOverrides();
  const next = o.artworks;
  if (next?.length) return next;
  return demoArtworks;
}

export async function getMergedArtwork(slug: string): Promise<Artwork | null> {
  const list = await getMergedArtworks();
  return list.find((a) => a.slug === slug) ?? null;
}

export async function getMergedAboutContent() {
  const o = await loadSiteOverrides();
  const merged = o.aboutContent;
  if (!merged) return aboutContent;
  return {
    imageSrc: merged.imageSrc ?? aboutContent.imageSrc,
    sections: merged.sections ?? aboutContent.sections,
  };
}
