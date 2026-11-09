// src/pages/HomePage.tsx

import HeroSection from '../components/HeroSection';
import Carousel3D from '../components/Carousel3D';
import ScrollIndicator from '../components/ScrollIndicator';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { homeLayerVariants, usePageTransition } from '../components/PageTransition';
import { useInitialAnimations } from '../hooks/useInitialAnimations';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useIsPhone } from '../hooks/useMediaQuery';
import PhoneHome from './PhoneHome';

/** Phones get a plain list of project cards; everything else the 3D carousel. */
function HomePage() {
  const isPhone = useIsPhone();
  // A layout swapped in later (rotating a tablet, resizing across the phone
  // breakpoint) must not replay the page's arrival slide or the intro.
  const [firstLayout] = useState(isPhone);
  const [swapped, setSwapped] = useState(false);
  if (!swapped && isPhone !== firstLayout) setSwapped(true);
  const relayout = swapped || isPhone !== firstLayout;
  return isPhone ? <PhoneHome relayout={relayout} /> : <DesktopHome relayout={relayout} />;
}

function DesktopHome({ relayout }: { relayout: boolean }) {
  const { showHero, showCarousel } = useInitialAnimations(relayout);
  const { scrollProgress, scrollOpacity } = useScrollProgress();
  const { direction, reduced } = usePageTransition();

  // Use pixel scroll (scrollOpacity) for hero offset/visibility so
  // small upward scrolls reliably reveal the hero in production builds.
  const heroOffsetY = Math.min(scrollOpacity, 300);
  const normalizedProgress = Math.min(scrollProgress, 1);
  const carouselScale = 1 + 0.2 * Math.pow(normalizedProgress, 5);
  const carouselOpacity = 0.6 + 0.4 * Math.pow(normalizedProgress, 5);
  // HeroSection fades out over the first 300px of scroll. Past that it's
  // invisible, so hide it for real (it would otherwise still catch hovers and
  // clicks over the top of the cards), and only then allow the drag hint.
  // Windows too short to scroll 300px still hide it at the bottom.
  const heroGone = scrollOpacity >= 300 || scrollProgress >= 0.99;

  return (
    <>

      {/* The page transition moves this fixed layer itself (not a wrapper)
          so the fixed hero and carousel keep the viewport as their frame. */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center overflow-visible pointer-events-none"
        custom={{ direction, reduced }}
        variants={homeLayerVariants}
        initial={relayout ? false : "initial"}
        animate="enter"
        exit="exit"
      >
        <div
          // Not transition-all: visibility must flip at once, or the faded
          // hero keeps catching clicks for another second.
          className={`transition-[opacity,scale] duration-1000 ease-out z-[10] absolute ${
            // show hero if initial animation triggered OR user hasn't scrolled
            // far from the top (use pixel threshold)
            (showHero || scrollOpacity < 250) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            visibility: heroGone ? 'hidden' : 'visible',
            pointerEvents: heroGone ? 'none' : 'auto',
            userSelect: heroGone ? 'none' : 'auto',
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
          <Carousel3D hintEnabled={heroGone} />
        </div>

        <ScrollIndicator scrollPosition={scrollOpacity} />
      </motion.div>

      <div className="h-[150vh]" />
    </>
  );
}

export default HomePage;
