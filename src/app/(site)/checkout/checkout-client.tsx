"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  resolveCartArtworks,
  useCart,
} from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatMoneyUsd(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

/** Demo conversion €→¢ then display as $ to loosely match Figma; replace with real FX + Stripe. */
function eurToDemoCents(eur: number) {
  return Math.round(eur * 100 * 1.08);
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 2.5l7 2.6v6.4c0 5.5-3.8 10.7-7 11.5-3.2-.8-7-6-7-11.5V5.1l7-2.6z"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckoutClient() {
  const { lines, setQty, artworks } = useCart();
  const resolved = useMemo(
    () => resolveCartArtworks(lines, artworks),
    [lines, artworks],
  );
  const [postal, setPostal] = useState("LV-4601");
  const [payState, setPayState] = useState<"idle" | "loading">("idle");
  const [payError, setPayError] = useState<string | null>(null);

  const { subtotal, shipping, tax, total } = useMemo(() => {
    const sub = resolved.reduce(
      (acc, { line, artwork }) =>
        acc + eurToDemoCents(artwork.priceEur) * line.qty,
      0,
    );
    const ship = sub > 0 ? 5000 : 0;
    const taxAmt = 0;
    return {
      subtotal: sub,
      shipping: ship,
      tax: taxAmt,
      total: sub + ship + taxAmt,
    };
  }, [resolved]);

  const startStripeCheckout = async () => {
    setPayError(null);
    setPayState("loading");
    try {
      const lineItems = resolved.map(({ line, artwork }) => ({
        name: artwork.title,
        quantity: line.qty,
        priceUsdCents: eurToDemoCents(artwork.priceEur),
      }));

      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems,
          shippingUsdCents: shipping,
          taxUsdCents: tax,
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Checkout could not be started.");
      }
      if (!data.url) {
        throw new Error("No checkout URL returned.");
      }
      window.location.assign(data.url);
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Payment could not be started.");
      setPayState("idle");
    }
  };

  if (resolved.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 font-sans text-sm">
        <p className="font-light text-neutral-600">
          Nothing to check out.{" "}
          <Link href="/curate" className="underline">
            Return to curate
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[440px] flex-col px-4 py-12 sm:px-0 sm:py-16">
      <div className="border border-[#e0e0e0] bg-white px-5 pb-8 pt-7 font-sans shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:px-6 sm:pt-8">
        <h2 className="text-[20px] font-bold leading-tight tracking-tight text-black">
          Order Summary
        </h2>

        <div className="mt-7 space-y-5">
          {resolved.map(({ line, artwork }) => (
            <div
              key={artwork.slug}
              className="overflow-hidden border border-[#e5e5e5]"
            >
              <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden border border-[#e8e8e8] bg-neutral-100 sm:h-20 sm:w-20">
                  <Image
                    src={artwork.thumbSrc}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <span className="absolute bottom-0 right-0 flex h-[22px] min-w-[22px] items-center justify-center bg-[#5a5a5a] px-1 text-[11px] font-bold text-white">
                    {line.qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-bold leading-snug text-black">
                        {artwork.title}
                      </p>
                      <p className="mt-1 text-[12px] font-normal lowercase tracking-normal text-[#666]">
                        size: {artwork.widthIn} × {artwork.heightIn}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[14px] font-bold tabular-nums text-black">
                        {formatMoneyUsd(
                          eurToDemoCents(artwork.priceEur) * line.qty,
                        )}
                      </p>
                      <button
                        type="button"
                        className="mt-2 text-[12px] font-normal text-[#767676] underline decoration-[#767676] underline-offset-2 hover:text-black"
                        onClick={() => setQty(artwork.slug, 0)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] border-t border-[#e5e5e5] bg-[#f4f4f4]">
                <Label
                  htmlFor={`qty-${artwork.slug}`}
                  className="flex items-center px-3 py-2.5 text-[13px] font-bold text-black sm:px-4"
                >
                  Qty
                </Label>
                <Input
                  id={`qty-${artwork.slug}`}
                  type="number"
                  min={1}
                  value={line.qty}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (!Number.isFinite(n)) return;
                    setQty(artwork.slug, n);
                  }}
                  className="h-[42px] rounded-none border-0 border-l border-[#e0e0e0] bg-transparent text-right text-[14px] font-medium tabular-nums text-black shadow-none focus-visible:ring-0"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-3.5 text-[13px] font-bold text-black">
          <div className="flex justify-between gap-4">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatMoneyUsd(subtotal)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Tax</span>
            <span className="tabular-nums">{formatMoneyUsd(tax)}</span>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <span>
              Shipping ({postal}){" "}
              <span className="sr-only">— edit postal code</span>
            </span>
            <span className="tabular-nums">{formatMoneyUsd(shipping)}</span>
          </div>
          <Label htmlFor="postal" className="sr-only">
            Postal code
          </Label>
          <Input
            id="postal"
            value={postal}
            onChange={(e) => setPostal(e.target.value)}
            className="h-9 max-w-[140px] rounded-sm border-[#d8d8d8] text-[12px] font-medium text-[#444]"
            placeholder="Postal code"
          />

          <div className="border-t border-[#e0e0e0] pt-3.5">
            <div className="flex justify-between gap-4 text-[15px] font-bold">
              <span>Total</span>
              <span className="tabular-nums">{formatMoneyUsd(total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {payError ? (
            <p
              role="alert"
              className="border border-red-200 bg-red-50 px-3 py-2 text-center text-[12px] font-medium leading-snug text-red-800"
            >
              {payError}
            </p>
          ) : null}

          <p className="text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#888]">
            Secure payment
          </p>
          <button
            type="button"
            disabled={payState === "loading"}
            onClick={() => startStripeCheckout()}
            className="flex min-h-[50px] w-full flex-col items-center justify-center gap-0.5 bg-black px-4 py-2.5 text-white transition hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-[13px] font-bold tracking-tight">
              {payState === "loading" ? "Opening…" : "Continue to payment"}
            </span>
            <span className="text-[10px] font-medium normal-case tracking-normal text-white/80">
              Apple Pay · Google Pay · Link · cards & more
            </span>
          </button>

          <Button
            type="button"
            disabled={payState === "loading"}
            variant="outline"
            onClick={() => startStripeCheckout()}
            className="h-12 w-full rounded-none border border-[#cfcfcf] bg-white text-[12px] font-bold uppercase tracking-[0.06em] text-black shadow-none hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            More payment options
          </Button>
          <p className="text-center text-[10px] leading-relaxed text-[#999]">
            After paying, Stripe should return you automatically to our thank-you
            page. If you remain on Stripe with only a green checkmark, scroll the
            page for a confirmation link or try a window without extensions (ad
            blockers / strict CSP can block the redirect). Next step uses Stripe
            Checkout — wallets and local methods (Klarna, PayPal, etc.) depend on
            your Stripe Dashboard and customer region. If the page hangs or
            DevTools shows <code className="text-[9px]">r.stripe.com</code>{" "}
            <code className="text-[9px]">ERR_BLOCKED_BY_CLIENT</code>, allow Stripe
            in your ad blocker or try a private window without extensions.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-2 text-[12px] font-normal text-[#767676]">
          <Link
            href="/legal/returns"
            className="underline decoration-[#767676] underline-offset-2 hover:text-black"
          >
            Return Policy
          </Link>
          <Link
            href="/legal/terms"
            className="underline decoration-[#767676] underline-offset-2 hover:text-black"
          >
            Terms of Service
          </Link>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-transparent pt-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-black">
            <ShieldCheckIcon className="h-5 w-5 shrink-0 text-emerald-700" />
            Secure SSL checkout
          </div>
        </div>
      </div>
    </div>
  );
}
