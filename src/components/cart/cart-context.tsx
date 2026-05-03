"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Artwork } from "@/lib/demo-content";

export type CartLine = {
  slug: string;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  artworks: Artwork[];
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "raivis-cart-v1";

function loadLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({
  children,
  artworks,
}: {
  children: React.ReactNode;
  artworks: Artwork[];
}) {
  const [lines, setLines] = useState<CartLine[]>([]);

  /* After mount only — keeps server / client HTML identical (empty cart) then restores. */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only available after mount; avoids hydration mismatch vs reading in useState init
    setLines(loadLines());
  }, []);

  const persist = useCallback((next: CartLine[]) => {
    setLines(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const add = useCallback(
    (slug: string, qty = 1) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.slug === slug);
        let next: CartLine[];
        if (existing) {
          next = prev.map((l) =>
            l.slug === slug ? { ...l, qty: l.qty + qty } : l,
          );
        } else {
          next = [...prev, { slug, qty }];
        }
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [setLines],
  );

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) => {
      const next =
        qty <= 0
          ? prev.filter((l) => l.slug !== slug)
          : prev.map((l) => (l.slug === slug ? { ...l, qty } : l));
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => {
      const next = prev.filter((l) => l.slug !== slug);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const value = useMemo(
    () => ({
      lines,
      artworks,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, artworks, add, setQty, remove, clear],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function resolveCartArtworks(
  lines: CartLine[],
  artworks: Artwork[],
): {
  line: CartLine;
  artwork: Artwork;
}[] {
  return lines
    .map((line) => {
      const artwork = artworks.find((a) => a.slug === line.slug);
      if (!artwork) return null;
      return { line, artwork };
    })
    .filter(Boolean) as { line: CartLine; artwork: Artwork }[];
}
