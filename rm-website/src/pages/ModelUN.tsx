// src/pages/ModelUN.tsx

import React from "react";
import TiltWrapper from "../components/TiltWrapper";
import { motion } from "framer-motion";
import { usePageSpawn } from "../components/PageTransition";
import { heroImage } from "../components/CardList";
import "../styles/App.css";

const textVariant = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const ModelUN: React.FC = () => {
  const spawn = usePageSpawn();
  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-20 min-h-screen text-white overflow-hidden">
      <div className="w-full px-12 md:px-20 lg:px-32">
        <motion.div
          initial={spawn.initial}
          animate={spawn.animate}
          className="space-y-6 pt-16 lg:pt-0 text-xl text-indigo-100"
        >
          <motion.h2
            custom={0}
            variants={textVariant}
            className="text-4xl font-bold text-indigo-300 mb-6"
          >
            Model UN
          </motion.h2>

          <motion.p
            custom={1}
            variants={textVariant}
            className="text-lg text-indigo-200 mb-6 italic"
          >
            September 2017 - June 2024
          </motion.p>

          <div
            className="relative float-none sm:float-right sm:ml-10 mb-20 w-full sm:w-2/5 lg:w-2/5 xl:w-3/5 max-w-xl"
          >
            <TiltWrapper
              maxTilt={4}
              transitionSpeed={1000}
              hoverScaleEffect
              showReflection={true}
              reflectionHeight="20%"
              reflectionOpacity={0.4}
              reflectionBlur="blur-md"
              reflectionGap="mt-2"
            >
              <img
                src={heroImage("/assets/hero/mun.jpg")}
                width={5065}
                height={3377}
                className="rounded-2xl shadow-xl w-full pointer-events-none transition-opacity duration-700"
              />
            </TiltWrapper>
          </div>

          <motion.p custom={3} variants={textVariant}>
           I first got involved with Model United Nations back in high school, when I signed up to be a delegate without really knowing what to expect. Very quickly I discovered that I thrived in crisis committees, which are the smaller, more improvisational side of MUN where events unfold in real time and delegates have to respond to ever-changing scenarios. I loved the pressure of thinking on my feet, building alliances on the fly, and weaving together historical knowledge with creative strategy. Whereas General Assembly sessions often revolved around long debates and formal resolutions, crisis felt alive, dynamic, and almost theatrical. It was where I could test my instincts as both a leader and a collaborator.
         </motion.p>

          <motion.p custom={4} variants={textVariant}>
Over the years I competed at a number of conferences, including Gaucho MUN, Stanford MUN, and Geo MUN. These conferences gave me the chance not only to test myself against peers from across the country, but also to deepen my ability to analyze problems from multiple perspectives. Winning awards was validating, of course, but what really stuck with me was how much I learned from my fellow delegates — watching them invent new solutions, adapt under pressure, and sometimes completely upend the direction of a committee with one bold move.</motion.p>

          <motion.p custom={5} variants={textVariant}>
When I entered college, my relationship with MUN shifted. Instead of being a competitor, I became part of the team that hosted a conference. At Northwestern’s Model UN, I took on a variety of roles: first as a crisis staffer, then as vice chair, and eventually as chair. This was a very different challenge. As a delegate, the focus had been on my individual performance, but as part of the host team, success meant creating the conditions for other delegates to shine. I learned how to balance structure and flexibility in a committee, keeping discussions on track while leaving enough room for creativity and chaos to flourish.
</motion.p>

          <motion.p custom={6} variants={textVariant}>
As a chair I had to design and run crisis committees. Unlike large General Assembly bodies, our committees were deliberately small and unconventional, ranging from a Facebook board of directors to Caesar crossing the Rubicon to, most recently, the Theranos board of directors. Each one required not only research and preparation but also the ability to improvise and adapt on the fly as delegates took the story in unexpected directions. It felt like a mix of writing, directing, and live problem-solving, all wrapped in one.</motion.p>

          <motion.p custom={7} variants={textVariant}>
What Model UN gave me most, though, wasn’t the awards or the résumé lines — it was a deeper appreciation for global politics, institutions, and the people who navigate them. I came to see how decisions at every level, from corporate boardrooms to historical turning points, are shaped by power, personality, and persuasion. MUN also sparked a curiosity about the world that dovetailed with my love of travel. Researching countries, leaders, and moments in history gave me a foundation that made exploring the real world even richer.</motion.p>

<motion.p custom={8} variants={textVariant}>
Ultimately, my time in Model UN taught me how to think on my feet, how to manage groups of people with competing interests, and how to keep my cool in unpredictable situations. Just as importantly, it taught me that politics — whether real or simulated — is always about people, and that understanding their motivations is the first step toward building solutions.</motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default ModelUN;