// src/pages/HomePage.tsx

import HeroSection from '../components/HeroSection';
import Carousel3D from '../components/Carousel3D';
import ScrollIndicator from '../components/ScrollIndicator';
import { useInitialAnimations } from '../hooks/useInitialAnimations';
import { useScrollProgress } from '../hooks/useScrollProgress';

function HomePage() {
  const { showHero, showCarousel } = useInitialAnimations();
  const { scrollProgress, scrollOpacity } = useScrollProgress();

  // Use pixel scroll (scrollOpacity) for hero offset/visibility so
  // small upward scrolls reliably reveal the hero in production builds.
  const heroOffsetY = Math.min(scrollOpacity, 300);
  const normalizedProgress = Math.min(scrollProgress, 1);
  const carouselScale = 1 + 0.2 * Math.pow(normalizedProgress, 5);
  const carouselOpacity = 0.6 + 0.4 * Math.pow(normalizedProgress, 5);

  return (
    <>

      <div className="fixed inset-0 flex items-center justify-center overflow-visible pointer-events-none">
        <div
          className={`transition-all duration-1000 ease-out z-[10] absolute ${
            // show hero if initial animation triggered OR user hasn't scrolled
            // far from the top (use pixel threshold)
            (showHero || scrollOpacity < 250) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            visibility: scrollProgress >= 0.99 ? 'hidden' : 'visible',
            pointerEvents: scrollProgress >= 0.99 ? 'none' : 'auto',
            userSelect: scrollProgress >= 0.99 ? 'none' : 'auto',
          }}
        >
          <HeroSection scrollPosition={heroOffsetY} />
        </div>

        <div
          className="w-full z-[5] absolute"
          style={{
            transform: `scale(${carouselScale}) translateY(${showCarousel ? '0' : '-110vh'})`,
            opacity: showCarousel ? carouselOpacity : 0,
            transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.2s ease-out',
          }}
        >
          <Carousel3D />
        </div>
      </div>

      <ScrollIndicator scrollPosition={scrollOpacity} />
      <div className="h-[150vh]" />
    </>
  );
}

export default HomePage;
