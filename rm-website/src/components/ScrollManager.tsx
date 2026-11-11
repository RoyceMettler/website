// src/components/ScrollManager.tsx

import { useLayoutEffect } from "react";
import { pageTop } from "../utils/dom";
import { PHONE_MEDIA } from "../hooks/useMediaQuery";

// We place the scroll ourselves once the new page mounts. Left on "auto", the
// browser restores scroll on Back/Forward and jumps the page that's leaving.
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

export const scrollToBottomSources = [
  "/ai-engineer-at-vitu",
  "/ai-research",
  "/multimania",
  "/blog",
  "/squingo",
  "/unipsycho",
  "/tech-help",
  "/district-65",
  "/crafty",
  "/police-complaints",
  "/model-un",
  "/music",
];

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

    if (isHome && from !== null && scrollToBottomSources.includes(from)) {
      // Back from a project page: on phones, land on that project's card in
      // the list; on desktop, on the carousel at the bottom.
      const card = document.querySelector<HTMLElement>(`[data-card-link="${CSS.escape(from)}"]`);
      if (card) {
        const top = pageTop(card) - (window.innerHeight - card.offsetHeight) / 2;
        window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    // Runs once per page mount; the wrapper is keyed by path.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default ScrollManager;
