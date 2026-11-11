// src/components/HeroSection.tsx

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import HireMeButton from "./HireMeButton.tsx";

const sendEmail = () => {
  window.location.href = "mailto:roycemettler@gmail.com";
};

/**
 * The photo. If it is already loaded when the card mounts it is simply there
 * (and takes part in the card's fade-in); if it is still downloading, it
 * fades in when it arrives instead of popping into an empty frame.
 */
const HeroPhoto: React.FC = () => {
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"pending" | "ready" | "late">("pending");
  useLayoutEffect(() => {
    if (ref.current?.complete) setState("ready");
  }, []);
  const arrived = () => setState((s) => (s === "pending" ? "late" : s));

  return (
    <img
      ref={ref}
      src="/assets/busan.jpg"
      alt="Royce Mettler"
      onLoad={arrived}
      onError={arrived}
      className={`w-full h-full object-cover ${
        state === "pending"
          ? "opacity-0"
          : state === "late"
            ? "opacity-100 transition-opacity duration-500"
            : "opacity-100"
      }`}
    />
  );
};

type HeroCardProps = {
  /** The phone version, which sits in the normal page flow. */
  compact?: boolean;
  /** Play the fade-in (first load of the site); otherwise it is simply there. */
  spawn?: boolean;
};

/**
 * The intro card. The default is the large desktop card that HeroSection
 * floats over the carousel. With `spawn`, the whole card fades up into place
 * as one piece.
 */
export const HeroCard: React.FC<HeroCardProps> = ({ compact = false, spawn = false }) => (
  <motion.div
    initial={spawn ? { opacity: 0, y: 20 } : false}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={
      compact
        ? "w-full bg-black/80 p-6 rounded-3xl shadow-2xl"
        : "w-[min(90vw,theme(maxWidth.6xl))] mx-auto bg-black/80 p-10 md:p-16 rounded-3xl shadow-2xl pointer-events-auto"
    }
  >
    <div className={`flex flex-col-reverse md:flex-row items-center ${compact ? "gap-6" : "gap-10"}`}>
      <div className="flex-1 min-w-0 text-left text-white">
        <p className={compact ? "text-base text-white/80 mb-1" : "text-lg md:text-xl text-white/80 mb-2"}>
          Hi, I’m
        </p>
        <h1
          className={
            compact
              ? "text-4xl font-extrabold leading-tight mb-3 -ml-0.5"
              : "text-5xl md:text-6xl font-extrabold leading-tight mb-4 -ml-0.5"
          }
        >
          Royce Mettler
        </h1>
        <h2
          className={
            compact
              ? "text-xl text-indigo-300 font-medium mb-4"
              : "text-2xl md:text-3xl text-indigo-300 font-medium mb-6"
          }
        >
          AI Engineer & Developer
        </h2>
        <p className={compact ? "text-base text-gray-300 mb-6" : "text-lg md:text-xl text-gray-300 mb-8 max-w-prose"}>
          I'm a Northwestern University graduate with a double bachelor's in
          computer science and math with a concentration in AI. I also have 1.33 YOE
          as an AI Engineer where I built agents and predictive neural nets. Welcome to my site!
        </p>

        <div className={compact ? "flex justify-center" : "flex justify-center mt-20"}>
          {compact ? (
            <HireMeButton text="Hire Me" outlined width={200} height={72} onClick={sendEmail} />
          ) : (
            <HireMeButton text="Hire Me" outlined onClick={sendEmail} />
          )}
        </div>
      </div>

      <div
        className={
          compact
            ? "shrink-0 w-full max-w-60 aspect-[4/5] overflow-hidden rounded-3xl border-4 border-indigo-500 shadow-lg"
            : "shrink-0 w-full max-w-xs md:max-w-md lg:max-w-lg aspect-[4/5] overflow-hidden rounded-3xl border-5 border-indigo-500 shadow-lg"
        }
      >
        <HeroPhoto />
      </div>
    </div>
  </motion.div>
);

/** Desktop: the intro card fixed in the middle of the screen, lifting and
 *  fading out as you scroll down to the carousel. */
const HeroSection: React.FC<{ scrollPosition: number; spawn?: boolean }> = ({
  scrollPosition,
  spawn = false,
}) => {
  const translateY = -scrollPosition * 2;
  const opacity = Math.max(0, 1 - scrollPosition / 300);

  return (
    <div
      className="fixed top-1/2 left-1/2 pointer-events-none z-20"
      style={{
        transform: `translate(-50%, calc(-50% + ${translateY}px))`,
        opacity,
        transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
      }}
    >
      <HeroCard spawn={spawn} />
    </div>
  );
};

export default HeroSection;
