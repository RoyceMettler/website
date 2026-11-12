// src/pages/Vitu.tsx

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

const Vitu: React.FC = () => {
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
            AI Engineering at Vitu
          </motion.h2>

          <motion.p
            custom={1}
            variants={textVariant}
            className="text-lg text-indigo-200 mb-6 italic"
          >
            June 2023 - September 2024
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
              <video
                src="/assets/VituMontage.mp4"
                poster="/assets/VituMontage-poster.jpg"
                width={1280}
                height={1080}
                style={{ aspectRatio: '1280 / 1080' }}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controls={false}
                className="rounded-2xl shadow-xl w-full pointer-events-none transition-opacity duration-700"
              />
            </TiltWrapper>
          </div>

          <motion.p custom={3} variants={textVariant}>
            I first joined{" "}
            <a
              href="https://www.vitu.com/"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vitu
            </a>{" "}
            in Summer 2023 as what was initially just a software engineering intern. They wanted to experiment with replacing their forms engine (software that tells you what forms you need when buying a car in one state and registering it in another) with a chatbot. Therefore, the internship quickly became AI-focused as I spearheaded the development of what I now know to be an agent but at the time was just a chatbot I called VituFormBot.
          </motion.p>

          <motion.p custom={4} variants={textVariant}>
            This was my first real exposure to large language models (LLMs) and especially programming with one, and I developed the entire agent full-stack. I quickly came to understand that outright replacing the forms engine with a chatbot that has all the logic loaded into its context window wasn't going to work. On the one hand, the context window at the time was only 4k tokens, and on the other, the model would very often hallucinate incorrect forms. Then, OpenAI function calling was released, a tool that allowed GPT-4 to answer in the form of a json object that could be used as an API request. At the time, the forms engine didn't have an API because it was standalone software. Therefore, I had to build an API for the forms engine using its CURL output and hook the chatbot up to it.
          </motion.p>

          <motion.p custom={5} variants={textVariant}>
            I didn't know frontend at the time and scraped together a very rudimentary web app to talk to the bot that used jQuery through AJAX to send and receive messages to and from a Python server. Soon, they assigned me a team of testers that, bless their souls, sat there for hours asking the bot all kinds of questions to ensure it was accurate. Working with this team, I was really able to hone my teamwork and communication skills, as it was often a case of them sitting with me as I made changes to the code or internal prompts in real time.</motion.p>

          <motion.p custom={6} variants={textVariant}>
            At the end of the internship, I presented the bot and demonstrated its capabilities to the c-suite and other board members. The board was impressed enough to make me an immediate offer where I would continue working on the bot part-time throughout my junior year at Northwestern. This was where I learned how to containerize the bot with Docker and deploy it with Kubernetes, which was a much-needed upgrade from just hosting it on a Python server. Working while at school, I also learned how to be effective while working remotely.</motion.p>

          <motion.p custom={7} variants={textVariant}>
            I ultimately handed the keys to the bot over to a different intern because the executives came to me with a new problem: customer churn was particularly high at the time. They wondered if I could figure out a way to answer this question of churn using AI. This was a very exciting opportunity because while I had done many small-scale machine learning projects at Northwestern, I hadn't yet explored machine learning at scale in real production.</motion.p>

          <motion.p custom={8} variants={textVariant}>
            I was given access to a large set of disorganized internal data related to customer churn. That gave me the idea to train a neural network on this data that predicts whether or not a given customer will churn. I first needed to perform extensive data preprocessing using techniques like one-hot encoding, feature scaling, and feature engineering (for instance the time each customer spent in each customer lifecycle stage). Once the data was processed, I was faced with the new problem of there not being enough of it, meaning I had to augment the data using SMOTE and custom noise injection. This was very successful and is a technique I'm excited to use in my future endeavors. </motion.p>

          <motion.p custom={9} variants={textVariant}>
            I coded the neural network in PyTorch using binary cross-entropy loss and Adam as an optimizer, leading to 92% accuracy. That was really rewarding, but just telling whether a given customer will churn wasn't good enough; I wanted to understand why they were churning. I proceeded to use a technique called SHAP that explains the predictions of machine learning models. Then I could generate heatmaps of features with the hotter parts of the grid indicating which features led a given customer to churn or not. I also aggregated this SHAP data to get a big picture understanding of which features led to churn. This gave the higher-ups actionable insights into improving Vitu's customer pipeline.</motion.p>

          <motion.p custom={10} variants={textVariant}>
            Beyond the technical work, what defined my experience at Vitu was the teamwork. I collaborated with testers, managers, and executives in a cycle of constant feedback, and I quickly learned that clear communication mattered even more than code quality. Whether it was sitting side-by-side with testers or translating the logic of the churn model into actionable insights for non-technical stakeholders, I found myself growing into the role of a bridge between engineering and business.
 </motion.p>

          <motion.p custom={11} variants={textVariant}>
            My work at Vitu ended not because I wanted it to, but because I left the US to study abroad in South Korea. I could not work remotely overseas due to business laws so I had to formally step away from the role. However, I am eternally grateful for the opportunities Vitu gave me to grow as both an engineer and a collaborator, and I am excited to carry these skills and lessons with me into my future projects.</motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Vitu;
