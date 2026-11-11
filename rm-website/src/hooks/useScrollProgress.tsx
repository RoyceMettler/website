// src/hooks/useScrollProgress.tsx

import { useLayoutEffect, useState } from 'react';

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollOpacity, setScrollOpacity] = useState(0);

  // A layout effect, so the starting position is applied before the first
  // paint (the page may arrive already scrolled down to the carousel).
  useLayoutEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;

      const progress = maxScroll > 0
        ? Math.min(scrollY / maxScroll, 1)
        : 0;

      setScrollProgress(progress);
      setScrollOpacity(scrollY);
    };

    window.addEventListener('scroll', onScroll);
    // Read the starting position too: ScrollManager may already have scrolled
    // (e.g. back to the carousel) before this listener existed.
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrollProgress, scrollOpacity };
}