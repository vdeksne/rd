import Link from "next/link";
import { ClearCartAfterCheckout } from "@/components/cart/clear-cart-after-checkout";
import { getStripe } from "@/lib/stripe";

export const metadata = { title: "Thank you" };

type Props = { searchParams: Promise<{ session_id?: string }> };

function abbreviateSessionId(id: string) {
  if (id.length <= 28) return id;
  return `${id.slice(0, 18)}…${id.slice(-8)}`;
}

function SuccessCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="28" cy="28" r="27" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M17 29l8 8 14-17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 2.5l7 2.6v6.4c0 5.5-3.8 10.7-7 11.5-3.2-.8-7-6-7-11.5V5.1l7-2.6z"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Thank-you / confirmation — aligns with Checkout order summary frame (Raivis_WebDev ~112:1411). */
export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;

  let customerEmail: string | null = null;
  let paid = false;
  const stripe = getStripe();
  if (stripe && sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      customerEmail =
        session.customer_details?.email ?? session.customer_email ?? null;
    } catch {
      /* invalid or expired session id */
    }
  }

  return (
    <main className="min-h-screen bg-white max-lg:pt-0 lg:pt-[max(4rem,10vh)]">
      <ClearCartAfterCheckout sessionId={sessionId} />
      <div className="mx-auto flex w-full max-w-[440px] flex-col px-4 py-12 sm:px-0 sm:py-16">
        <div className="border border-[#e0e0e0] bg-white px-5 pb-10 pt-10 font-sans shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:px-8 sm:pt-12 sm:pb-12">
          <div className="flex flex-col items-center text-center">
            <SuccessCheckIcon className="h-14 w-14 shrink-0 text-emerald-700" />
            <h1 className="mt-6 text-[20px] font-bold leading-tight tracking-tight text-black">
              Thank you
            </h1>
            <p className="mt-3 max-w-[320px] text-[13px] font-normal leading-[1.55] text-[#666]">
              {paid && customerEmail ? (
                <>
                  Your payment was successful. We&apos;ve received your order
                  and will follow up with shipping details. A receipt was sent
                  to{" "}
                  <span className="font-semibold text-[#444]">
                    {customerEmail}
                  </span>
                  .
                </>
              ) : paid ? (
                <>
                  Your payment was successful. We&apos;ve received your order
                  and will follow up with shipping details shortly.
                </>
              ) : (
                <>
                  If you completed payment on the previous step, your order is
                  being processed. Keep this page for your records, or check
                  your email for Stripe&apos;s receipt.
                </>
              )}
            </p>

            {sessionId ? (
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#999]">
                Order reference · {abbreviateSessionId(sessionId)}
              </p>
            ) : null}

            <Link
              href="/curate"
              className="mt-9 flex min-h-[50px] w-full max-w-[280px] items-center justify-center bg-black px-6 text-[13px] font-bold tracking-tight text-white transition hover:bg-neutral-900"
            >
              Continue shopping
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-2 text-[12px] font-normal text-[#767676]">
            <Link
              href="/legal/returns"
              className="underline decoration-[#767676] underline-offset-2 hover:text-black"
            >
              Return Policy
            </Link>
            <Link
              href="/legal/terms"
              className="underline decoration-[#767676] underline-offset-2 hover:text-black"
            >
              Terms of Service
            </Link>
          </div>

          <div className="mt-10 flex flex-col items-center gap-2 border-t border-[#eeeeee] pt-8">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-black">
              <ShieldCheckIcon className="h-5 w-5 shrink-0 text-emerald-700" />
              Secure payment processed by Stripe
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
