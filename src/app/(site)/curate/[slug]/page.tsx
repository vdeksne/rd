import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/cart/add-to-cart";
import { CurateArtworkVisuals } from "@/components/curate/curate-artwork-visuals";
import { getMergedArtwork } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const art = getMergedArtwork(slug);
  if (!art) return { title: "Work" };
  return { title: art.title };
}

export default async function CurateDetailPage({ params }: Props) {
  const { slug } = await params;
  const art = getMergedArtwork(slug);
  if (!art) notFound();

  const fmt = (n: number) =>
    n.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <main className="relative min-h-screen bg-white pb-24 max-lg:pt-0 lg:pt-[116px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6 lg:flex-row lg:items-start lg:gap-[6vw] lg:px-[max(1rem,8vw)]">
        <CurateArtworkVisuals
          imageSrc={art.imageSrc}
          title={art.title}
          subtitle={art.subtitle}
          year={art.year}
          widthIn={art.widthIn}
          heightIn={art.heightIn}
        />

        <div className="flex max-w-[613px] flex-col gap-9 text-[12px] capitalize tracking-[0.08em] text-black">
          <div className="space-y-2.5">
            <h1 className="type-site-display text-[12px] font-light leading-[18px] text-black">
              {art.title}
            </h1>
            <p className="type-site-display font-light leading-[18px] text-black">
              — {art.subtitle}, {String(art.year)} · {art.widthIn}″ ×{" "}
              {art.heightIn}″*
            </p>
            <p className="text-[10px] font-light leading-[18px] text-black">
              print dimensions shown in inches — unframed (excluding passepartout)
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-x-9 gap-y-6">
            <p className="type-site-display max-w-[218px] font-light leading-[18px] text-black">
              edition of {art.editionTotal} — {art.editionAvailable} available
            </p>
            <div className="flex flex-col gap-2.5">
              <p className="type-site-display text-[20px] font-light leading-[18px] text-black">
                €{fmt(art.priceEur)}
              </p>
              <AddToCart slug={art.slug} />
              <p className="text-[11px] font-normal normal-case text-black">
                Or{" "}
                <Link href="mailto:acquire@raivisdeutschman.com" className="underline">
                  inquire to acquire
                </Link>{" "}
                for framing options.
              </p>
            </div>
          </div>

          <div className="space-y-3 font-light leading-[18px] text-black">
            <p>
              museum-quality deep matte paper —
              <br />
              the inherent textures of making remain, hence the visible grain.
              <br />
              crafted in a precisely calibrated environment —
              <br />
              subtle tonal shifts may occur due to variations in color reproduction
              across screens.
            </p>
            <p>
              hand-signed and numbered by the artist as part of a limited edition —
              <br />
              artisanal frame glazed with acrylic, white passepartout.
              <br />
              sizes are determined individually, in accordance with each image’s intent —
              <br />
              this piece measures {art.widthIn} × {art.heightIn} inch, referring to the
              overall framed work.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
