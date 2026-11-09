// src/pages/TechHelp.tsx

import React from "react";
import TiltWrapper from "../components/TiltWrapper";
import { motion } from "framer-motion";
import { usePageEntered } from "../components/PageTransition";
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

const TechHelp: React.FC = () => {
  const entered = usePageEntered();
  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-20 min-h-screen text-white overflow-hidden">
      <div className="w-full px-12 md:px-20 lg:px-32">
        <motion.div
          initial="hidden"
          animate={entered ? "show" : "hidden"}
          className="space-y-6 pt-16 lg:pt-0 text-xl text-indigo-100"
        >
          <motion.h2
            custom={0}
            variants={textVariant}
            className="text-4xl font-bold text-indigo-300 mb-6"
          >
            Tech Help at the Calabasas Senior Center
          </motion.h2>

          <motion.p
            custom={1}
            variants={textVariant}
            className="text-lg text-indigo-200 mb-6 italic"
          >
            September 2018 - March 2020
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
                src="/assets/hero/seniorcenter.jpg"
                className="rounded-2xl shadow-xl w-full pointer-events-none transition-opacity duration-700"
              />
            </TiltWrapper>
          </motion.div>

          <motion.p custom={3} variants={textVariant}>
            I started volunteering at the 
            {' '}<a
              href="https://www.cityofcalabasas.com/government/community-services-parks-recreation/senior-center"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Calabasas Senior Center
            </a>{' '} in fall of 2018 every Monday and Wednesday. The role began simply as 'helping senior citizens with their phones' but very quickly became the most fun, rewarding, and memorable experience I had in high school. I <span className="italic">loved</span> it. It quickly taught me how to break complex tech concepts into approachable steps that I could explain to an unfamiliar audience.
         </motion.p>

          <motion.p custom={4} variants={textVariant}>
My main job was to sit down one-on-one with seniors and guide them through whatever hurdles they were facing with their technology. Most of the time, this involved setting up their email account or downloading an app, but occasionally things got pretty intense. One gentleman who was a realtor was wondering why no one could see his property listings. It turned out he hadn't actually listed them. Figuring that out within his highly technical realtor software that I had never seen before was quite a challenge. We solved his problem, and his listings miraculously started to get more attention. What surprised me most about being a tech helper wasn't just the variety of problems but the patience and empathy the role demanded. For instance, the aforementioned realtor came in pretty upset and aggravated. But, once we figured it out, his entire demeanor changed; he was very grateful and even hugged me.</motion.p>

          <motion.p custom={5} variants={textVariant}>
Many times the seniors would stay and chat after I finished my shift. The sentiments within their stores about how foreign a concept the iPhone seemed to them deeply affected me. It formed a feedback loop where I would learn with each new senior how to better connect with them and help them. As my actual tech help skills improved, the challenges became more about diffusing stress, validating their frustrations, and making them feel supported. I treasured the moments their eyes lit up after they finally got it.
</motion.p>

          <motion.p custom={6} variants={textVariant}>
Outside of tech, I also helped out at the front desk, checking in visitors, answering the phone, and occasionally running errands. It was through these activities that I got to know the staff and community more closely, allowing me to appreciate how much work goes into creating a warm and welcoming environment for senior citizens.</motion.p>

          <motion.p custom={7} variants={textVariant}>
Being a tech helper turned me into an even more compassionate and well-rounded person. It taught me how to communicate clearly, how to remain calm, and how to build trust with people who are initially skeptical or overwhelmed. Those are lessons I carried with me into my work at Vitu and that I will continue to use throughout my future endeavors. It also gave me a very deep appreciation for technology's role in bringing people closer together and for the patience and empathy needed to help others bridge that gap.</motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default TechHelp;