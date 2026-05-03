import Image from "next/image";
import Link from "next/link";
import { getMergedArtworks } from "@/lib/site-content";

export default function CuratePage() {
  const demoArtworks = getMergedArtworks();
  return (
    <main className="bg-white pb-24 max-lg:pt-0 lg:pt-[114px]">
      <div className="mx-auto max-w-[1558px] px-6 sm:px-[max(1rem,3vw)]">
        <div className="grid grid-cols-1 gap-x-[33px] gap-y-6 sm:gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  sizes="(min-width: 1280px) 365px, (min-width: 1024px) 28vw, 50vw"
                />
              </div>
              <div className="mt-3 space-y-px uppercase tracking-[0.06em]">
                <p className="type-site-display text-[11px] font-light leading-snug text-black">
                  {art.title}
                </p>
                <p className="type-site-display text-[11px] font-light leading-snug text-black">
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
