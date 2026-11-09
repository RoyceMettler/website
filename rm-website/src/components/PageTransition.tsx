// src/components/PageTransition.tsx
//
// Directional page transitions. Portfolio ("/") sits above every other page:
//   "/"   -> lower : Portfolio leaves upward, the new page rises from below.
//   lower -> "/"   : the page leaves downward, Portfolio drops in from above.
//   lower -> lower : a short crossfade with a small vertical nudge.
// Direction is derived from the two paths, never from history, so Back and
// Forward behave the same as clicking a link. A direct load plays nothing.

import React, { createContext, useContext, useEffect, useState } from "react";
import { motion, type Transition, type Variants } from "framer-motion";
import ScrollManager from "./ScrollManager";

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
const ENTER: Transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };
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
        custom={custom}
        variants={isHome ? homePageVariants : lowerPageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {/* Mounts with the page, i.e. after the previous page's exit, so the
            scroll reset never jumps the outgoing page. Must stay before
            `children` so its effect runs before the page's own effects. */}
        <ScrollManager path={path} from={from} />
        {children}
      </motion.div>
    </PageTransitionContext.Provider>
  );
};

export default PageTransition;
