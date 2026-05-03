import { NextResponse } from "next/server";
import { publicSiteOriginFromRequest } from "@/lib/public-site-url";
import { getStripe } from "@/lib/stripe";

type LineItemBody = {
  priceUsdCents: number;
  name: string;
  quantity: number;
};

/**
 * Creates a Stripe Checkout Session (hosted) — cards, Link, Apple Pay / Google Pay
 * (when enabled in the Stripe Dashboard), and regional methods where supported.
 *
 * Body: {
 *   lineItems: { priceUsdCents: number, name: string, quantity: number }[],
 *   shippingUsdCents?: number,
 *   taxUsdCents?: number,
 * }
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured (missing STRIPE_SECRET_KEY)." },
      { status: 501 },
    );
  }

  const siteUrl = publicSiteOriginFromRequest(req);

  try {
    const body = (await req.json()) as {
      lineItems?: LineItemBody[];
      shippingUsdCents?: number;
      taxUsdCents?: number;
    };

    const items = body.lineItems ?? [];
    if (!items.length) {
      return NextResponse.json({ error: "No line items" }, { status: 400 });
    }
    if (items.length > 100) {
      return NextResponse.json({ error: "Too many line items" }, { status: 400 });
    }

    for (const item of items) {
      if (
        !Number.isInteger(item.priceUsdCents) ||
        item.priceUsdCents < 1 ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 999
      ) {
        return NextResponse.json({ error: "Invalid line item" }, { status: 400 });
      }
    }

    const shippingUsdCents = Math.max(
      0,
      Math.round(Number(body.shippingUsdCents ?? 0)),
    );
    const taxUsdCents = Math.max(0, Math.round(Number(body.taxUsdCents ?? 0)));

    const stripeLineItems = items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.priceUsdCents,
        product_data: { name: item.name },
      },
    }));

    if (shippingUsdCents > 0) {
      stripeLineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: shippingUsdCents,
          product_data: { name: "Shipping" },
        },
      });
    }

    if (taxUsdCents > 0) {
      stripeLineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: taxUsdCents,
          product_data: { name: "Tax" },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
      line_items: stripeLineItems,
      // Collect what Stripe Checkout supports out of the box (modern defaults)
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      customer_creation: "if_required",
      payment_method_options: {
        card: {
          request_three_d_secure: "automatic",
        },
      },
      // Omission of payment_method_types uses Dashboard-enabled methods
      // (cards, Link, wallets, BNPL, bank debits, etc. by region).
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Checkout session missing redirect URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
