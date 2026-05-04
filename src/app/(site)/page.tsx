import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { getMergedHomeHero, getMergedHomeHeroFrame } from "@/lib/site-content";

const heroSizes =
  "(max-width: 639px) calc(100vw - 2 * var(--gallery-gutter-x)), (max-width: 1684px) calc(100vw - 2 * var(--gallery-gutter-x)), calc(100vw - var(--site-rail) - 2 * var(--gallery-gutter-x))";

export default async function HomePage() {
  const homeHero = await getMergedHomeHero();
  const homeHeroFrame = await getMergedHomeHeroFrame();
  const { widthPx, heightPx } = homeHeroFrame;

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
            <Image
              src={homeHero.imageSrc}
              alt=""
              fill
              sizes={heroSizes}
              className="object-cover object-center"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
      <div className="mt-[clamp(0.375rem,1.5vw,0.75rem)] flex w-full justify-center px-[var(--gallery-gutter-x)]">
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
