"use client";

import { usePathname } from "next/navigation";
import { SiteMobileBar } from "@/components/site/site-mobile-bar";
import type { SiteNavItem } from "@/lib/site-nav";

/** Remount on route change so the drawer closes without syncing state in an effect. */
export function SiteMobileChromeNav({ nav }: { nav: readonly SiteNavItem[] }) {
  const pathname = usePathname();
  return <SiteMobileBar key={pathname} nav={nav} />;
}
