// src/pages/Squingo.tsx

import React from "react";
import { motion } from "framer-motion";
import { usePageSpawn } from "../components/PageTransition";
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

const Squingo: React.FC = () => {
  const spawn = usePageSpawn();
  return (
    <div className="relative z-10 py-20 min-h-screen text-white overflow-hidden">
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
            Squingo
          </motion.h2>

          <motion.p
            custom={1}
            variants={textVariant}
            className="text-lg text-indigo-200 mb-6 italic"
          >
            November 2023
          </motion.p>

          <motion.div
            custom={2}
            variants={textVariant}
            className="relative mb-20 w-full max-w-6xl mx-auto"
          >
            <div 
              className="rounded-2xl shadow-xl overflow-hidden bg-gray-900"
              style={{ 
                width: "1200px", 
                height: "648px",
                maxWidth: "100%",
                margin: "0 auto"
              }}
            >
              <iframe
                src="/squingo/game.html"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                width="1920"
                height="1080"
                className="block"
                title="Squingo"
                style={{ 
                  width: "1920px",
                  height: "1080px",
                  border: "none",
                  transform: "scale(0.6)", 
                  transformOrigin: "top left"
                }}
                scrolling="no"
              />
            </div>
          </motion.div>

          <motion.p custom={3} variants={textVariant} className="text-3xl font-semibold leading-relaxed">
Note: If the game is very laggy, try switching to Firefox.</motion.p>

          <motion.p custom={4} variants={textVariant} className="text-3xl font-semibold leading-relaxed">
How to play: You’ll need a keyboard for this game! Your goal is to get to the top. The only mechanic is jumping, meaning you must time your inputs carefully and climb as high as you can. Progress is supposed to be saved automatically between sessions, but that functionality kind of broke in the web version of the game (it works a little bit).
</motion.p>

          <motion.p custom={5} variants={textVariant}>
I built this game as my final project for <a
              href="https://www.mccormick.northwestern.edu/computer-science/academics/courses/descriptions/376.html"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >CS 376: Game Design</a> at Northwestern. It took me about two days to make. By this point in the course, I was already comfortable with Unity’s component system, GameObjects, MonoBehaviors, and event-driven mechanics, so I could focus more on polish and player experience.          </motion.p>

          <motion.p custom={6} variants={textVariant}>
The game is a clone of the popular 'Foddian' game Jump King, with Foddian meaning the entire game is one level with no checkpoints at all. The challenge is simple to describe but difficult to execute, as every mistake can send you falling down through multiple levels. I also specifically implemented save data between play sessions so if the player falls and quits, the game will remember the position they fell to to ensure they can't cheat death.
</motion.p>

          <motion.p custom={7} variants={textVariant}>
Designing this project was all about refining difficulty and game feel. It was important to make the jumps feel responsive and to design a level that balanced frustration with fun. It was a great capstone to the course and one of my favorite projects to build.
</motion.p>

        </motion.div>
      </div>
    </div>
  );
};

export default Squingo;