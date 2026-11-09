// src/components/PageTransition.tsx
//
// Directional page transitions. Portfolio ("/") sits above every other page:
//   "/"   -> lower : Portfolio leaves upward, the new page rises from below.
//   lower -> "/"   : the page leaves downward, Portfolio drops in from above.
//   lower -> lower : a short crossfade with a small vertical nudge.
// Direction is derived from the two paths, never from history, so Back and
// Forward behave the same as clicking a link. A direct load plays nothing.

import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useIsPresent, type Transition, type Variants } from "framer-motion";
import ScrollManager from "./ScrollManager";
import { pageTop } from "../utils/dom";

export type Direction = "none" | "toLower" | "toHome" | "lateral";
export type TransitionCustom = { direction: Direction; reduced: boolean };

/** "/multimania/" and "/multimania" are the same page. */
export const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

export function getDirection(from: string | null, to: string): Direction {
  if (from === null || from === to) return "none";
  if (from === "/") return "toLower";
  if (to === "/") return "toHome";
  return "lateral";
}

const EXIT: Transition = { duration: 0.35, ease: [0.55, 0, 1, 0.45] };
const ENTER_SECONDS = 0.5;
const ENTER: Transition = { duration: ENTER_SECONDS, ease: [0.22, 1, 0.36, 1] };
const FADE_OUT: Transition = { duration: 0.15, ease: "easeIn" };
const FADE_IN: Transition = { duration: 0.25, ease: "easeOut" };
const REDUCED: Transition = { duration: 0.2, ease: "linear" };

// Wrapper around a lower page's content. Only lower pages get a transform
// here: a transform on an ancestor of Portfolio's fixed layers would make
// them position against the wrapper instead of the viewport.
const lowerPageVariants: Variants = {
  initial: ({ direction, reduced }: TransitionCustom) =>
    direction === "none"
      ? { opacity: 1, y: "0vh" }
      : reduced
        ? { opacity: 0, y: "0vh" }
        : direction === "lateral"
          ? { opacity: 0, y: "1.5vh" }
          : { opacity: 1, y: "100vh" },
  enter: ({ direction, reduced }: TransitionCustom) => ({
    opacity: 1,
    y: "0vh",
    transition: reduced ? REDUCED : direction === "lateral" ? FADE_IN : ENTER,
  }),
  exit: ({ direction, reduced }: TransitionCustom) =>
    reduced
      ? { opacity: 0, transition: REDUCED }
      : direction === "toHome"
        ? { y: "100vh", transition: EXIT }
        : { opacity: 0, y: "-1.5vh", transition: FADE_OUT },
};

// Portfolio's wrapper only ever fades (reduced motion); the slide is done by
// HomePage's fixed layer using `homeLayerVariants`.
const homePageVariants: Variants = {
  initial: ({ direction, reduced }: TransitionCustom) => ({
    opacity: reduced && direction !== "none" ? 0 : 1,
  }),
  enter: { opacity: 1, transition: REDUCED },
  exit: ({ reduced }: TransitionCustom) =>
    reduced ? { opacity: 0, transition: REDUCED } : {},
};

export const homeLayerVariants: Variants = {
  initial: ({ direction, reduced }: TransitionCustom) => ({
    y: direction === "toHome" && !reduced ? "-100vh" : "0vh",
  }),
  enter: { y: "0vh", transition: ENTER },
  exit: ({ reduced }: TransitionCustom) =>
    reduced ? {} : { y: "-100vh", transition: EXIT },
};

type PageTransitionState = TransitionCustom & { entered: boolean };

const PageTransitionContext = createContext<PageTransitionState>({
  direction: "none",
  reduced: false,
  entered: true,
});

export const usePageTransition = () => useContext(PageTransitionContext);

/** False while the page is still sliding in; use it to hold back fade-ins. */
export const usePageEntered = () => useContext(PageTransitionContext).entered;

