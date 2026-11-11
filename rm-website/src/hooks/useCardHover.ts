// src/hooks/useCardHover.ts

import { useEffect } from "react";

// Where the pointer is, tracked for the whole visit (not per carousel mount),
// so a carousel that has just mounted already knows what it is resting on.
let pointerX = 0;
let pointerY = 0;
let pointerTracked = false; // a mouse or pen (not touch) is over the page

if (typeof window !== "undefined") {
  const onPointer = (e: PointerEvent) => {
    pointerTracked = e.pointerType !== "touch";
    pointerX = e.clientX;
    pointerY = e.clientY;
  };
  const lost = () => {
    pointerTracked = false;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });
  // These carry the position even when the pointer itself hasn't moved (the
  // page was scrolled under it since load): the browser's own hover refresh,
  // and the wheel.
  window.addEventListener("pointerover", onPointer, { passive: true });
  window.addEventListener(
    "wheel",
    (e) => {
      pointerTracked = true;
      pointerX = e.clientX;
      pointerY = e.clientY;
    },
    { passive: true }
  );
  // Left the window, or a pen was lifted out of range.
  document.addEventListener("pointerout", (e) => {
    if (!e.relatedTarget) lost();
  });
  window.addEventListener("pointercancel", lost);
}

/**
 * Marks the carousel card that is under the pointer with data-hover="true".
 * Card styles its hover look (scale-up, pointer cursor) from that attribute
 * rather than from CSS :hover.
 *
 * Why: the ring keeps turning under a mouse that isn't moving, and browsers
 * only refresh :hover and the cursor when the mouse moves. A card that had
 * already slid away stayed enlarged, with the pointer cursor, for a moment.
 * Hit-testing every frame keeps the card and the cursor in step with what is
 * really under the mouse (changing the stale card's `cursor` also makes the
 * browser re-pick the cursor).
 */
export function useCardHover(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    let current: Element | null = null;
    let frame = 0;

    const mark = (card: Element | null) => {
      if (card === current) return;
      current?.removeAttribute("data-hover");
      card?.setAttribute("data-hover", "true");
      current = card;
    };

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const container = containerRef.current;
      if (!container || !pointerTracked || document.hidden) return mark(null);
      const el = document.elementFromPoint(pointerX, pointerY);
      mark(el && container.contains(el) ? el.closest("a") : null);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      mark(null);
    };
  }, [containerRef]);
}
