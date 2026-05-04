"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { PortfolioSlide } from "@/lib/demo-content";
import { portfolioSlideSrc } from "@/lib/demo-content";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5500;
const CROSSFADE_MS = 900;

type PortfolioGalleryProps = {
  slides: PortfolioSlide[];
  /** Matches former single-hero default (Juvenile Prosperity frame). */
  initialIndex: number;
};

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function targetIsEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

export function PortfolioGallery({
  slides,
  initialIndex,
}: PortfolioGalleryProps) {
  const boundedInitial = Math.min(
    Math.max(0, initialIndex),
    Math.max(0, slides.length - 1),
  );
  const [active, setActive] = useState(boundedInitial);
  const current = slides[active] ?? slides[0];
  const lastIndex = slides.length - 1;
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const reducedMotion = usePrefersReducedMotion();
  const [hoverPaused, setHoverPaused] = useState(false);
  const [hiddenPaused, setHiddenPaused] = useState(false);

  const displayedRef = useRef(boundedInitial);
  const transitionEndRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [crossfade, setCrossfade] = useState({
    from: boundedInitial,
    to: boundedInitial,
    reveal: false,
  });

  const goPrev = useCallback(() => {
    if (lastIndex < 1) return;
    setActive((i) => (i <= 0 ? lastIndex : i - 1));
  }, [lastIndex]);

  const goNext = useCallback(() => {
    if (lastIndex < 1) return;
    setActive((i) => (i >= lastIndex ? 0 : i + 1));
  }, [lastIndex]);

  useEffect(() => {
    const onVis = () => setHiddenPaused(document.visibilityState === "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (lastIndex < 1) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (targetIsEditable(e.target)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, lastIndex]);

  useEffect(() => {
    thumbRefs.current[active]?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [active]);

  const multi = slides.length > 1;

  useEffect(() => {
    if (!multi || reducedMotion) return;
    if (active === displayedRef.current) return;

    if (transitionEndRef.current) {
      clearTimeout(transitionEndRef.current);
      transitionEndRef.current = null;
    }

    const from = displayedRef.current;
    setCrossfade({ from, to: active, reveal: false });

    const raf = requestAnimationFrame(() => {
      setCrossfade({ from, to: active, reveal: true });
    });

    transitionEndRef.current = setTimeout(() => {
      displayedRef.current = active;
      setCrossfade({ from: active, to: active, reveal: false });
      transitionEndRef.current = null;
    }, CROSSFADE_MS);

    return () => {
      cancelAnimationFrame(raf);
      if (transitionEndRef.current) {
        clearTimeout(transitionEndRef.current);
        transitionEndRef.current = null;
      }
    };
  }, [active, multi, reducedMotion]);

  useEffect(() => {
    if (!multi || !reducedMotion) return;
    displayedRef.current = active;
  }, [active, multi, reducedMotion]);

  useEffect(() => {
    if (!multi || hoverPaused || hiddenPaused) return;
    const id = window.setInterval(() => {
      goNext();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [multi, hoverPaused, hiddenPaused, goNext, active]);

  const crossfadeDurationClass = reducedMotion
    ? "duration-0"
    : "duration-[900ms]";

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className="relative aspect-1202/801 w-full max-w-full overflow-hidden bg-neutral-100 select-none"
        role={multi ? "region" : undefined}
        aria-roledescription={multi ? "image carousel" : undefined}
        aria-label={
          multi
            ? "Portfolio images. Click left or right for previous or next; autoplay pauses on hover."
            : undefined
        }
        onMouseEnter={() => multi && setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
        onFocusCapture={() => multi && setHoverPaused(true)}
        onBlurCapture={(e) => {
          if (!multi) return;
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setHoverPaused(false);
          }
        }}
      >
        {multi && reducedMotion ? (
          <Image
            key={current.id}
            src={portfolioSlideSrc(current, 1600)}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, min(1202px, 90vw)"
            priority={active === boundedInitial}
            draggable={false}
          />
        ) : multi ? (
          <div className="absolute inset-0">
            <Image
              src={portfolioSlideSrc(slides[crossfade.from]!, 1600)}
              alt=""
              fill
              className={cn(
                "object-cover ease-in-out motion-safe:transition-opacity",
                crossfadeDurationClass,
                crossfade.reveal ? "z-0 opacity-0" : "z-10 opacity-100",
              )}
              sizes="(max-width: 768px) 100vw, min(1202px, 90vw)"
              priority={crossfade.from === boundedInitial}
              draggable={false}
            />
            <Image
              src={portfolioSlideSrc(slides[crossfade.to]!, 1600)}
              alt=""
              fill
              className={cn(
                "object-cover ease-in-out motion-safe:transition-opacity",
                crossfadeDurationClass,
                crossfade.reveal ? "z-10 opacity-100" : "z-0 opacity-0",
              )}
              sizes="(max-width: 768px) 100vw, min(1202px, 90vw)"
              priority={crossfade.to === boundedInitial}
              draggable={false}
            />
          </div>
        ) : (
          <Image
            key={current.id}
            src={portfolioSlideSrc(current, 1600)}
            alt=""
            fill
            className="z-0 object-cover"
            sizes="(max-width: 768px) 100vw, min(1202px, 90vw)"
            priority={active === boundedInitial}
            draggable={false}
          />
        )}
        {multi ? (
          <div className="pointer-events-none absolute inset-0 z-20 flex touch-manipulation">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="pointer-events-auto h-full w-1/2 cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
            />
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="pointer-events-auto h-full w-1/2 cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
            />
          </div>
        ) : null}
      </div>

      <div className="mt-[2px] flex w-full justify-center">
        <div
          ref={stripRef}
          className={cn(
            "inline-flex max-w-full min-w-0 gap-[2px] overflow-x-auto overscroll-x-contain",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          )}
          role="group"
          aria-label="Portfolio thumbnails"
        >
          {slides.map((slide, i) => {
            const selected = i === active;
            return (
              <button
                key={slide.id}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                type="button"
                aria-pressed={selected}
                aria-label={`Show ${slide.title}`}
                onClick={() => setActive(i)}
                className={cn(
                  "relative h-[123px] w-[185px] shrink-0 overflow-hidden bg-neutral-100",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
                )}
              >
                <Image
                  src={portfolioSlideSrc(slide, 512)}
                  alt=""
                  fill
                  className="object-cover object-center scale-[1.18]"
                  sizes="185px"
                />
              </button>
            );
          })}
        </div>
      </div>

      <article className="mt-8 w-full space-y-3 text-[12px] capitalize tracking-[0.08em]">
        <h1 className="type-site-display text-[12px] font-semibold leading-[18px]">
          {current.title}
        </h1>
        <div className="space-y-3 font-light leading-[18px]">
          {current.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
