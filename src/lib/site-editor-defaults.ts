import type { Artwork, PortfolioSlide } from "@/lib/demo-content";
import {
  aboutContent,
  demoArtworks,
  homeHero,
  homeHeroFrame,
  portfolioDefaultSlideIndex,
  portfolioSlides,
} from "@/lib/demo-content";
import {
  layoutSpacingDefaults,
  type LayoutSpacing,
} from "@/lib/site-layout-spacing";
import { SITE_PRIMARY_NAV } from "@/lib/site-nav";

/** Payload shape shared by `/api/admin/overrides` GET and the admin page bootstrap. */
export type SiteEditorDefaults = {
  nav: { href: string; label: string }[];
  homeHero: Record<string, string>;
  homeHeroFrame: Record<string, number>;
  portfolioSlides: PortfolioSlide[];
  portfolioDefaultSlideIndex: number;
  artworks: Artwork[];
  aboutContent: {
    imageSrc: string;
    sections: { heading: string; paragraphs: string[] }[];
  };
  layoutSpacing: LayoutSpacing;
};

export function getSiteEditorDefaults(): SiteEditorDefaults {
  return {
    nav: SITE_PRIMARY_NAV.map((item) => ({
      href: item.href,
      label: item.label,
    })),
    homeHero: { ...homeHero },
    homeHeroFrame: { ...homeHeroFrame },
    portfolioSlides,
    portfolioDefaultSlideIndex,
    artworks: demoArtworks,
    aboutContent: {
      imageSrc: aboutContent.imageSrc,
      sections: aboutContent.sections.map((s) => ({
        heading: s.heading,
        paragraphs: [...s.paragraphs],
      })),
    },
    layoutSpacing: { ...layoutSpacingDefaults },
  };
}
