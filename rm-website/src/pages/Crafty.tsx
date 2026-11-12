// src/pages/Crafty.tsx

import React from "react";
import TiltWrapper from "../components/TiltWrapper";
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

const Crafty: React.FC = () => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-20 min-h-screen text-white overflow-hidden">
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
            Crafty, the AI Agent for DIY Projects
          </motion.h2>

          <motion.p
            custom={1}
            variants={textVariant}
            className="text-lg text-indigo-200 mb-6 italic"
          >
            September 2023 - December 2023
          </motion.p>

          <motion.div
            custom={2}
            variants={textVariant}
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
                src="/assets/hero/crafty.jpg"
                width={4096}
                height={2730}
                className="rounded-2xl shadow-xl w-full pointer-events-none transition-opacity duration-700"
              />
            </TiltWrapper>
          </motion.div>

      <motion.p custom={3} variants={textVariant}>
        I built Crafty as a project for <a
              href="https://www.mccormick.northwestern.edu/computer-science/academics/courses/descriptions/338-1.html"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >CS 338: Practicum in Intelligent Information Systems</a> at Northwestern. The goal of this class was to make something cool using the OpenAI API which in fall 2023 was the cool new toy. My goal was to create a light and conversational chatbot that helps with the planning and troubleshooting of small DIY projects. I'd always been interested in home improvement and woodworking, but I found that a lot of the online resources were either too technical or too generic. I wanted to build something that could provide personalized advice and guidance based on the user's specific project and skill level.
      </motion.p>

      <motion.p custom={4} variants={textVariant}>
        Under the hood, I built Crafty as a Flask app in Python. It uses custom context tracking to
        maintain conversation flow, taps into the Home Depot API for real-world materials, and
        includes scraping utilities for tutorials and blueprints. On the front end, I designed a
        responsive chat UI with small touches—like animated robot icons and tilt effects—to make it
        feel more alive and engaging.
      </motion.p>

      <motion.p custom={5} variants={textVariant}>
        Building Crafty taught me a lot about balancing flexibility and domain limits, managing
        context drift in conversations, and handling the messy realities of external APIs and web
        scraping. It was as much a UX project as it was a technical one: small design choices made
        a huge difference in how “chatty” and useful the assistant felt.
      </motion.p>

      <motion.p custom={6} variants={textVariant}>
        In the end, Crafty became a fun and functional companion for makers. If I revisit it in the
        future, I’d love to expand integrations to more vendor APIs, add richer media responses
        like diagrams or sketches, and improve its natural language capabilities so it can handle
        even more nuanced DIY workflows.
      </motion.p>

      <motion.p custom={6} variants={textVariant}>
        Here's a link to the <a
              href="https://github.com/RoyceMettler/Crafty"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >repo for Crafty.</a>
      </motion.p>
    </motion.div>
  </div>
</div>


);
};

export default Crafty;