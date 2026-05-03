import {
  getMergedPortfolioDefaultSlideIndex,
  getMergedPortfolioSlides,
} from "@/lib/site-content";
import { PortfolioGallery } from "./portfolio-gallery";

export default async function PortfolioPage() {
  const portfolioSlides = await getMergedPortfolioSlides();
  const portfolioDefaultSlideIndex = await getMergedPortfolioDefaultSlideIndex();

  return (
    <main className="bg-white pb-24 max-lg:pt-0 lg:pt-[116px]">
      <div className="mx-auto w-full max-w-[1202px] px-6 sm:px-0">
        <PortfolioGallery
          slides={portfolioSlides}
          initialIndex={portfolioDefaultSlideIndex}
        />
      </div>
    </main>
  );
}
