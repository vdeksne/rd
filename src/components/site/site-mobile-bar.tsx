"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartIcon } from "@/components/icons/cart-icon";
import type { SiteNavItem } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

type Props = {
  nav: readonly SiteNavItem[];
};

export function SiteMobileBar({ nav }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 flex lg:hidden",
          "items-center justify-between gap-3 bg-white",
          "px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6",
        )}
      >
        <Link
          href="/"
          className={cn(
            "type-display-h1 min-w-0 truncate text-black",
            "text-[12px] leading-[1.15] tracking-[0.07em] sm:text-[14px]",
          )}
        >
          Raivis Deutschman
        </Link>
        <div className="flex shrink-0 items-center gap-0.5">
          <Link
            href="/cart"
            className={cn(
              "flex h-11 min-w-11 touch-manipulation items-center justify-center rounded-full",
              "border border-transparent bg-white shadow-none text-black transition-colors",
              "hover:border-black/10 active:bg-black/[0.03]",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40",
            )}
            aria-label="Shopping cart"
          >
            <CartIcon className="h-7 w-[23px] shrink-0" />
          </Link>
          <button
            type="button"
            className={cn(
              "flex h-11 min-w-11 touch-manipulation items-center justify-center rounded-full",
              "border border-transparent text-black transition-colors",
              "hover:border-black/10 active:bg-black/[0.03]",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40",
            )}
            aria-expanded={open}
            aria-controls="site-mobile-nav"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6 shrink-0" strokeWidth={1.25} aria-hidden />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </header>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          id="site-mobile-nav"
        >
          <div
            className={cn(
              "flex h-full w-full flex-col bg-white",
              "pt-[max(0.5rem,env(safe-area-inset-top))]",
            )}
          >
            <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-2 sm:px-6">
              <Link
                href="/"
                className={cn(
                  "type-display-h1 min-w-0 truncate text-black",
                  "text-[13px] leading-[1.15] tracking-[0.07em]",
                )}
                onClick={() => setOpen(false)}
              >
                Raivis Deutschman
              </Link>
              <button
                type="button"
                className={cn(
                  "flex h-11 min-w-11 shrink-0 touch-manipulation items-center justify-center rounded-full",
                  "border border-transparent transition-colors hover:border-black/10 active:bg-black/[0.03]",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40",
                )}
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="h-6 w-6 shrink-0" strokeWidth={1.25} aria-hidden />
              </button>
            </div>

            <nav
              className="flex flex-1 flex-col gap-[22px] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 sm:px-6"
              aria-label="Primary"
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "type-display-nav py-1 text-[13px] tracking-[0.1em] text-black",
                    "transition-colors hover:opacity-60 active:opacity-50 sm:text-[14px]",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
