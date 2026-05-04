import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/Cart/AddToCart";
import { CurateArtworkVisuals } from "@/components/Curate/CurateArtworkVisuals";
import { getMergedArtwork } from "@/lib/site-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const art = await getMergedArtwork(slug);
  if (!art) return { title: "Work" };
  return { title: art.title };
}

export default async function CurateDetailPage({ params }: Props) {
  const { slug } = await params;
  const art = await getMergedArtwork(slug);
  if (!art) notFound();

  const fmt = (n: number) =>
    n.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <main className="relative min-h-screen bg-white pb-[var(--gallery-section-pad-bottom)] max-[1684px]:pt-0 min-[1685px]:pt-(--home-hero-top)">
      <div className="mx-auto flex w-full max-w-[var(--gallery-max-detail-layout)] flex-col gap-[var(--gallery-detail-gap)] px-[var(--gallery-gutter-x)] lg:flex-row lg:items-start lg:px-[max(1rem,8vw)]">
        <CurateArtworkVisuals
          imageSrc={art.imageSrc}
          title={art.title}
          subtitle={art.subtitle}
          year={art.year}
          widthIn={art.widthIn}
          heightIn={art.heightIn}
        />

        <div className="flex max-w-[var(--gallery-max-detail-copy)] flex-col gap-[clamp(1.75rem,4vw,2.25rem)] normal-case text-neutral-950">
          <div className="flex flex-col gap-1">
            <h1 className="type-gallery-artwork-title text-balance">
              {art.title}
            </h1>
            <p className="type-gallery-meta">
              {art.subtitle}, {String(art.year)} · {art.widthIn}″ ×{" "}
              {art.heightIn}″*
            </p>
            <p className="type-gallery-micro mt-[clamp(0.375rem,1.5vw,0.5rem)] text-neutral-700">
              print dimensions shown in inches, unframed (excluding
              passepartout)
            </p>
          </div>

          <div className="flex flex-col gap-[clamp(0.375rem,1.5vw,0.5rem)]">
            <p className="type-gallery-meta max-w-[13.625rem]">
              edition of {art.editionTotal}, {art.editionAvailable} available
            </p>
            <p className="type-gallery-micro normal-case text-neutral-800">
              Or{" "}
              <Link
                href="mailto:acquire@raivisdeutschman.com"
                className="hover:text-neutral-950"
              >
                inquire to acquire
              </Link>{" "}
              for framing options.
            </p>
          </div>

          <div className="type-gallery-body max-w-none space-y-[clamp(0.625rem,2vw,1rem)] text-neutral-950">
            <p>
              museum-quality deep matte paper
              <br />
              the inherent textures of making remain, hence the visible grain.
              <br />
              crafted in a precisely calibrated environment
              <br />
              subtle tonal shifts may occur due to variations in color
              reproduction across screens.
            </p>
            <p>
              hand-signed and numbered by the artist as part of a limited
              edition
              <br />
              artisanal frame glazed with acrylic, white passepartout.
              <br />
              sizes are determined individually, in accordance with each image’s
              intent
              <br />
              this piece measures {art.widthIn} × {art.heightIn} inch, referring
              to the overall framed work.
            </p>
          </div>

          <div className="flex flex-col gap-[clamp(0.5rem,1.5vw,0.625rem)]">
            <p className="type-gallery-price">€{fmt(art.priceEur)}</p>
            <AddToCart slug={art.slug} />
          </div>
        </div>
      </div>
    </main>
  );
}
