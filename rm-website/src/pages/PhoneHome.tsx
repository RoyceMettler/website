// src/pages/PhoneHome.tsx
//
// Portfolio on phones: the intro card, then every project as a full-width
// card in a plain scrolling list. Tap a card to open it. No 3D carousel (and
// no WebGL canvas) is mounted here.

import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeroCard } from "../components/HeroSection";
import { cardImage, cardsInViewingOrder, type CardData } from "../components/CardList";
import {
  homeLayerVariants,
  usePageTransition,
  useViewportSliceClip,
} from "../components/PageTransition";

const cardClass =
  "block rounded-2xl transition-transform duration-150 ease-out active:scale-[0.98] " +
  "[-webkit-tap-highlight-color:transparent] focus-visible:outline-2 " +
  "focus-visible:outline-offset-4 focus-visible:outline-indigo-300";

/** Real pixels a list card is wide: the screen minus the page padding. */
const listImageWidth = () =>
  Math.ceil((Math.min(window.innerWidth, 768) - 32) * Math.min(window.devicePixelRatio || 1, 3));

const PhoneCard: React.FC<{ card: CardData; animateIn: boolean; imageWidth: number }> = ({
  card,
  animateIn,
  imageWidth,
}) => {
  const body = (
    <span className="relative block aspect-[3/2] overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10">
      <img
        src={cardImage(card, imageWidth)}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <span className="absolute inset-0 flex items-center justify-center whitespace-pre-line p-4 text-center text-2xl font-bold leading-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
        {card.label}
      </span>
    </span>
  );

  const link = card.external ? (
    <a href={card.link} target="_blank" rel="noopener noreferrer" className={cardClass}>
      {body}
    </a>
  ) : (
    <Link to={card.link} className={cardClass}>
      {body}
    </Link>
  );

  if (!animateIn) return link;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {link}
    </motion.div>
  );
};

const PhoneHome: React.FC<{ relayout?: boolean }> = ({ relayout = false }) => {
  const { direction, reduced } = usePageTransition();
  const layerRef = useRef<HTMLDivElement>(null);
  useViewportSliceClip(layerRef, true, !relayout);

  // Arriving by a page transition, the slide is the entrance. On a direct
  // load, fade the intro and the cards in instead.
  const [animateIn] = useState(() => direction === "none" && !reduced && !relayout);
  const [imageWidth] = useState(listImageWidth);

  return (
    <motion.div
      ref={layerRef}
      custom={{ direction, reduced }}
      variants={homeLayerVariants}
      initial={relayout ? false : "initial"}
      animate="enter"
      exit="exit"
      className="relative z-10 mx-auto max-w-3xl px-4 pt-24 pb-16 text-white"
    >
      <HeroCard compact spawn={animateIn} />

      <section aria-label="Portfolio" className="mt-5">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {cardsInViewingOrder.map((card) => (
            <li key={card.link}>
              <PhoneCard card={card} animateIn={animateIn} imageWidth={imageWidth} />
            </li>
          ))}
        </ul>
      </section>
    </motion.div>
  );
};

export default PhoneHome;
