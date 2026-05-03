import Image from "next/image";
import { cn } from "@/lib/utils";

export type ArtworkInsetEnlargeVariant = "matte" | "framed";

type Props = {
  imageSrc: string;
  /** Opens parent lightbox; pass which inset treatment to mirror at large size. */
  onEnlarge?: (variant: ArtworkInsetEnlargeVariant) => void;
};

/**
 * Inset pair under PDP hero:
 *
 * 1. (paper’s matte close up photo) — same artwork edge-to-edge in the tile (`object-cover`)
 *    with layered “matte paper” blends (no visible caption).
 *
 * 2. (wood frame close up photo) — same artwork in a simple dark brown frame, scaled to fit the tile
 *    (no visible caption).
 */

/** Printable matte-paper look: base image + the same overlay stack as PDP insets. */
export function MatteArtworkSurface({
  imageSrc,
  alt,
  sizes,
  className,
}: {
  imageSrc: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-neutral-300",
        className,
      )}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(253,250,245,0.48),rgba(245,238,226,0.32),rgba(228,220,206,0.36))] mix-blend-multiply"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-stone-50/45 via-amber-50/12 to-stone-900/14 mix-blend-soft-light"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(35,30,24,0.04)_1px,rgba(35,30,24,0.04)_2px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_48px_rgba(255,255,255,0.18),inset_0_0_2px_rgba(0,0,0,0.06)]"
      />
    </div>
  );
}

/** Dark brown gallery-style frame: solid moulding and a thin inner edge around the image. */
function DarkBrownFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex h-full min-h-0 w-full flex-col", className)}>
      <div
        className={cn(
          "relative flex h-full min-h-0 w-full flex-col rounded-[3px] p-[8px] sm:p-[9px]",
          "bg-[#3d2a1f]",
          "shadow-[0_3px_10px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]",
          "ring-1 ring-[#1f1410]/95",
        )}
      >
        <div className="relative z-1 min-h-0 flex-1 overflow-hidden rounded-[2px] bg-[#3d2a1f] ring-1 ring-[#1f1410]/85">
          {children}
        </div>
      </div>
    </div>
  );
}

export function FramedArtOriginal({
  imageSrc,
  alt,
  sizes,
  className,
}: {
  imageSrc: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <DarkBrownFrame className={className}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
      />
    </DarkBrownFrame>
  );
}

export function ArtworkDetailInlays({ imageSrc, onEnlarge }: Props) {
  const sizes = "(max-width: 640px) 42vw, 263px";
  const interactive = Boolean(onEnlarge);

  const tileBtn =
    "relative block h-full w-full overflow-hidden border-0 bg-transparent p-0 text-left ring-0 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

  const framed = (
    <div className="absolute inset-0 bg-neutral-900">
      <FramedArtOriginal
        imageSrc={imageSrc}
        alt=""
        sizes={sizes}
        className="h-full w-full"
      />
    </div>
  );

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      {interactive ? (
        <button
          type="button"
          className={cn(tileBtn, "aspect-263/175")}
          onClick={() => onEnlarge?.("matte")}
          aria-label="View artwork larger (matte detail)"
        >
          <MatteArtworkSurface imageSrc={imageSrc} alt="" sizes={sizes} />
        </button>
      ) : (
        <figure className="relative aspect-263/175 w-full overflow-hidden">
          <MatteArtworkSurface imageSrc={imageSrc} alt="" sizes={sizes} />
        </figure>
      )}

      {interactive ? (
        <button
          type="button"
          className={cn(
            tileBtn,
            "aspect-263/175 rounded-[2px] ring-1 ring-black/15",
          )}
          onClick={() => onEnlarge?.("framed")}
          aria-label="View artwork larger (frame detail)"
        >
          {framed}
        </button>
      ) : (
        <figure className="relative aspect-263/175 w-full overflow-hidden rounded-[2px] ring-1 ring-black/15">
          {framed}
        </figure>
      )}
    </div>
  );
}
