// src/pages/About.tsx

import React from 'react';
import TiltWrapper from '../components/TiltWrapper';
import { motion } from "framer-motion";
import { usePageEntered } from "../components/PageTransition";
import '../styles/App.css';

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

const About: React.FC = () => {
  const entered = usePageEntered();
  return (
    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between py-20 min-h-screen text-white overflow-x-hidden">
      <div className="w-full px-12 md:px-20 lg:px-32 flex flex-col lg:flex-row items-center justify-between gap-16">
        <motion.div
          initial="hidden"
          animate={entered ? "show" : "hidden"}
          className="lg:flex-1 w-full mb-12 lg:mb-0 space-y-6 pt-16 lg:pt-0"
        > 
          <motion.h2
            custom={0}
            variants={textVariant}
            className="text-4xl font-bold text-indigo-300"
          >
            About Me
          </motion.h2>

          <motion.p
            custom={1}
            variants={textVariant}
            className="text-xl text-indigo-100"
          >
            I'm Royce Mettler, an AI engineer & developer, researcher, and educator. I graduated from{' '}
            <a
              href="https://www.northwestern.edu"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Northwestern University
            </a>{' '}
            with a double major in computer science and mathematics and a concentration in AI.
          </motion.p>

          <motion.p
            custom={2}
            variants={textVariant}
            className="text-xl text-indigo-100"
          >
            I've spent a year and a third at{' '}
            <a
              href="https://www.vitu.com/"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vitu
            </a>{' '}
            where I led several AI projects such as the full-stack development of an OpenAI-powered chatbot and a neural network that predicts whether a customer will stay or not with over 92% accuracy. At Northwestern, I conducted research at {' '}
            <a
              href="https://www.linkedin.com/in/kristianhammond/"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Professor Kristian Hammond's
            </a>{' '}
            Cognition, Creativity, and Communication lab, where I worked on 
            <span className="italic"> Satyrn</span>, a model designed to reduce hallucinations in large
            language models by grounding their output in real-world data.
          </motion.p>

          <motion.p
            custom={3}
            variants={textVariant}
            className="text-xl text-indigo-100"
          >
            I also love to teach. Over the course of my time at Northwestern I volunteered in six different classes of 5th graders where I taught Python and music composition using {' '}
            <a
              href="https://tunepad.com/"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              tunepad
            </a>{''}, a tool for creating music using Python. Before college, I taught tech literacy skills at my local senior center. I was also a freelance math and science tutor throughout high school and college.


          </motion.p>

          <motion.p
            custom={4}
            variants={textVariant}
            className="text-xl text-indigo-100"
          >
            I also had the opportunity to study abroad at {' '}
            <a
              href="https://www.yonsei.ac.kr/en_sc/"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yonsei University
            </a>{' '}in Seoul, South Korea where I was fortunate enough to visit several neighboring countries. My native language is English, I can speak {' '}
            <a
              href="https://www.cde.ca.gov/sp/ml/sealofbiliteracy.asp"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              professional-grade Spanish
            </a>{''}, and I speak basic Korean. In my free time, I produce music in Ableton Live, play the piano, and make video games in Unity.

          </motion.p>

          <motion.p
            custom={5}
            variants={textVariant}
            className="text-xl text-indigo-100"
          >
            Curious about anything I've worked on or just want to say hi? Feel free to{' '}
            <a
              href="mailto:roycemettler@gmail.com"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              email me
            </a>{''}!
          </motion.p>
        </motion.div>

        <div className="lg:flex-1 flex justify-center items-center">
          <div className="w-full max-w-2xl">
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
              <video
                src="/assets/montage.mp4"
                poster="/assets/montage-poster.jpg"
                width={1280}
                height={1080}
                style={{ aspectRatio: '1280 / 1080' }}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controls={false}
                className="rounded-2xl shadow-xl w-full pointer-events-none"
              />
            </TiltWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;