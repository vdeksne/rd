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
    <main className="relative min-h-screen bg-white max-lg:pb-10 max-lg:pt-0 lg:pb-32 lg:pt-[clamp(6rem,14vh,8rem)]">
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10">
        <h1 className="type-site-display text-[22px] font-light uppercase leading-none tracking-[0.08em] text-neutral-600">
          Shopping Cart
        </h1>

        {resolved.length === 0 ? (
          <p className="mt-16 text-sm font-light uppercase tracking-[0.06em] text-neutral-500">
            Your cart is empty.{" "}
            <Link href="/curate" className="underline">
              Browse curate
            </Link>
            .
          </p>
        ) : (
          <>
            <div className="mt-16 space-y-12 border-b border-neutral-300 pb-12">
              {resolved.map(({ line, artwork }) => (
                <div
                  key={artwork.slug}
                  className="flex flex-col gap-4 sm:grid sm:grid-cols-[minmax(0,180px)_1fr_auto] sm:items-start sm:gap-x-6 sm:gap-y-4"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100 sm:row-span-2 sm:max-w-[180px]">
                    <Image
                      src={artwork.imageSrc}
                      alt={artwork.title}
                      fill
                      sizes="(max-width: 639px) 100vw, 180px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 sm:self-start">
                    <p className="type-site-display text-[13px] font-light uppercase leading-snug tracking-[0.06em] text-neutral-600 sm:text-[19.3px]">
                      {artwork.title}
                    </p>
                    {artwork.subtitle ? (
                      <p className="type-site-display mt-1 text-[10.5px] font-light uppercase tracking-[0.07em] text-neutral-500 sm:mt-1.5 sm:text-[13px]">
                        {artwork.subtitle}
                      </p>
                    ) : null}
                    <p className="type-site-display mt-1 text-[10.5px] font-light uppercase tracking-[0.06em] text-neutral-500 sm:text-[13px]">
                      Size: {artwork.widthIn}″ × {artwork.heightIn}″
                    </p>
                  </div>
                  <div className="flex flex-row items-start justify-between gap-6 sm:flex-col sm:items-end sm:justify-start sm:gap-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        className="type-site-display flex h-8 min-w-8 items-center justify-center border-0 bg-transparent text-[17px] font-light leading-none text-neutral-500 transition hover:text-neutral-800 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:text-[22px]"
                        onClick={() => setQty(artwork.slug, line.qty - 1)}
                      >
                        −
                      </button>
                      <span className="type-site-display min-w-[2ch] text-center text-[17px] font-light tabular-nums text-neutral-600 sm:text-[22px]">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        className="type-site-display flex h-8 min-w-8 items-center justify-center border-0 bg-transparent text-[17px] font-light leading-none text-neutral-500 transition hover:text-neutral-800 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:text-[22px]"
                        onClick={() => setQty(artwork.slug, line.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="type-site-display text-right text-[14.5px] font-light tabular-nums text-neutral-600 sm:text-[20px]">
                      {formatMoneyEur(Math.round(artwork.priceEur * 100) * line.qty)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <p className="type-site-display text-[14px] font-light uppercase tracking-[0.08em] text-neutral-600">
                Subtotal{" "}
                <span className="ml-4 tabular-nums text-neutral-600">
                  {formatMoneyEur(subtotalCents)}
                </span>
              </p>
              <Button
                asChild
                variant="outline"
                className="type-site-display h-auto rounded-none border-[1.35px] border-neutral-600 bg-transparent px-10 py-3 text-[14px] font-light uppercase tracking-[0.08em] text-neutral-600 shadow-none hover:border-black hover:bg-black! hover:text-white!"
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
