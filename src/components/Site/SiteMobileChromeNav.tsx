import { SiteMobileBar } from "@/components/Site/SiteMobileBar";
import type { SiteNavItem } from "@/lib/site-nav";

export function SiteMobileChromeNav({ nav }: { nav: readonly SiteNavItem[] }) {
  return <SiteMobileBar nav={nav} />;
}
