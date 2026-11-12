// src/hooks/useInitialAnimations.tsx

import { useEffect, useState } from "react";

/**
 * Portfolio's load-in on desktop: the hero appears, then the carousel drops
 * in. `skip`: everything is in place from the very first render (arriving by a
 * page transition, or a layout swapped in later), so nothing plays.
 */
export function useInitialAnimations(skip = false) {
  const [showHero, setShowHero] = useState(skip);
  const [showCarousel, setShowCarousel] = useState(skip);

  useEffect(() => {
    if (skip) return;
    const heroTimer = setTimeout(() => setShowHero(true), 0);
    const carouselTimer = setTimeout(() => setShowCarousel(true), 100);
    return () => {
      clearTimeout(heroTimer);
      clearTimeout(carouselTimer);
    };
  }, [skip]);

  return { showHero, showCarousel };
}
