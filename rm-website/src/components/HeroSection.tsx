// src/components/HeroSection.tsx

import React from "react";
import HireMeButton from "./HireMeButton.tsx";

const sendEmail = () => {
  window.location.href = "mailto:roycemettler@gmail.com";
};

/**
 * The intro card. `compact` is the phone version, which sits in the normal
 * page flow; the default is the large desktop card that HeroSection floats
 * over the carousel.
 */
export const HeroCard: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div
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
        <img src="/assets/busan.jpg" alt="Royce Mettler" className="w-full h-full object-cover" />
      </div>
    </div>
  </div>
);

/** Desktop: the intro card fixed in the middle of the screen, lifting and
 *  fading out as you scroll down to the carousel. */
const HeroSection: React.FC<{ scrollPosition: number }> = ({ scrollPosition }) => {
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
      <HeroCard />
    </div>
  );
};

export default HeroSection;
