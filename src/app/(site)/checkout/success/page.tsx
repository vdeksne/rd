import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto max-w-lg px-6 py-24 text-center">
      <h1 className="type-site-display text-2xl font-semibold">Thank you</h1>
      <p className="mt-4 text-sm font-light text-neutral-600">
        Your order is confirmed when Stripe redirects here after a successful
        payment. Connect webhooks to Supabase for durable order records.
      </p>
      <Link href="/curate" className="mt-8 inline-block text-sm underline">
        Continue browsing
      </Link>
    </main>
  );
}
