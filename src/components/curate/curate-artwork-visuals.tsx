"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";
import {
  ArtworkDetailInlays,
  FramedArtOriginal,
  MatteArtworkSurface,
  type ArtworkInsetEnlargeVariant,
} from "@/components/curate/artwork-detail-inlays";

type LightboxVariant = "hero" | ArtworkInsetEnlargeVariant;

const VARIANT_ORDER: LightboxVariant[] = ["hero", "matte", "framed"];

const VARIANT_LABEL: Record<LightboxVariant, string> = {
  hero: "Full image",
  matte: "Matte paper finish",
  framed: "Framed preview",
};

type Props = {
  imageSrc: string;
  title: string;
  subtitle: string;
  year: number;
  widthIn: number;
  heightIn: number;
};

const LIGHTBOX_SIZES = "100vw";

export function CurateArtworkVisuals({
  imageSrc,
  title,
  subtitle,
  year,
  widthIn,
  heightIn,
}: Props) {
  const [open, setOpen] = useState(false);
  const [lightboxVariant, setLightboxVariant] =
    useState<LightboxVariant>("hero");
  const titleId = useId();
  const liveId = useId();

  const close = useCallback(() => setOpen(false), []);

  const goVariantPrev = useCallback(() => {
    setLightboxVariant((v) => {
      const i = VARIANT_ORDER.indexOf(v);
      return VARIANT_ORDER[(i - 1 + VARIANT_ORDER.length) % VARIANT_ORDER.length];
    });
  }, []);

  const goVariantNext = useCallback(() => {
    setLightboxVariant((v) => {
      const i = VARIANT_ORDER.indexOf(v);
      return VARIANT_ORDER[(i + 1) % VARIANT_ORDER.length];
    });
  }, []);

  const openHero = useCallback(() => {
    setLightboxVariant("hero");
    setOpen(true);
  }, []);

  const openInset = useCallback((variant: ArtworkInsetEnlargeVariant) => {
    setLightboxVariant(variant);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goVariantPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goVariantNext();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, goVariantPrev, goVariantNext]);

  const srLabel =
    lightboxVariant === "hero"
      ? `${title} — enlarged, full image`
      : lightboxVariant === "matte"
        ? `${title} — enlarged, matte paper`
        : `${title} — enlarged, framed`;

  const metaLine = `— ${subtitle}, ${String(year)} · ${widthIn}″ × ${heightIn}″`;

  return (
    <>
      <div className="mx-auto w-full max-w-[542px] shrink-0 lg:mx-0">
        <button
          type="button"
          className="relative aspect-542/361 w-full cursor-zoom-in overflow-hidden bg-neutral-200 text-left ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          onClick={openHero}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 542px, 100vw"
            priority
          />
        </button>
        <ArtworkDetailInlays imageSrc={imageSrc} onEnlarge={openInset} />
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 px-4 py-8 md:px-10 md:py-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={close}
        >
          <p id={titleId} className="sr-only">
            {srLabel}
          </p>
          <p id={liveId} className="sr-only" aria-live="polite">
            {VARIANT_LABEL[lightboxVariant]}
          </p>
          <button
            type="button"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:border-white/25 hover:bg-white/12 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-6 md:top-6"
            onClick={close}
            aria-label="Close enlarged image"
          >
            <svg
              className="h-[18px] w-[18px] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth={1.35}
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div
            className="flex max-h-[92dvh] w-full max-w-[min(100%,1600px)] flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mx-auto w-full min-h-0 shrink">
              <div className="pointer-events-none absolute inset-0 z-10 flex touch-manipulation">
                <button
                  type="button"
                  onClick={goVariantPrev}
                  aria-label="Previous view: full image, matte, or framed"
                  className="pointer-events-auto h-full w-1/2 cursor-w-resize border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
                />
                <button
                  type="button"
                  onClick={goVariantNext}
                  aria-label="Next view: full image, matte, or framed"
                  className="pointer-events-auto h-full w-1/2 cursor-e-resize border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
                />
              </div>

              {lightboxVariant === "hero" ? (
                <div className="relative mx-auto h-[min(68dvh,88vw)] w-full">
                  <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-contain"
                    sizes={LIGHTBOX_SIZES}
                    priority
                  />
                </div>
              ) : null}

              {lightboxVariant === "matte" ? (
                <div className="relative mx-auto aspect-263/175 h-auto max-h-[68dvh] w-full max-w-[min(100%,92vw)]">
                  <MatteArtworkSurface
                    imageSrc={imageSrc}
                    alt={title}
                    sizes={LIGHTBOX_SIZES}
                    className="absolute inset-0"
                  />
                </div>
              ) : null}

              {lightboxVariant === "framed" ? (
                <div className="relative mx-auto aspect-263/175 h-auto max-h-[68dvh] w-full max-w-[min(100%,92vw)]">
                  <div className="absolute inset-0 bg-neutral-900">
                    <FramedArtOriginal
                      imageSrc={imageSrc}
                      alt={title}
                      sizes={LIGHTBOX_SIZES}
                      className="h-full w-full"
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-5 shrink-0 space-y-2 text-center tracking-[0.08em] text-white">
              <p className="type-site-display text-[11px] font-light uppercase leading-snug">
                {title}
              </p>
              <p className="type-site-display text-[10px] font-light capitalize leading-snug text-white/75">
                {metaLine}
              </p>
              <p className="type-site-display text-[9px] font-light uppercase tracking-widest text-white/45">
                {VARIANT_LABEL[lightboxVariant]}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
