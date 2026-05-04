"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Ui/Button";
import { useCart } from "@/components/Cart/CartContext";

export function AddToCart({ slug }: { slug: string }) {
  const { add } = useCart();
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      className="type-gallery-caption h-auto rounded-none border border-black bg-transparent px-[clamp(1.25rem,4vw,1.75rem)] py-[clamp(0.375rem,2vw,0.5rem)] normal-case tracking-[0.06em] text-black shadow-none hover:bg-black hover:text-white"
      onClick={() => {
        add(slug, 1);
        router.push("/cart");
      }}
    >
      Add to cart
    </Button>
  );
}
