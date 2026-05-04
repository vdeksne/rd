import Image from "next/image";
import Link from "next/link";
import { getMergedArtworks } from "@/lib/site-content";

export default async function CuratePage() {
  const demoArtworks = await getMergedArtworks();
  return (
    <main className="bg-white pb-[var(--gallery-section-pad-bottom)] max-[1684px]:pt-0 min-[1685px]:pt-(--home-hero-top)">
      <div className="mx-auto max-w-[var(--gallery-max-frame)] px-[var(--gallery-gutter-index)]">
        <div className="grid grid-cols-1 gap-x-[var(--gallery-grid-gap-x)] gap-y-[var(--gallery-grid-gap-y-sm)] sm:grid-cols-2 sm:gap-y-[var(--gallery-grid-gap-y-lg)] xl:grid-cols-3">
          {demoArtworks.map((art) => (
            <Link
              key={art.slug}
              href={`/curate/${art.slug}`}
              className="group block"
            >
              <div className="relative aspect-365/243 w-full overflow-hidden bg-neutral-100">
                <Image
                  src={art.imageSrc}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(min-width: 1280px) 33vw, (min-width: 640px) 46vw, 100vw"
                />
              </div>
              <div className="mt-[clamp(0.375rem,1vw,0.625rem)] flex flex-col gap-px leading-snug">
                <p className="type-gallery-grid-caption text-neutral-900">
                  {art.title}
                </p>
                <p className="type-gallery-grid-caption text-neutral-700">
                  {art.year}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
