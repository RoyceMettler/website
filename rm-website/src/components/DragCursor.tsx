// src/components/DragCursor.tsx
//
// A round "Drag or click" badge that follows the mouse while it hovers one of
// the carousel's cards, appearing as that card starts its hover scale-up. It
// sits to the cursor's left along the carousel's tilt (text kept level). Rendered into
// <body> so the carousel's scaled/translated wrappers can't offset it, and
// only for a mouse (never on touch screens).

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";

const SIZE = 92;
/** Distance from the cursor to the badge's centre. */
const GAP = 78;
/** Bridge the small gaps between neighbouring cards without a flicker. */
const HIDE_DELAY_MS = 140;
/** Same as Card's CLICK_TOLERANCE: more movement than this is a drag. */
const CLICK_TOLERANCE = 5;

type Props = {
  targetRef: React.RefObject<HTMLElement | null>;
  /** The carousel's z-rotation in degrees (three.js: negative = clockwise). */
  tiltDeg: number;
  /** False while the hero is on screen; the badge then never shows. */
  enabled: boolean;
};

const DragCursor: React.FC<Props> = ({ targetRef, tiltDeg, enabled }) => {
  const reduced = useReducedMotion();
  // False while Portfolio is leaving in a page transition.
  const isPresent = useIsPresent();
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  // Live, not read once: hybrid devices (and DevTools emulation) can switch.
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  // Soft, trailing follow: the badge glides in behind the cursor.
  const follow = { stiffness: 110, damping: 20, mass: 1 };
  const springX = useSpring(rawX, follow);
  const springY = useSpring(rawY, follow);

  // Step back along the ring's tilt line: left and, for a clockwise tilt, up.
  const tilt = (tiltDeg * Math.PI) / 180;
  const offsetX = -GAP * Math.cos(tilt);
  const offsetY = GAP * Math.sin(tilt);

  const liveRef = useRef(false);
  useEffect(() => {
    liveRef.current = enabled && isPresent;
  }, [enabled, isPresent]);

  useEffect(() => {
    if (!canHover) return;
    let x = 0;
    let y = 0;
    let isMouse = false; // last pointer was a mouse (not touch or pen)
    let inside = false; // pointer is inside the window
    let placed = false;
    let down = false;
    let downX = 0;
    let downY = 0;
    let dragged = false; // moved past CLICK_TOLERANCE during this press
    let shown = false;
    let lostAt: number | null = null;
    let clickedCard: Element | null = null;
    let frame = 0;

    const show = (next: boolean) => {
      lostAt = null;
      if (next !== shown) setVisible((shown = next));
    };

    // Checked every frame, since the ring turns under a still cursor. The
    // hovered card is the one useCardHover has marked (it hit-tests every
    // frame too, because CSS :hover goes stale until the mouse moves).
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const target = targetRef.current;
      if (!target || !liveRef.current || !isMouse || !inside || document.hidden) return show(false);

      if (down) {
        // Never pop in mid-drag; keep a badge that was already up while the
        // pointer stays on the carousel.
        if (shown) {
          const under = document.elementFromPoint(x, y);
          if (!(under && target.contains(under))) show(false);
        }
        return;
      }

      // useCardHover already hit-tests once a frame; read its mark rather
      // than hit-testing again.
      const card = target.querySelector('a[data-hover="true"]');
      if (clickedCard && card !== clickedCard) clickedCard = null;
      const live = card && card !== clickedCard ? card : null;

      if (shown) {
        if (live) {
          lostAt = null;
          return;
        }
        lostAt ??= performance.now();
        if (performance.now() - lostAt >= HIDE_DELAY_MS) show(false);
        return;
      }
      // Appear as soon as a card is hovered, as it starts to grow.
      if (live) show(true);
    };
    frame = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      isMouse = e.pointerType === "mouse";
      inside = true;
      // A press whose release we never saw (a native image/link drag, a
      // context menu): no button is down any more, so end it.
      if (down && (e.buttons & 1) === 0) onUp();
      if (down && Math.hypot(e.clientX - downX, e.clientY - downY) > CLICK_TOLERANCE) dragged = true;
      x = e.clientX;
      y = e.clientY;
      rawX.set(x);
      rawY.set(y);
      if (!placed) {
        placed = true;
        springX.jump(x);
        springY.jump(y);
      }
    };
    const onDown = (e: PointerEvent) => {
      isMouse = e.pointerType === "mouse";
      if (e.button !== 0) return;
      down = true;
      dragged = false;
      downX = e.clientX;
      downY = e.clientY;
      setPressed(true);
    };
    const onUp = () => {
      down = false;
      setPressed(false);
    };
    // A click on a card navigates away (or opens a new tab); hide the badge
    // and keep it off that card until the pointer leaves it. A drag also ends
    // in a click event, and keyboard clicks have no position: ignore both.
    const onClick = (e: MouseEvent) => {
      // Same rule as Card.tsx: any movement past the tolerance made it a drag.
      if (e.detail === 0 || dragged) return;
      const card = e.target instanceof Element ? e.target.closest("a") : null;
      if (card && targetRef.current?.contains(card)) {
        clickedCard = card;
        show(false);
      }
    };
    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget) return; // still inside the page
      inside = false;
      placed = false;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onUp);
    window.addEventListener("dragend", onUp);
    window.addEventListener("click", onClick, true);
    document.addEventListener("mouseout", onOut);
    return () => {
      cancelAnimationFrame(frame);
      // A later run starts with shown = false; keep React state in step.
      setVisible(false);
      setPressed(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
      window.removeEventListener("dragend", onUp);
      window.removeEventListener("click", onClick, true);
      document.removeEventListener("mouseout", onOut);
    };
  }, [canHover, targetRef, rawX, rawY, springX, springY]);

  if (!canHover) return null;

  return createPortal(
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[2147483647]"
      style={{
        x: reduced ? rawX : springX,
        y: reduced ? rawY : springY,
      }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: pressed ? 0.85 : 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={
              reduced
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 500, damping: 30 }
            }
            className="flex items-center justify-center rounded-full border border-white/20 bg-neutral-400/30 text-center text-sm font-semibold leading-tight text-white shadow-lg backdrop-blur-md"
            style={{
              width: SIZE,
              height: SIZE,
              marginLeft: offsetX - SIZE / 2,
              marginTop: offsetY - SIZE / 2,
            }}
          >
            Drag
            <br />
            or click
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>,
    document.body
  );
};

export default DragCursor;
