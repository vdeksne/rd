import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { getMergedHomeHero, getMergedHomeHeroFrame } from "@/lib/site-content";

const heroSizesSingle =
  "(max-width: 1684px) 100vw, min(1202px, 90vw)";

/** Hidden desktop duplicate must use a non-trivial slot so the optimizer never picks a ~16px derivative. */
const heroSizesMobileOnly =
  "(max-width: 1684px) 100vw, 48px";

const heroSizesDesktopOnly =
  "(max-width: 1684px) 48px, min(1202px, 90vw)";

export default async function HomePage() {
  const homeHero = await getMergedHomeHero();
  const homeHeroFrame = await getMergedHomeHeroFrame();
  const { widthPx, heightPx } = homeHeroFrame;

  const desktopSrc = homeHero.imageSrc;
  const mobileOverride = homeHero.imageSrcMobile?.trim();
  const mobileSrc = mobileOverride || desktopSrc;
  const splitMobileHero =
    Boolean(mobileOverride) && mobileSrc !== desktopSrc;

  return (
    <main className="relative flex w-full min-w-0 flex-col items-center bg-white max-[1684px]:pt-0 min-[1685px]:pt-(--home-hero-top)">
      <div className="flex w-full justify-center px-[var(--gallery-gutter-x)]">
        <div className="w-full min-w-0 max-w-[var(--gallery-max-content)]">
          <div
            className={cn(
              "relative w-full overflow-hidden bg-neutral-100",
              "max-[1684px]:aspect-3/4",
              "min-[1685px]:aspect-(--home-hero-ar)",
            )}
            style={
              {
                "--home-hero-ar": `${widthPx} / ${heightPx}`,
              } as CSSProperties
            }
          >
            {splitMobileHero ? (
              <>
                <Image
                  src={mobileSrc}
                  alt=""
                  fill
                  sizes={heroSizesMobileOnly}
                  quality={92}
                  className="object-cover object-center min-[1685px]:hidden"
                  loading="eager"
                  fetchPriority="high"
                />
                <Image
                  src={desktopSrc}
                  alt=""
                  fill
                  sizes={heroSizesDesktopOnly}
                  quality={92}
                  className="hidden object-cover object-center min-[1685px]:block"
                  loading="eager"
                  fetchPriority="high"
                />
              </>
            ) : (
              <Image
                src={desktopSrc}
                alt=""
                fill
                sizes={heroSizesSingle}
                quality={92}
                className="object-cover object-center"
                loading="eager"
                fetchPriority="high"
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-[var(--home-caption-mt)] flex w-full justify-center px-[var(--gallery-gutter-x)]">
        <p className="type-gallery-caption w-full min-w-0 max-w-[var(--gallery-max-content)] text-neutral-700">
          <span>{homeHero.captionBefore}</span>
          <Link
            href={homeHero.captionLinkHref}
            className="transition hover:text-neutral-900"
            target="_blank"
            rel="noreferrer"
          >
            {homeHero.captionLinkText}
          </Link>
          <span>{homeHero.captionAfter}</span>
        </p>
      </div>
    </main>
  );
}
