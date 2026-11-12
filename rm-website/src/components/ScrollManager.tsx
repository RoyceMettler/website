// src/components/ScrollManager.tsx

import { useLayoutEffect } from "react";
import { PHONE_MEDIA } from "../hooks/useMediaQuery";

// We place the scroll ourselves once the new page mounts. Left on "auto", the
// browser restores scroll on Back/Forward and jumps the page that's leaving.
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// How far Portfolio was scrolled when it was last left (null until then).
// Coming back to it, from any page and by any route, puts it back there: at
// the hero if you left from the hero, at the carousel if you left from the
// carousel, at the same card in the phone list. A reload starts at the top.
let homeScroll: number | null = null;

/**
 * Rendered by PageTransition, so it mounts together with each page: after the
 * previous page has finished leaving and before the new page's own effects
 * run. A layout effect, so the scroll is in place before the new page's first
 * frame is painted. `path` and `from` are normalized (no trailing slash).
 */
const ScrollManager: React.FC<{ path: string; from: string | null }> = ({ path, from }) => {
  useLayoutEffect(() => {
    const isHome = path === "/";
    // The desktop landing page hides its scrollbar; the phone list is a
    // normal scrolling page and keeps it.
    document.documentElement.classList.toggle(
      "hide-landing-scrollbar",
      isHome && !window.matchMedia(PHONE_MEDIA).matches
    );

    const top = isHome && from !== null && homeScroll !== null ? homeScroll : 0;
    window.scrollTo({ top, behavior: "auto" });

    if (!isHome) return;
    // Portfolio is being removed (its exit has played, the next page is about
    // to mount and reset the scroll): remember where it was.
    return () => {
      homeScroll = window.scrollY;
    };
    // Runs once per page mount; the wrapper is keyed by path.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default ScrollManager;
