import {
  getMergedPortfolioDefaultSlideIndex,
  getMergedPortfolioSlides,
} from "@/lib/site-content";
import { PortfolioGallery } from "./portfolio-gallery";

export default async function PortfolioPage() {
  const portfolioSlides = await getMergedPortfolioSlides();
  const portfolioDefaultSlideIndex = await getMergedPortfolioDefaultSlideIndex();

  return (
    <main className="bg-white pb-[var(--gallery-section-pad-bottom)] max-[1684px]:pt-0 min-[1685px]:pt-(--home-hero-top)">
      <div className="mx-auto w-full max-w-[var(--gallery-max-content)] px-[var(--gallery-gutter-x)] min-[1685px]:-translate-x-[calc(var(--site-rail)/2)]">
        <PortfolioGallery
          slides={portfolioSlides}
          initialIndex={portfolioDefaultSlideIndex}
        />
      </div>
    </main>
  );
}
