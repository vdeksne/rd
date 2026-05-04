import { SiteMobileBar } from "@/components/site/site-mobile-bar";
import type { SiteNavItem } from "@/lib/site-nav";

export function SiteMobileChromeNav({ nav }: { nav: readonly SiteNavItem[] }) {
  return <SiteMobileBar nav={nav} />;
}
