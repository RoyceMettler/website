// src/hooks/useMediaQuery.ts

import { useSyncExternalStore } from "react";

/**
 * Phones: narrower than Tailwind's `md` breakpoint (48rem), or a touch screen
 * that is very short (a phone held sideways). Keep in sync with the `phone:`
 * variant in src/styles/App.css.
 */
export const PHONE_MEDIA =
  "(max-width: 47.99rem), (pointer: coarse) and (max-height: 31.24rem)";

/** Live result of a CSS media query; re-renders when it starts/stops matching. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const useIsPhone = () => useMediaQuery(PHONE_MEDIA);

/** Phones, and any device without a mouse-like pointer to follow. */
export const NO_TILT_MEDIA = `${PHONE_MEDIA}, (hover: none)`;
