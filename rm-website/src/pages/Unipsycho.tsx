// src/pages/Unipsycho.tsx

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

const Unipsycho: React.FC = () => {
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
            Unipsycho
          </motion.h2>

          <motion.p
            custom={1}
            variants={textVariant}
            className="text-lg text-indigo-200 mb-6 italic"
          >
            January 2024 - March 2024
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
                src="/unipsycho/game.html"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                width="1920"
                height="1080"
                className="block"
                title="Unipsycho"
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
How to play: You need a mouse and keyboard for this game! In Unipsycho your goal is to get to the end of the level using the very unconventional control scheme of riding a unicycle. Aim your body with the mouse, or with the left and right arrow keys. Use the a and d keys to move left and right, and use s to break and stop where you are. Hold down the space bar or the w key to charge up a jump, and release it to jump (tracked by the bar in the top left). Collect all of the clown hats for the true ending. Have fun! </motion.p>

          <motion.p custom={5} variants={textVariant}>
Unipsycho is a relatively unfinished group assignment for  <a
              href="https://www.mccormick.northwestern.edu/computer-science/academics/courses/descriptions/377.html"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >CS 377: Game Development Studio</a> at Northwestern, a course which was entirely about making a game with a small team. We used version control (Git) to manage contributions and resolve merge conflicts which was my first experience using version control with Unity. </motion.p>

          <motion.p custom={6} variants={textVariant}>
The scripts for the game are all in C#. Our team divided the responsibilites between mechanics, level design, and art. I was mostly level design but also a bit of mechanics because it took a while to get the movement to feel right. Coordinating these elements gave us a very deep appreciation for the role of collaborative iteration in the video game industry.          </motion.p>

          <motion.p custom={7} variants={textVariant}>
Overall Unipsycho was really fun to develop, and like Multimania and Squingo it is responsible for my hobby of game design. Developing Unipsycho taught me how to balance technical work and communication across a team as well as version control, and it was very rewarding to see it pan out.          </motion.p> 
        </motion.div>
      </div>
    </div>
  );
};

export default Unipsycho;