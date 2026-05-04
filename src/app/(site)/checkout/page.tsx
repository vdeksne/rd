import { CheckoutClient } from "./checkout-client";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-white max-[1684px]:pt-0 min-[1685px]:pt-(--home-hero-top)">
      <CheckoutClient />
    </main>
  );
}
