import Link from "next/link";
import type { SiteNavItem } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

type Props = {
  nav: readonly SiteNavItem[];
};

/** Primary navigation always visible as text — no burger / drawer on small screens. */
export function SiteMobileBar({ nav }: Props) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 min-[1685px]:hidden",
        "bg-white px-4 pb-2 pt-[max(1.35rem,calc(env(safe-area-inset-top)+0.85rem))] sm:px-6 sm:pt-[max(1.5rem,calc(env(safe-area-inset-top)+1rem))]",
      )}
    >
      <div className="flex flex-col items-center gap-6 pb-3">
        <Link
          href="/"
          className={cn(
            "type-display-h1 block w-full whitespace-nowrap text-center text-black",
            "text-[16px] leading-[1.2] tracking-[0.06em] sm:text-[18px]",
          )}
        >
          Raivis Deutschman
        </Link>
        <nav
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "type-site-display text-[10px] font-light uppercase tracking-[0.11em] text-black sm:text-[11px]",
                "transition-opacity hover:opacity-55 active:opacity-45",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
