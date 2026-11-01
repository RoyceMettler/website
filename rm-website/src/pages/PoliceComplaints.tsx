// src/pages/PoliceComplaints.tsx

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

const District65: React.FC = () => {
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
            Do Police Complaints Work
          </motion.h2>

          <motion.p
            custom={1}
            variants={textVariant}
            className="text-lg text-indigo-200 mb-6 italic"
          >
            March 2022 - June 2022
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
                src="/assets/hero/police-complaints.jpg"
                className="rounded-2xl shadow-xl w-full pointer-events-none transition-opacity duration-700"
              />
            </TiltWrapper>
          </motion.div>

          <motion.p custom={3} variants={textVariant}>
           This project set out to answer a tough real-world question: when police officers receive
complaints, does it actually lead to consequences like salary changes or probation? I
gathered complaint records, officer profiles, and salary data, then applied causal
inference and statistical modeling to search for signals of accountability.
         </motion.p>

          <motion.p custom={4} variants={textVariant}>
The motivation came from wanting to bring data science into conversations about institutional
accountability. Beyond technical curiosity, the goal was to evaluate whether existing
complaint systems work as intended—or if they fall short.</motion.p>

          <motion.p custom={5} variants={textVariant}>
The analysis pipeline included cleaning and merging messy datasets, imputing missing values,
and running causal models. I documented everything in Jupyter notebooks, used a custom
estimator module for regression and inference routines, and built a causal diagram to reason
carefully about confounders and assumptions.
</motion.p>

          <motion.p custom={6} variants={textVariant}>
Key challenges included handling data quality issues, deciding how to identify causal
effects in observational data, and interpreting results responsibly. It was a balance
between technical rigor and humility—knowing when correlations might be misleading and
being explicit about limitations.</motion.p>

          <motion.p custom={7} variants={textVariant}>
In the end, the project offered tentative findings about relationships between complaints
and officer outcomes, but more importantly, it became a template for building a transparent
and reproducible social-impact data investigation. Future directions could include scaling
the dataset, incorporating more detailed complaint categories, or creating an interactive
dashboard for public exploration.</motion.p>

<motion.p custom={8} variants={textVariant}>
        Here's a link to the <a
              href="https://github.com/RoyceMettler/Do-Police-Complaints-Work"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >repo.</a></motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default District65;