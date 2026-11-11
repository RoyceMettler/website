// src/pages/AIResearch.tsx

import React from "react";
import TiltWrapper from "../components/TiltWrapper";
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

const AIResearch: React.FC = () => {
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
            AI Research in the C3 Lab
          </motion.h2>

          <motion.p
            custom={1}
            variants={textVariant}
            className="text-lg text-indigo-200 mb-6 italic"
          >
            September 2023 - June 2024
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
                src="/assets/hero/mudd.jpg"
                width={1800}
                height={1200}
                className="rounded-2xl shadow-xl w-full pointer-events-none transition-opacity duration-700"
              />
            </TiltWrapper>
          </div>

          <motion.p custom={3} variants={textVariant}>
            I first met 
            {' '}
            <a
              href="https://www.linkedin.com/in/kristianhammond/"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Professor Kristian Hammond
            </a>{' '}
when I enrolled in {' '}
            <a
              href="https://www.mccormick.northwestern.edu/computer-science/academics/courses/descriptions/338-1.html"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CS 338: Practicum in Intelligent Information Systems
            </a>{' '}at Northwestern. The goal of this class was simple: make something cool with an LLM. Prof. Hammond's teaching left a huge impression on me, not just in terms of technical depth but how he fundamentally thought about artificial intelligence. He framed it as a tool that can be incredibly powerful but must be used responsibly. During the class, he invited me to join his research group, the
            {' '}
            <a
              href="https://c3lab.northwestern.edu/"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cognition, Creativity, and Communication (C3) Lab
            </a>.          </motion.p>

          <motion.p custom={4} variants={textVariant}>
At the C3 Lab I worked on Satyrn, a proprietary model created at Northwestern to generate textural reports about specific entities within massive datasets using large language models. The goal was to produce grounded, verifiable, professional-quality LLM outputs rather than hallucination-prone responses that unfortunately plague many common LLMs. My contributions specifically centered on improving the syntax, readability, and consistency of Satyrn's generated reports to ensure they were as clear and professional as possible. I also expanded Satyrn's capabilities by developing several new types of reports such as time-series analysis, comparison of a specific entity to the benchmark, and ranking top entities across datasets.</motion.p>

          <motion.p custom={5} variants={textVariant}>
Beyond refining the language pipeline, I had the privilege of integrating the IMDB dataset into Satyrn's ever-expanding pool of knowledge. I did so via the IMDB API, which allowed Satyrn to access and analyze actors, directors, and films in the same fashion it would handle more important data such as financial or healthcare. This process gave me invaluable insight into scaling data ingestion pipelines and structuring LLM interactions so that they can adapt to new domains without compromising their core reliability.</motion.p>

          <motion.p custom={6} variants={textVariant}>
The C3 lab hosted twice weekly conversations where we would explore the latest developments in AI technology. I really enjoyed these sessions (my favorite was when OpenAI Sora released) as we really dove deep into the ethical stakes of generative AI, its societal impact, and how to deploy it responsibly in our future work endeavors. These discussions deepened my appreciation not only for the technical challenges of AI Engineering but also for the broader responsibility of designing AI systems that people can trust.</motion.p>

          <motion.p custom={7} variants={textVariant}>
Just as meaningful as this technical work was the opportunity the C3 lab gave me to collaborate closely with graduate student researchers and Professor Hammond himself. He became an invaluable mentor who I turned to for guidance on research, careers, and even life at Northwestern. Working alongside him and the graduate staff like Marko Sterbentz and Cameron Barrie was a phenomenal experience that I am eternally grateful for. These mentorships changed the way I approach AI, which is a perspective I will carry with me into my future.</motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default AIResearch;