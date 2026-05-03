import Stripe from "stripe";

/** Server-only Stripe client — null when STRIPE_SECRET_KEY is unset (builds/UI still work). */
export function getStripe(): Stripe | null {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) return null;
  return new Stripe(secret, { typescript: true });
}
