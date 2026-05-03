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
          "pointer-events-none fixed inset-y-0 left-0 z-20 hidden min-h-0 w-[min(100%,var(--site-rail))] lg:flex lg:min-h-svh lg:flex-col",
        )}
      >
        <div className="pointer-events-auto flex min-h-0 min-w-0 max-w-full flex-1 flex-col px-[max(1rem,3.3vw)] pt-[clamp(2rem,5vw,58px)] pb-8 lg:px-6">
          <Link
            href="/"
            className={cn(
              "type-display-h1 flex min-w-0 max-w-full flex-col justify-center leading-tight text-black",
              "text-balance whitespace-normal xl:whitespace-nowrap",
              "min-[1920px]:h-29 min-[1920px]:w-59.75",
            )}
          >
            Raivis Deutschman
          </Link>
          <nav
            className="mt-[clamp(1.5rem,4vw,3.5rem)] flex flex-col gap-[22px]"
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
          "fixed right-[max(1rem,2.4vw)] top-[max(1rem,3.9vh)] z-30 hidden text-black lg:flex",
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
           * trapped below chrome (cart z-30, mobile header z-40). */
          "relative flex min-h-screen flex-col pl-0 lg:pl-[var(--site-rail)]",
          "max-lg:pt-[calc(env(safe-area-inset-top,0px)+3.75rem)] lg:pt-0",
        )}
      >
        <div className="flex-1">{children}</div>
        <p className="type-display-copyright px-6 pb-8 sm:hidden">
          © RAIVIS DEUTSCHMAN
        </p>
      </div>
    </div>
  );
}
