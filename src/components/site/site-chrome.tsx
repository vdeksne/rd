import Link from "next/link";
import { CartIcon } from "@/components/icons/cart-icon";
import { SiteMobileChromeNav } from "@/components/site/site-mobile-chrome-nav";
import type { SiteNavItem } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

type SiteChromeProps = {
  children: React.ReactNode;
  navItems: readonly SiteNavItem[];
};

export function SiteChrome({ children, navItems }: SiteChromeProps) {
  return (
    <div className="relative min-h-screen bg-white text-black">
      <SiteMobileChromeNav nav={navItems} />

      <aside
        className={cn(
          "pointer-events-none fixed inset-y-0 left-0 z-20 hidden min-h-0 w-[min(100%,var(--site-rail))] min-[1685px]:flex min-[1685px]:min-h-svh min-[1685px]:flex-col",
        )}
      >
        <div className="pointer-events-auto flex min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-x-hidden px-[max(1rem,3.3vw)] pt-[var(--rail-pt)] pb-[var(--rail-padding-bottom)] min-[1685px]:px-[var(--rail-padding-x)]">
          <Link
            href="/"
            className="type-display-h1 block min-w-0 max-w-full shrink-0 leading-tight whitespace-nowrap text-black"
          >
            Raivis Deutschman
          </Link>
          <nav
            className="mt-[var(--rail-logo-nav-gap)] flex flex-col gap-[var(--rail-nav-link-gap)]"
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="type-display-nav text-black transition-opacity hover:opacity-60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="type-display-copyright mt-auto hidden sm:block">
            © RAIVIS DEUTSCHMAN
          </p>
        </div>
      </aside>

      <Link
        href="/cart"
        className={cn(
          "fixed right-[max(1rem,2.4vw)] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 hidden text-black min-[1685px]:flex",
          "h-10 min-w-10 items-center justify-center rounded-full border border-transparent bg-white shadow-none",
          "transition-colors hover:border-black/10",
        )}
        aria-label="Shopping cart"
      >
        <CartIcon className="h-8 w-[27px] shrink-0" />
      </Link>

      <div
        className={cn(
          /* No z-index here: fixed overlays inside children (e.g. curate lightbox) must not be
           * trapped below chrome (desktop cart z-30, mobile header z-40). */
          "relative flex min-h-screen flex-col pl-0 min-[1685px]:pl-[var(--site-rail)]",
          /* Clear fixed mobile header: safe-area + extra top inset + title + gap + nav (~6.75rem). */
          "max-[1684px]:pt-[calc(max(1rem,env(safe-area-inset-top,0px))+6.75rem)] min-[1685px]:pt-0",
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <footer
          className={cn(
            "flex shrink-0 items-center justify-between gap-4 border-t border-neutral-100 bg-white px-4 py-4 sm:px-6 min-[1685px]:hidden",
            "pb-[max(1rem,env(safe-area-inset-bottom))] pt-4",
          )}
          role="contentinfo"
          aria-label="Site"
        >
          <p className="type-display-copyright min-w-0 text-left">© RAIVIS DEUTSCHMAN</p>
          <Link
            href="/cart"
            className={cn(
              "flex h-11 min-w-11 shrink-0 touch-manipulation items-center justify-center rounded-full",
              "border border-transparent text-black transition-colors hover:border-black/10",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40",
            )}
            aria-label="Shopping cart"
          >
            <CartIcon className="h-7 w-[23px] shrink-0" />
          </Link>
        </footer>
      </div>
    </div>
  );
}
