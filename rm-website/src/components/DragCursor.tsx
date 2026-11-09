// src/components/DragCursor.tsx
//
// A round "Drag or click" badge that follows the mouse while it is over the
// carousel, sitting to the cursor's left along the carousel's tilt (text kept level). Rendered
// into <body> so the carousel's scaled/translated wrappers can't offset it,
// and hidden on touch-only devices.

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

const SIZE = 80;
/** Distance from the cursor to the badge's centre. */
const GAP = 56;
/** How far either side of a card (px) still counts as the strip of cards. */
const BAND_SLACK = 40;

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
    let lastX = -1;
    let lastY = -1;
    let suppressed = false; // after a click, until the mouse moves again
    let pressedNow = false;
    let shown = false;
    const show = (next: boolean) => {
      if (next !== shown) setVisible((shown = next));
    };

    // Is the cursor within the strip of cards? The cards' own rects near the
    // cursor's x give the strip's top and bottom there, so the gaps between
    // neighbouring cards count too, but the empty space above and below
    // doesn't.
    const overCardBand = (target: HTMLElement) => {
      let top = Infinity;
      let bottom = -Infinity;
      target.querySelectorAll("a").forEach((card) => {
        const r = card.getBoundingClientRect();
        // Skip hidden cards and ones swinging past the camera, whose
        // projected rects balloon to many times the screen size.
        if (r.width === 0 || r.width > window.innerWidth * 0.7 || r.height > window.innerHeight * 0.7) return;
        if (lastX < r.left - BAND_SLACK || lastX > r.right + BAND_SLACK) return;
        top = Math.min(top, r.top);
        bottom = Math.max(bottom, r.bottom);
      });
      return lastY >= top && lastY <= bottom;
    };

    // Also require the carousel to be what's actually under the cursor, so
    // the badge stays off the hero card and the navbar.
    const update = () => {
      const target = targetRef.current;
      if (!enabledRef.current) return show(false);
      if (!target || lastX < 0) return;
      // Mid-drag the cursor may wander off the strip; keep the badge with it.
      if (pressedNow && shown) return;
      const el = document.elementFromPoint(lastX, lastY);
      show(!suppressed && !!el && target.contains(el) && overCardBand(target));
    };
    updateRef.current = update;

    const onMove = (e: MouseEvent) => {
      const first = lastX < 0;
      lastX = e.clientX;
      lastY = e.clientY;
      rawX.set(lastX);
      rawY.set(lastY);
      if (first) {
        springX.jump(lastX);
        springY.jump(lastY);
      }
      suppressed = false;
      update();
    };
    const onDown = () => {
      pressedNow = true;
      setPressed(true);
    };
    const onUp = () => {
      pressedNow = false;
      setPressed(false);
      update();
    };
    // A click on a card navigates away; don't leave the badge behind.
    const onClick = () => {
      suppressed = true;
      show(false);
    };
    const onLeaveWindow = () => {
      lastX = -1;
      show(false);
    };
    // The ring keeps turning and the page can scroll under a still cursor
    // (and the hero fades out over 1s), so re-check a few times a second.
    const recheck = setInterval(update, 150);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("click", onClick);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    return () => {
      updateRef.current = () => {};
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("click", onClick);
      clearInterval(recheck);
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
            className="flex items-center justify-center rounded-full border border-white/20 bg-neutral-400/30 text-center text-[13px] font-semibold leading-tight text-white shadow-lg backdrop-blur-md"
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
