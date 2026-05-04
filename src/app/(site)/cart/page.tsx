"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  resolveCartArtworks,
  useCart,
} from "@/components/cart/cart-context";

function formatMoneyEur(cents: number) {
  return (cents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
}

export default function CartPage() {
  const { lines, setQty, artworks } = useCart();
  const resolved = useMemo(
    () => resolveCartArtworks(lines, artworks),
    [lines, artworks],
  );
  const subtotalCents = resolved.reduce(
    (acc, { line, artwork }) =>
      acc + Math.round(artwork.priceEur * 100) * line.qty,
    0,
  );

  return (
    <main className="relative min-h-screen bg-white max-[1684px]:pb-10 max-[1684px]:pt-0 min-[1685px]:pb-[var(--gallery-section-pad-bottom)] min-[1685px]:pt-(--home-hero-top)">
      <div className="mx-auto w-full max-w-[var(--gallery-max-content)] px-[var(--gallery-gutter-x)] sm:px-[clamp(1.25rem,4vw,2.5rem)]">
        <h1 className="type-gallery-page-title text-neutral-600">
          Shopping Cart
        </h1>

        {resolved.length === 0 ? (
          <p className="type-gallery-caption mt-[clamp(3rem,12vw,6rem)] text-neutral-500">
            Your cart is empty.{" "}
            <Link href="/curate" className="hover:text-neutral-800">
              Browse curate
            </Link>
            .
          </p>
        ) : (
          <>
            <div className="mt-[clamp(3rem,10vw,5rem)] space-y-[clamp(2rem,6vw,3rem)] border-b border-neutral-300 pb-[clamp(2rem,6vw,3rem)]">
              {resolved.map(({ line, artwork }) => (
                <div
                  key={artwork.slug}
                  className="flex flex-col gap-4 sm:grid sm:grid-cols-[minmax(0,var(--gallery-cart-thumb))_1fr_auto] sm:items-start sm:gap-x-[clamp(1rem,3vw,1.75rem)] sm:gap-y-4"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100 sm:row-span-2 sm:w-[var(--gallery-cart-thumb)] sm:max-w-[var(--gallery-cart-thumb)]">
                    <Image
                      src={artwork.imageSrc}
                      alt={artwork.title}
                      fill
                      sizes="(max-width: 639px) 100vw, 180px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 sm:self-start">
                    <p className="type-gallery-card-title text-neutral-600">
                      {artwork.title}
                    </p>
                    {artwork.subtitle ? (
                      <p className="type-gallery-card-meta mt-1 text-neutral-500 sm:mt-1.5">
                        {artwork.subtitle}
                      </p>
                    ) : null}
                    <p className="type-gallery-card-meta mt-1 text-neutral-500">
                      Size: {artwork.widthIn}″ × {artwork.heightIn}″
                    </p>
                  </div>
                  <div className="flex flex-row items-start justify-between gap-6 sm:flex-col sm:items-end sm:justify-start sm:gap-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        className="type-gallery-numeric flex h-8 min-w-8 items-center justify-center border-0 bg-transparent leading-none text-neutral-500 transition hover:text-neutral-800 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        onClick={() => setQty(artwork.slug, line.qty - 1)}
                      >
                        −
                      </button>
                      <span className="type-gallery-numeric min-w-[2ch] text-center text-neutral-600">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        className="type-gallery-numeric flex h-8 min-w-8 items-center justify-center border-0 bg-transparent leading-none text-neutral-500 transition hover:text-neutral-800 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        onClick={() => setQty(artwork.slug, line.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="type-gallery-numeric text-right text-neutral-600">
                      {formatMoneyEur(Math.round(artwork.priceEur * 100) * line.qty)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-[clamp(2rem,5vw,2.75rem)] flex flex-col gap-[clamp(1.5rem,4vw,2rem)] sm:flex-row sm:items-start sm:justify-between">
              <p className="type-gallery-caption text-neutral-600">
                Subtotal{" "}
                <span className="type-gallery-numeric ml-4 inline text-neutral-600">
                  {formatMoneyEur(subtotalCents)}
                </span>
              </p>
              <Button
                asChild
                variant="outline"
                className="type-gallery-caption h-auto rounded-none border-[1.35px] border-neutral-600 bg-transparent px-[clamp(1.75rem,5vw,2.5rem)] py-[clamp(0.625rem,2vw,1rem)] text-neutral-600 shadow-none hover:border-black hover:bg-black! hover:text-white!"
              >
                <Link href="/checkout">Secure checkout</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
