// src/pages/Contact.tsx

import React from 'react'
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { usePageSpawn } from "../components/PageTransition";
import HireMeButton from '../components/HireMeButton'
import TiltWrapper from '../components/TiltWrapper'
import { useIsPhone } from '../hooks/useMediaQuery'

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
  // Phones: tighter spacing and smaller pieces so the whole card fits on one
  // screen (svh = the height with the browser's toolbars showing).
  const isPhone = useIsPhone();
  return (
    <div className="relative min-h-screen phone:min-h-svh">
      <div className="relative z-10 flex items-center justify-center min-h-screen phone:min-h-svh px-4 phone:pt-[5.25rem] phone:pb-4">
        <TiltWrapper maxTilt={1} transitionSpeed={1000} hoverScaleEffect>
          <motion.div
            initial={spawn.initial}
            animate={spawn.animate}
            className="w-[min(90vw,theme(maxWidth.6xl))] mx-auto bg-black/70 p-10 md:p-16 phone:p-5 rounded-3xl shadow-2xl overflow-hidden"
          >
            <motion.h2
              custom={0}
              variants={textVariant}
              className="text-3xl phone:text-2xl font-semibold text-indigo-300 mb-8 phone:mb-3 text-center"
            >
              Get in Contact With Me
            </motion.h2>

            <motion.div
              custom={1}
              variants={textVariant}
              className="text-center mb-12 phone:mb-5"
            >
              <p className="text-gray-200 text-lg phone:text-base mb-8 phone:mb-4">
                The best way to contact me is to just send me an email!
              </p>

              <div className="flex justify-center">
                <HireMeButton
                  text="Email Me"
                  outlined={true}
                  width={isPhone ? 180 : undefined}
                  height={isPhone ? 60 : undefined}
                  onClick={() => {
                    window.location.href = 'mailto:roycemettler@gmail.com'
                  }}
                />
              </div>

              <p className="text-gray-400 mt-4 phone:mt-2 text-sm">
                roycemettler@gmail.com
              </p>
            </motion.div>

            <motion.div
              custom={2}
              variants={textVariant}
              className="border-t border-gray-700 pt-8 phone:pt-4"
            >
              <p className="text-gray-300 text-center mb-6 phone:mb-3 font-medium">
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
                      className="flex flex-col items-center gap-2 text-gray-200 hover:text-indigo-300 transition group"
                      aria-label={label}
                    >
                      <Icon
                        size={isPhone ? 32 : 40}
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
