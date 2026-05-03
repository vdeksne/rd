"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";

export function AddToCart({ slug }: { slug: string }) {
  const { add } = useCart();
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      className="type-site-display h-auto rounded-none border border-black bg-transparent px-6 py-2 text-[12px] font-light capitalize tracking-[0.08em] text-black shadow-none hover:bg-black hover:text-white"
      onClick={() => {
        add(slug, 1);
        router.push("/cart");
      }}
    >
      Add to cart
    </Button>
  );
}
