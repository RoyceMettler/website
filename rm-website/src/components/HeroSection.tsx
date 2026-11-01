// src/components/HeroSection.tsx

import React from "react";
import HireMeButton from "./HireMeButton.tsx";

const HeroSection: React.FC<{ scrollPosition: number }> = ({
  scrollPosition,
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
      <div className="w-[min(90vw,theme(maxWidth.6xl))] mx-auto bg-black/80 p-10 md:p-16 rounded-3xl shadow-2xl pointer-events-auto">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10">
          
          <div className="flex-1 min-w-0 text-left text-white">
  <p className="text-lg md:text-xl text-white/80 mb-2">Hi, I’m</p>
  <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 -ml-0.5">
  Royce Mettler
</h1>
  <h2 className="text-2xl md:text-3xl text-indigo-300 font-medium mb-6">
    AI Engineer & Developer
  </h2>
  <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-prose">
  I'm a Northwestern University graduate with a double bachelor's in
  computer science and math with a concentration in AI. I also have 1.33 YOE
  as an AI Engineer where I built agents and predictive neural nets. Welcome to my site!
  </p>

  <div className="flex justify-center mt-20">
    <HireMeButton
      text="Hire Me"
      outlined={true}
      onClick={() => {
        window.location.href = "mailto:roycemettler@gmail.com";
      }}
    />
  </div>
</div>

          <div className="shrink-0 w-full max-w-xs md:max-w-md lg:max-w-lg aspect-[4/5] overflow-hidden rounded-3xl border-5 border-indigo-500 shadow-lg">
            <img
              src="/assets/busan.jpg"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
