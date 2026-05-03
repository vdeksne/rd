export type SiteNavItem = { href: string; label: string };

export const SITE_PRIMARY_NAV = [
  { href: "/portfolio", label: "Residue" },
  { href: "/curate", label: "Curate" },
  { href: "/about", label: "Myth" },
] as const satisfies readonly SiteNavItem[];

export type SitePrimaryNavItem = (typeof SITE_PRIMARY_NAV)[number];
