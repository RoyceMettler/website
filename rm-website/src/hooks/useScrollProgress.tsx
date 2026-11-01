// src/hooks/useScrollProgress.tsx

import { useEffect, useState } from 'react';

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollOpacity, setScrollOpacity] = useState(0);

  useEffect(() => {
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
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrollProgress, scrollOpacity };
}