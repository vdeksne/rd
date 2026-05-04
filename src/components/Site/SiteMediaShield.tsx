"use client";

import { useEffect, useRef, type ReactNode } from "react";

function targetImg(el: EventTarget | null, root: HTMLElement): HTMLImageElement | null {
  if (!(el instanceof Node) || !root.contains(el)) return null;
  if (el instanceof HTMLImageElement) return el;
  if (el instanceof HTMLElement) {
    const img = el.closest("img");
    if (img instanceof HTMLImageElement && root.contains(img)) return img;
  }
  return null;
}

/**
 * Site-only friction against casual save/copy/drag of artwork photos (context menu,
 * drag-to-desktop, selection). Does not stop screenshots or determined extraction.
 */
export function SiteMediaShield({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onContextMenu = (e: MouseEvent) => {
      if (targetImg(e.target, root)) e.preventDefault();
    };

    const onDragStart = (e: DragEvent) => {
      if (targetImg(e.target, root)) e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu, true);
    document.addEventListener("dragstart", onDragStart, true);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu, true);
      document.removeEventListener("dragstart", onDragStart, true);
    };
  }, []);

  return (
    <div ref={rootRef} className="site-public-media-root min-h-screen">
      {children}
    </div>
  );
}
