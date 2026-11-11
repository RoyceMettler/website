// src/hooks/useCardHover.ts

import { useEffect } from "react";

// Where the mouse is, tracked for the whole visit (not per carousel mount), so
// a carousel that has just mounted already knows what the mouse is resting on.
let mouseX = 0;
let mouseY = 0;
let mouseTracked = false; // a mouse (not touch) is over the page

if (typeof window !== "undefined") {
  const onPointer = (e: PointerEvent) => {
    mouseTracked = e.pointerType === "mouse";
    mouseX = e.clientX;
    mouseY = e.clientY;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });
  document.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget) mouseTracked = false; // left the window
  });
}

/**
 * Marks the carousel card that is under the mouse with data-hover="true".
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
      if (!container || !mouseTracked || document.hidden) return mark(null);
      const el = document.elementFromPoint(mouseX, mouseY);
      mark(el && container.contains(el) ? el.closest("a") : null);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      mark(null);
    };
  }, [containerRef]);
}
