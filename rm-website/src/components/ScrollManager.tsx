// src/components/ScrollManager.tsx

import { useEffect } from "react";

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
 * run. `path` and `from` are normalized (no trailing slash).
 */
const ScrollManager: React.FC<{ path: string; from: string | null }> = ({ path, from }) => {
  useEffect(() => {
    const isHome = path === "/";
    document.documentElement.classList.toggle("hide-landing-scrollbar", isHome);

    if (isHome && from !== null) {
      // Arriving by navigation: the page transition is the entrance, so skip
      // the hero/carousel load-in that plays on a direct load.
      sessionStorage.setItem("skipHeroAnimation", "true");
    }

    if (isHome && from !== null && scrollToBottomSources.includes(from)) {
      // Back from a project page: land on the carousel.
      window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    // Runs once per page mount; the wrapper is keyed by path.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default ScrollManager;
