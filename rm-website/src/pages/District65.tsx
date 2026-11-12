// src/pages/District65.tsx

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
            Teaching Python to 5th Graders at District 65
          </motion.h2>

          <motion.p
            custom={1}
            variants={textVariant}
            className="text-lg text-indigo-200 mb-6 italic"
          >
            January 2024 - June 2025
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
                src="/assets/hero/teaching.jpg"
                width={1024}
                height={683}
                className="rounded-2xl shadow-xl w-full pointer-events-none transition-opacity duration-700"
              />
            </TiltWrapper>
          </motion.div>

          <motion.p custom={3} variants={textVariant}>
            In the winter quarter of my junior year, I began teaching Python to 5th graders through  
            {' '}<a
              href="https://www.district65.net/"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Evanston/Skokie School District 65
            {' '}</a>,  an experience which would soon grow to be my absolute favorite extracurricular at Northwestern. The first half of the program was{' '}<a
              href="https://tunepad.com/"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TunePad
            </a>,  a web app developed by Northwestern that allows students to compose music using code, and the second half was SportSense, a series of lessons where students made wearable technology for sports and general health. Over the two years I taught, I had six classes and a total of over 150 students
         </motion.p>

          <motion.p custom={4} variants={textVariant}>
          With TunePad, I had to guide the students through foundational coding skills like loops, functions, and if statements. Simultaneously, I tapped into my musical background to introduce core music theory and composition concepts. This was the key challenge: I had to make both sides approachable for ten-year-olds while also holding their attention, which I soon discovered is a whole science in and of itself.</motion.p>
        <motion.p custom={5} variants={textVariant}>
          Making music in TunePad with Python was really fun for the students. A lot of them wanted to recreate popular songs, some of which turned out incredibly well, such as one student's cover of Runaway by Kanye. Others wanted to create soundscapes of their favorite activities; one student composed one about playing sports and cleverly used the bass drum's sound as a bouncing basketball. Another student made a soundscape about walking through the forest, and when I listened to it I got chills because it sounded so realistic. I was incredibly appreciative to have played a part in these students' creative journey and introduction to programming.
        </motion.p>
        <motion.p custom={6} variants={textVariant}>
          Teaching SportSense was just as fun and engaging, if not more so. We started with the basics of sensors, first having the students use their own bodies as "jump counters" then experimenting with the {' '}<a
              href="https://apps.apple.com/us/app/play-impossible-gameball/id1124166804"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Play Impossible Gameball
            </a>{' '} to track spin, airtime, and catch force. The Play Impossible Gameball was a favorite because its feedback was immediate and competitive: shaking the ball as fast as possible, racing to beat classmates, and analyzing the data behind the race.
        </motion.p>
        <motion.p custom={7} variants={textVariant}>
          We later moved to wearables like the {' '}<a
              href="https://makecode.microbit.org/"
              className="text-indigo-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              BBC micro:bit
            </a>{' '}  where the students could code programs to log movement data or count their steps. This was the introduction of a 'wearable' and was also very popular with the students since it attached directly to their bodies. By the end of the unit, small groups of students were designing their own custom games and experiments using the Play Impossible Gameball and the micro:bit. Watching them go from "what is a sensor?" to confidently coding and running their own data-driven investigations was one of the most rewarding teaching experiences I've had. My students were discovering their own abilities to make things that mattered to them.

        </motion.p>
        <motion.p custom={8} variants={textVariant}>
          I know it sounds pretty cliché, but teaching in District 65 taught me just as much as I taught my students. I learned how to hold a classroom's attention, how to explain complex programming concepts to an unfamiliar young audience, and how to foster an accepting and friendly classroom culture. I also saw firsthand how introducing kids to programming as a creative tool instead of as something intimidating can be incredibly powerful. I had one specific student who told me at the end of the year that he wanted to continue learning Python and that he had bought some books about it and hired a tutor. It was truly amazing and touching to be a part of his and so many others' introductions to the amazing field of computer programming.
        </motion.p>
        
        </motion.div>

        
      </div>
    </div>
  );
};

export default District65;