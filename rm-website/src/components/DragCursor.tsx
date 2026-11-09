// src/components/DragCursor.tsx
//
// A small round "Drag or click" badge that follows the mouse while it is over
// the carousel. Rendered into <body> so the carousel's scaled/translated
// wrappers can't offset it, and hidden on touch-only devices.

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

const SIZE = 64;

const DragCursor: React.FC<{ targetRef: React.RefObject<HTMLElement | null> }> = ({
  targetRef,
}) => {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [canHover] = useState(
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const springX = useSpring(rawX, { stiffness: 600, damping: 40, mass: 0.5 });
  const springY = useSpring(rawY, { stiffness: 600, damping: 40, mass: 0.5 });

  useEffect(() => {
    if (!canHover) return;
    let lastX = -1;
    let lastY = -1;
    let suppressed = false; // after a click, until the mouse moves again

    // Show only when the carousel is what's actually under the cursor, so the
    // badge stays away from the hero card and the navbar.
    const update = () => {
      const target = targetRef.current;
      if (!target || lastX < 0) return;
      const el = document.elementFromPoint(lastX, lastY);
      setVisible(!suppressed && !!el && target.contains(el));
    };

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
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    // A click on a card navigates away; don't leave the badge behind.
    const onClick = () => {
      suppressed = true;
      setVisible(false);
    };
    const onLeaveWindow = () => setVisible(false);
    // Re-check once scrolling settles, and again after the hero's 1s
    // fade/visibility transition, which keeps it hit-testable meanwhile.
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    let lateTimer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      clearTimeout(scrollTimer);
      clearTimeout(lateTimer);
      scrollTimer = setTimeout(update, 80);
      lateTimer = setTimeout(update, 1100);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimer);
      clearTimeout(lateTimer);
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
            className="flex items-center justify-center rounded-full bg-indigo-500 text-center text-[11px] font-semibold leading-tight text-white shadow-lg"
            style={{
              width: SIZE,
              height: SIZE,
              marginLeft: -SIZE / 2,
              marginTop: -SIZE / 2,
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
