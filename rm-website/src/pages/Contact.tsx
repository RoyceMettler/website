// src/pages/Contact.tsx

import React from 'react'
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { usePageSpawn } from "../components/PageTransition";
import HireMeButton from '../components/HireMeButton'
import TiltWrapper from '../components/TiltWrapper'
import { TALL_PHONE_MEDIA, useIsPhone, useMediaQuery } from '../hooks/useMediaQuery'

const SOCIAL_LINKS: {
  href: string
  Icon: React.ComponentType<{ size?: string | number; className?: string }>
  label: string
}[] = [
  {
    href: 'https://github.com/RoyceMettler',
    Icon: FaGithub,
    label: 'GitHub',
  },
  {
    href: 'https://linkedin.com/in/roycemettler',
    Icon: FaLinkedin,
    label: 'LinkedIn',
  },
  {
    href: 'https://instagram.com/roycemettler',
    Icon: FaInstagram,
    label: 'Instagram',
  },
]

// --- Animation Variants ---
const textVariant = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
}

const Contact: React.FC = () => {
  const spawn = usePageSpawn();
  // Phones: the card fills the screen below the navbar (svh = the height with
  // the browser's toolbars showing) and spreads its three parts evenly down
  // it. Small phones get smaller pieces so it all still fits on one screen.
  const isPhone = useIsPhone();
  const isTallPhone = useMediaQuery(TALL_PHONE_MEDIA);
  return (
    <div className="relative min-h-screen phone:min-h-svh">
      <div className="relative z-10 flex items-center justify-center min-h-screen phone:min-h-svh px-4 phone:pt-[5.25rem] phone:pb-4">
        <TiltWrapper maxTilt={1} transitionSpeed={1000} hoverScaleEffect>
          <motion.div
            initial={spawn.initial}
            animate={spawn.animate}
            className="w-[min(90vw,theme(maxWidth.6xl))] mx-auto bg-black/70 p-10 md:p-16 phone:p-5 tall-phone:p-6 rounded-3xl shadow-2xl overflow-hidden phone:flex phone:flex-col phone:justify-evenly phone:min-h-[calc(100svh-6.25rem)]"
          >
            <motion.h2
              custom={0}
              variants={textVariant}
              className="text-3xl phone:text-2xl tall-phone:text-3xl font-semibold text-indigo-300 mb-8 phone:mb-0 text-center phone:text-balance"
            >
              Get in Contact With Me
            </motion.h2>

            <motion.div
              custom={1}
              variants={textVariant}
              className="text-center mb-12 phone:mb-0"
            >
              <p className="text-gray-200 text-lg phone:text-base tall-phone:text-lg mb-8 phone:mb-4 tall-phone:mb-6">
                The best way to contact me is to just send me an email!
              </p>

              <div className="flex justify-center">
                <HireMeButton
                  text="Email Me"
                  outlined={true}
                  width={isTallPhone ? 210 : isPhone ? 180 : undefined}
                  height={isTallPhone ? 80 : isPhone ? 60 : undefined}
                  onClick={() => {
                    window.location.href = 'mailto:roycemettler@gmail.com'
                  }}
                />
              </div>

              <p className="text-gray-400 mt-4 phone:mt-2 tall-phone:mt-3 text-sm">
                roycemettler@gmail.com
              </p>
            </motion.div>

            <motion.div
              custom={2}
              variants={textVariant}
              className="border-t border-gray-700 pt-8 phone:pt-4 tall-phone:pt-7"
            >
              <p className="text-gray-300 text-center mb-6 phone:mb-3 tall-phone:mb-5 font-medium">
                Or connect with me on social media:
              </p>
              <div className="flex justify-center space-x-8">
                {SOCIAL_LINKS.map((item, idx) => {
                  const { href, Icon, label } = item
                  return (
                    <motion.a
                      key={idx}
                      custom={3 + idx}
                      variants={textVariant}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      // transition-colors, not `transition`: a CSS transition on
                      // transform/opacity fights the fade-in that framer-motion
                      // drives every frame, so the icons lagged and then jumped.
                      className="flex flex-col items-center gap-2 text-gray-200 hover:text-indigo-300 transition-colors group"
                      aria-label={label}
                    >
                      <Icon
                        size={isPhone && !isTallPhone ? 32 : 40}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span className="text-sm">{label}</span>
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        </TiltWrapper>
      </div>
    </div>
  )
}

export default Contact
