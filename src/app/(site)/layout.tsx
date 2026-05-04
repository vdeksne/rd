import { CartProvider } from "@/components/cart/cart-context";
import { SiteChrome } from "@/components/site/site-chrome";
import { getMergedArtworks, getMergedPrimaryNav } from "@/lib/site-content";
import "../neue-haas-font-face.css";

/** Blob-backed overrides — force fresh server render after admin saves. */
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = await getMergedPrimaryNav();
  const artworks = await getMergedArtworks();

  return (
    <CartProvider artworks={artworks}>
      <SiteChrome navItems={navItems}>{children}</SiteChrome>
    </CartProvider>
  );
}
