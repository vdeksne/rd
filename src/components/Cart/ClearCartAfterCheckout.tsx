"use client";

import { useEffect } from "react";
import { useCart } from "@/components/Cart/CartContext";

/** Clears persisted cart when returning from Stripe Checkout (`session_id` in URL). */
export function ClearCartAfterCheckout({ sessionId }: { sessionId?: string }) {
  const { clear } = useCart();

  useEffect(() => {
    if (!sessionId) return;
    clear();
  }, [sessionId, clear]);

  return null;
}
