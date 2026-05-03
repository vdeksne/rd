import { CartProvider } from "@/components/cart/cart-context";
import { SiteChrome } from "@/components/site/site-chrome";
import { getMergedArtworks, getMergedPrimaryNav } from "@/lib/site-content";
import "../neue-haas-font-face.css";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = getMergedPrimaryNav();
  const artworks = getMergedArtworks();

  return (
    <CartProvider artworks={artworks}>
      <SiteChrome navItems={navItems}>{children}</SiteChrome>
    </CartProvider>
  );
}