/** Clip `el` to the part of it that is on screen right now. */
const clipToViewport = (el: HTMLElement) => {
  const top = Math.max(0, window.scrollY - pageTop(el));
  const bottom = `max(0px, calc(100% - ${top + window.innerHeight}px))`;
  el.style.clipPath = `inset(${top}px 0 ${bottom} 0)`;
};

/**
 * For a sliding element that is in the normal page flow (not position:fixed):
 * while it slides out, and while it slides in at a scrolled position, show
 * only the one screenful that is (or will be) in view. Otherwise a long page
 * drags the content above or below the viewport through view during the
 * slide, which reads as a scroll rather than the page leaving or arriving.
 */
export function useViewportSliceClip(
  ref: React.RefObject<HTMLElement | null>,
  enabled = true,
  /** False for a layer mounted after the page arrived (layout switch). */
  arriving = true
) {
  const isPresent = useIsPresent();
  const { direction, reduced } = useContext(PageTransitionContext);
  const leaving = useRef(false);

  // Arriving from above (Portfolio coming back), possibly at a scrolled
  // position: ScrollManager has already set the scroll (its layout effect runs
  // first), so clip to the slice the page lands on. Pages rising from below
  // always arrive at the top and need no clip.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!enabled || !arriving || !el || direction !== "toHome" || reduced) return;
    clipToViewport(el);
    // Lift it once the slide is done, or as soon as the visitor scrolls.
    const unclip = () => {
      if (!leaving.current) el.style.clipPath = "";
      cleanup();
    };
    const timer = setTimeout(unclip, (ENTER_SECONDS + 0.1) * 1000);
    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", unclip);
      window.removeEventListener("touchmove", unclip);
    };
    window.addEventListener("scroll", unclip, { passive: true });
    window.addEventListener("touchmove", unclip, { passive: true });
    return cleanup;
    // Mount only: the slice is fixed when the page arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Leaving: freeze the slice that is on screen when the exit starts.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!enabled || isPresent || !el) return;
    leaving.current = true;
    clipToViewport(el);
    // If the page comes back mid-exit (navigating straight back), unclip.
    return () => {
      leaving.current = false;
      el.style.clipPath = "";
    };
  }, [enabled, isPresent, ref]);
}

type Props = {
  /** Normalized path of the page this wrapper shows. */
  path: string;
  /** Normalized path of the page we came from, or null on a direct load. */
  from: string | null;
  direction: Direction;
  reduced: boolean;
  children: React.ReactNode;
};

const PageTransition: React.FC<Props> = ({ path, from, direction, reduced, children }) => {
  const [entered, setEntered] = useState(direction === "none");
  const custom: TransitionCustom = { direction, reduced };
  const isHome = path === "/";
  const ref = useRef<HTMLDivElement>(null);
  // Lower pages slide this wrapper. Portfolio's wrapper never moves (its
  // layers do), so it must not be clipped either.
  useViewportSliceClip(ref, !isHome);

  // Release the page's own fade-ins once the slide has (nearly) landed. A
  // timer rather than onAnimationComplete: the latter is lost when StrictMode
  // remounts the wrapper mid-animation.
  useEffect(() => {
    if (entered) return;
    const enterSeconds = reduced
      ? (REDUCED.duration as number)
      : direction === "lateral"
        ? (FADE_IN.duration as number)
        : (ENTER.duration as number) * 0.8;
    const timer = setTimeout(() => setEntered(true), enterSeconds * 1000);
    return () => clearTimeout(timer);
  }, [entered, direction, reduced]);

  return (
    <PageTransitionContext.Provider value={{ ...custom, entered }}>
      <motion.div
        ref={ref}
        custom={custom}
        variants={isHome ? homePageVariants : lowerPageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {/* Mounts with the page, i.e. after the previous page's exit, so the
            scroll reset never jumps the outgoing page. Must stay before
            `children` so its layout effect runs before the page's effects. */}
        <ScrollManager path={path} from={from} />
        {children}
      </motion.div>
    </PageTransitionContext.Provider>
  );
};

export default PageTransition;
