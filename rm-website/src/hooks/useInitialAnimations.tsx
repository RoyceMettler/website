// src/hooks/useInitialAnimations.tsx

import { useEffect, useState } from "react";

/** `skip`: show everything at once (e.g. a layout swapped in after arrival). */
export function useInitialAnimations(skip = false) {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showHero, setShowHero] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    const skipFlag = sessionStorage.getItem("skipHeroAnimation") === "true";

    if (skip || skipFlag) {
      sessionStorage.removeItem("skipHeroAnimation");
      setPageLoaded(true);
      // Keep the hero mounted/visible so users can scroll up to reveal it
      // after returning from a project page in production builds.
      setShowHero(true);
      setShowCarousel(true);
      return;
    }

    setPageLoaded(true);

    const heroTimer = setTimeout(() => {
      setShowHero(true);
    }, 0);

    const carouselTimer = setTimeout(() => {
      setShowCarousel(true);
    }, 100);

    return () => {
      clearTimeout(heroTimer);
      clearTimeout(carouselTimer);
    };
    // Decided once, at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { pageLoaded, showHero, showCarousel };
}
