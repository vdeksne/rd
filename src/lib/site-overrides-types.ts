import type { Artwork, PortfolioSlide } from "@/lib/demo-content";
import type { LayoutSpacing } from "@/lib/site-layout-spacing";

export type SiteOverrides = {
  nav?: {
    items?: { href: string; label: string }[];
  };
  homeHero?: Partial<{
    imageSrc: string;
    /** Optional portrait-friendly hero for viewports below the desktop rail breakpoint. */
    imageSrcMobile: string;
    captionBefore: string;
    captionLinkText: string;
    captionLinkHref: string;
    captionAfter: string;
  }>;
  homeHeroFrame?: Partial<{
    widthPx: number;
    heightPx: number;
    topPaddingDesktopPx: number;
  }>;
  portfolioSlides?: PortfolioSlide[];
  portfolioDefaultSlideIndex?: number;
  artworks?: Artwork[];
  aboutContent?: Partial<{
    imageSrc: string;
    sections: { heading: string; paragraphs: string[] }[];
  }>;
  layoutSpacing?: Partial<LayoutSpacing>;
};
