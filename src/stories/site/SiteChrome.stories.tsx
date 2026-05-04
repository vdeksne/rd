import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CartProvider } from "@/components/Cart/CartContext";
import { SiteChrome } from "@/components/Site/SiteChrome";
import { demoArtworks } from "@/lib/demo-content";
import { SITE_PRIMARY_NAV } from "@/lib/site-nav";

const navItems = SITE_PRIMARY_NAV.map((item) => ({
  href: item.href,
  label: item.label,
}));

const meta = {
  title: "Site/SiteChrome",
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <CartProvider artworks={demoArtworks}>
        <SiteChrome navItems={navItems}>
          <Story />
        </SiteChrome>
      </CartProvider>
    ),
  ],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithPlaceholderContent: Story = {
  render: () => (
    <div className="min-h-[85vh] bg-white px-8 pt-24">
      <p className="max-w-md text-sm text-neutral-600">
        Main column — matches Figma left rail (Raivis Deutschman, Residue / Curate /
        Myth) and cart affordance.
      </p>
    </div>
  ),
};
