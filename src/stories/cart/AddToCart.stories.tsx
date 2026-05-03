import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { CartProvider } from "@/components/cart/cart-context";
import { AddToCart } from "@/components/cart/add-to-cart";
import { demoArtworks } from "@/lib/demo-content";

const meta = {
  title: "Cart/AddToCart",
  component: AddToCart,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <CartProvider artworks={demoArtworks}>
        <Story />
      </CartProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/curate/demo",
        push: fn(),
        refresh: fn(),
        prefetch: fn(),
        replace: fn(),
        back: fn(),
      },
    },
  },
  args: {
    slug: "elle-france-july-2024",
  },
} satisfies Meta<typeof AddToCart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AnotherEdition: Story = {
  args: { slug: "night-ferry" },
};
