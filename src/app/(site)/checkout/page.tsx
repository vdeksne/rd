import { CheckoutClient } from "./checkout-client";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-white max-lg:pt-0 lg:pt-[max(4rem,10vh)]">
      <CheckoutClient />
    </main>
  );
}
