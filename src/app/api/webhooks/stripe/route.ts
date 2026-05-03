import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Stripe webhooks — verify signature, then react to Checkout completion.
 *
 * Local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
 * Production: add endpoint URL in Stripe Dashboard → Developers → Webhooks.
 *
 * Recommended events for this app: checkout.session.completed
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook not configured (STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET)." },
      { status: 501 },
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe-Signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // Extend: write to Supabase, email receipt, decrement edition counts, etc.
      if (process.env.NODE_ENV === "development") {
        console.info("[stripe] checkout.session.completed", session.id, session.customer_email ?? "");
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
