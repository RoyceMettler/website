// src/components/CarouselKeepAlive.tsx
//
// Keeps the 3D carousel alive while Portfolio is not on screen.
//
// Building the carousel is the expensive part of showing Portfolio: a
// react-three-fiber canvas plus thirteen cards that each mount a React root
// of their own. When it was rebuilt every time Portfolio came back, the work
// landed in the middle of the page's slide-in: the slide stuttered, and cards
// showed for a frame at full size before they had been placed in 3D.
//
// So the carousel is built once, inside an element of its own, and that
// element is moved rather than rebuilt: into Portfolio's layout while
// Portfolio is mounted (CarouselSlot), and into a hidden holder the rest of
// the time. Its frame loop is stopped while it is in the holder, so the ring
// is exactly where it was left when Portfolio comes back.

import React, { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useIsPresent } from "framer-motion";
import Carousel3D from "./Carousel3D";

type State = {
  /** Portfolio's desktop layout has been shown at least once. */
  built: boolean;
  /** The carousel is in Portfolio's layout right now (not in the holder). */
  shown: boolean;
  hintEnabled: boolean;
};

let state: State = { built: false, shown: false, hintEnabled: false };
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

function update(patch: Partial<State>) {
  const next = { ...state, ...patch };
  if (
    next.built === state.built &&
    next.shown === state.shown &&
    next.hintEnabled === state.hintEnabled
  ) {
    return;
  }
  state = next;
  listeners.forEach((listener) => listener());
}

/** The element the carousel lives in, and where it waits while unseen. */
let host: HTMLDivElement | null = null;
let holder: HTMLDivElement | null = null;

function elements() {
  if (!host || !holder) {
    host = document.createElement("div");
    host.className = "w-full";
    holder = document.createElement("div");
    holder.setAttribute("aria-hidden", "true");
    // As wide as the carousel is on Portfolio, so moving it in and out never
    // changes its size. Not painted, not clickable, not reachable by Tab.
    holder.style.cssText =
      "position:fixed;left:0;top:0;width:100vw;height:0;overflow:hidden;visibility:hidden;pointer-events:none";
    holder.append(host);
    document.body.append(holder);
  }
  return { host, holder };
}

/**
 * Owns the carousel. Rendered once, outside the pages, so it stays mounted
 * for the whole visit. Renders nothing until Portfolio's desktop layout first
 * asks for the carousel (phones never do).
 */
export const CarouselKeeper: React.FC = () => {
  const { built, shown, hintEnabled } = useSyncExternalStore(subscribe, () => state);
  if (!built) return null;
  return createPortal(<Carousel3D active={shown} hintEnabled={hintEnabled} />, elements().host);
};

/**
 * Where the carousel appears: rendered by Portfolio's desktop layout in the
 * place the carousel itself used to be rendered.
 */
export const CarouselSlot: React.FC<{ hintEnabled: boolean }> = ({ hintEnabled }) => {
  const ref = useRef<HTMLDivElement>(null);
  // False while Portfolio is leaving in a page transition. The carousel is
  // rendered outside the page now, so it can't see that for itself.
  const isPresent = useIsPresent();

  useLayoutEffect(() => {
    const { host, holder } = elements();
    ref.current?.append(host);
    update({ built: true, shown: true });
    return () => {
      holder.append(host);
      update({ shown: false, hintEnabled: false });
    };
  }, []);

  useEffect(() => {
    update({ hintEnabled: hintEnabled && isPresent });
  }, [hintEnabled, isPresent]);

  return <div ref={ref} className="w-full" />;
};
