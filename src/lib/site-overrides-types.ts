import type { Artwork, PortfolioSlide } from "@/lib/demo-content";

export type SiteOverrides = {
  nav?: {
    items?: { href: string; label: string }[];
  };
  homeHero?: Partial<{
    imageSrc: string;
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
};
