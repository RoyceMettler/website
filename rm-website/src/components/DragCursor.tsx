// src/components/DragCursor.tsx
//
// A round "Drag or click" badge that follows the mouse while it hovers one of
// the carousel's cards, i.e. exactly while that card shows its own hover
// scale-up. It sits to the cursor's left along the carousel's tilt (text kept
// level). Rendered into <body> so the carousel's scaled/translated wrappers
// can't offset it, and hidden on touch-only devices.

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

const SIZE = 92;
/** Distance from the cursor to the badge's centre. */
const GAP = 78;
/** Let the hovered card start its scale-up before the badge appears. */
const SHOW_DELAY_MS = 120;
/** Bridge the small gaps between neighbouring cards without a flicker. */
const HIDE_DELAY_MS = 160;
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
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [canHover] = useState(
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );

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

  const enabledRef = useRef(enabled);
  const updateRef = useRef<() => void>(() => {});
  useEffect(() => {
    enabledRef.current = enabled;
    updateRef.current();
  }, [enabled]);

  useEffect(() => {
    if (!canHover) return;
    let suppressed = false; // after a click on a card, until the mouse moves
    let pressedNow = false;
    let downX = 0;
    let downY = 0;
    let shown = false;
    let wanted = false;
    let pending: ReturnType<typeof setTimeout> | undefined;

    // Visible exactly while a card is in its CSS :hover state, i.e. while
    // the browser is scaling that card up, so badge and card always agree.
    const update = () => {
      const target = targetRef.current;
      // Mid-drag the cursor may leave the card; keep the badge with it.
      if (pressedNow && shown) return;
      const next =
        enabledRef.current && !suppressed && !!target?.querySelector("a:hover");
      if (next === wanted) return;
      wanted = next;
      clearTimeout(pending);
      pending = setTimeout(
        () => {
          if (shown !== wanted) setVisible((shown = wanted));
        },
        next ? SHOW_DELAY_MS : HIDE_DELAY_MS
      );
    };
    updateRef.current = update;

    let placed = false;
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!placed) {
        placed = true;
        springX.jump(e.clientX);
        springY.jump(e.clientY);
      }
      suppressed = false;
      update();
    };
    const onDown = (e: MouseEvent) => {
      pressedNow = true;
      downX = e.clientX;
      downY = e.clientY;
      setPressed(true);
    };
    const onUp = () => {
      pressedNow = false;
      setPressed(false);
      update();
    };
    // A click on a card navigates away; don't leave the badge behind. A drag
    // also ends in a click event, but that one doesn't navigate.
    const onClick = (e: MouseEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > CLICK_TOLERANCE) return;
      suppressed = true;
      update();
    };
    const onLeaveWindow = () => {
      placed = false;
      suppressed = true;
      update();
    };
    // The ring keeps turning and the page can scroll under a still cursor,
    // which changes the hovered card without any mouse event.
    const recheck = setInterval(update, 150);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("click", onClick);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    return () => {
      updateRef.current = () => {};
      clearTimeout(pending);
      clearInterval(recheck);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("click", onClick);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
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
