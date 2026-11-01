// src/pages/Multimania.tsx

import React from "react";
import { motion } from "framer-motion";
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

const Multimania: React.FC = () => {
  return (
    <div className="relative z-10 py-20 min-h-screen text-white overflow-hidden">
      <div className="w-full px-12 md:px-20 lg:px-32">
        <motion.div
          initial="hidden"
          animate="show"
          className="space-y-6 pt-16 lg:pt-0 text-xl text-indigo-100"
        >
          <motion.h2
            custom={0}
            variants={textVariant}
            className="text-4xl font-bold text-indigo-300 mb-6"
          >
            Multimania
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
                src="/multimania/game.html"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                width="1920"
                height="1080"
                className="block"
                title="Multimania"
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
How to play: You need a mouse and keyboard for this game! In Multimania you must do four separate tasks at the same time. In easy mode, these  tasks appear one at a time. In hard mode, they are all there from the beginning. The upper left game is Pong. <span className="bold">Use the left and right arrows</span> to move the pong paddle back and forth, never letting the ball touch the bottom. The upper right game is Dodge. <span className="bold">Use the up and down arrows</span> to dodge the incoming spikes. The bottom left game is Flappy Bird. <span className="bold">Use the space bar</span> to flap the ball up, avoiding the pipes. The bottom right game is Capture Points. <span className="bold">Use WASD</span> to move the ball and capture the points before they expire.          </motion.p>

          <motion.p custom={5} variants={textVariant}>
I built this game as an assignment for <a
              href="https://www.mccormick.northwestern.edu/computer-science/academics/courses/descriptions/376.html"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >CS 376: Game Design</a> at Northwestern. It took me about a day to make and was my first real attempt at making a game with Unity. I learned how to use its component system and architect gameplay mechanics using GameObjects, MonoBehaviors, and the event system. This was my first exposure to player movement, collision detection, and interactive game elements, and was SO fun to make.          </motion.p>

          <motion.p custom={6} variants={textVariant}>
The scripts for the game are all in C# and the scene hierarchy is relatively simple. The most fun part of the design process for me was iterating on the game feel. For instance, in my first implementation of the Flappy Bird section, the pipes had thinner gaps and moved a lot faster, forcing the player to focus all of their attention on that and leading to many Dodge and Capture Point losses. In another version the pong trajectory was random, but after playtesting I realized that a constant horizontal velocity felt a lot better and made the game less impossible.          </motion.p>

          <motion.p custom={7} variants={textVariant}>
Overall Multimania was really fun, and it is in large part responsible for my hobby of game design. You technically "win" the game if you survive 60 seconds, but my high score is 130 seconds, and I bet that you can beat it!          </motion.p>

<motion.p custom={8} variants={textVariant}>
P.S. The bug where toggle music definitely does not start the music at the same time it last paused it is a bug with the WebGL build of the game, because it works perfectly fine in the Unity editor. I'd fix it, but it's too fun to spam the toggle.         </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Multimania;