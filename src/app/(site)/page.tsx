import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { getMergedHomeHero, getMergedHomeHeroFrame } from "@/lib/site-content";

const heroSizes =
  "(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), calc(100vw - var(--site-rail) - 80px)";

export default function HomePage() {
  const homeHero = getMergedHomeHero();
  const homeHeroFrame = getMergedHomeHeroFrame();
  const { widthPx, heightPx } = homeHeroFrame;

  return (
    <main className="relative flex w-full min-w-0 flex-col items-center bg-white max-lg:pt-0 lg:pt-(--home-hero-top)">
      <div className="flex w-full justify-center px-4 sm:px-6 lg:px-10">
        <div className="w-full min-w-0 max-w-[1202px]">
          <div
            className={cn(
              "relative w-full overflow-hidden bg-neutral-100",
              "max-lg:aspect-3/4",
              "lg:aspect-(--home-hero-ar)",
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
              priority
              className="object-cover object-center"
              sizes={heroSizes}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 flex w-full justify-center px-4 sm:px-6 lg:px-10">
        <p className="type-site-display w-full min-w-0 max-w-[1202px] text-[11.6px] font-light uppercase leading-[18px] tracking-[0.08em]">
          <span>{homeHero.captionBefore}</span>
          <Link
            href={homeHero.captionLinkHref}
            className="font-light underline underline-offset-2"
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
