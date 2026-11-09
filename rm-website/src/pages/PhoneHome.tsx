// src/pages/PhoneHome.tsx
//
// Portfolio on phones: the intro card, then every project as a full-width
// card in a plain scrolling list. Tap a card to open it. No 3D carousel (and
// no WebGL canvas) is mounted here.

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeroCard } from "../components/HeroSection";
import { cards, type CardData } from "../components/CardList";
import {
  homeLayerVariants,
  usePageTransition,
  useViewportSliceClip,
} from "../components/PageTransition";

const cardClass =
  "block rounded-2xl transition-transform duration-150 ease-out active:scale-[0.98] " +
  "[-webkit-tap-highlight-color:transparent] focus-visible:outline-2 " +
  "focus-visible:outline-offset-4 focus-visible:outline-indigo-300";

const PhoneCard: React.FC<{ card: CardData; animateIn: boolean }> = ({ card, animateIn }) => {
  const body = (
    <span className="relative block aspect-[3/2] overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10">
      <img
        src={card.image}
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

  // data-card-link lets ScrollManager bring you back to this card.
  const link = card.external ? (
    <a href={card.link} target="_blank" rel="noopener noreferrer" className={cardClass} data-card-link={card.link}>
      {body}
    </a>
  ) : (
    <Link to={card.link} className={cardClass} data-card-link={card.link}>
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
  useEffect(() => {
    // Set by ScrollManager for the desktop hero; this layout has no use for it.
    sessionStorage.removeItem("skipHeroAnimation");
  }, []);

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
      <motion.div
        initial={animateIn ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <HeroCard compact />
      </motion.div>

      <section aria-labelledby="portfolio-heading" className="mt-10">
        <h2 id="portfolio-heading" className="mb-4 text-2xl font-bold text-indigo-300">
          Portfolio
        </h2>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {cards.map((card) => (
            <li key={card.link}>
              <PhoneCard card={card} animateIn={animateIn} />
            </li>
          ))}
        </ul>
      </section>
    </motion.div>
  );
};

export default PhoneHome;
