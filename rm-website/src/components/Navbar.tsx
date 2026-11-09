// src/components/Navbar.tsx

import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { normalizePath } from "./PageTransition";

type NavItem = {
  text: string;
  to: string;
  download?: boolean;
  external?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { text: "Portfolio",      to: "/" },
  { text: "About",     to: "/about" },
  { text: "Resume", to: `royce-mettler-resume.pdf`, external: true },
  { text: "Contact",   to: "/contact" },
];

const stagger = 0.01;
const duration = 0.2;

const LetterMotion = ({
  letter,
  index,
  total,
  isHovering,
}: {
  letter: string;
  index: number;
  total: number;
  isHovering: boolean;
}) => {
  const delay = isHovering ? index * stagger : (total - index - 1) * stagger;

  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      <motion.span
        initial={false}
        animate={{ y: isHovering ? "-100%" : "0%" }}
        transition={{ duration, delay, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <span className="text-white">{letter}</span>
      </motion.span>

      <motion.span
        initial={false}
        animate={{ y: isHovering ? "0%" : "100%" }}
        transition={{ duration, delay, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <span className="text-indigo-300">{letter}</span>
      </motion.span>

      <span className="invisible">{letter}</span>
    </span>
  );
};

// On phones the links get padding so each is a comfortable tap target.
const linkClass = "inline-block phone:px-2.5 phone:py-1.5";

const AnimatedNavItem: React.FC<NavItem> = ({
  text,
  to,
  external = false,
}) => {
  const [hover, setHover] = React.useState(false);
  const { pathname } = useLocation();
  const isCurrent = !external && normalizePath(pathname) === normalizePath(to);
  const letters = text.split("");

  return (
    <li
      // Mouse only: on a touch screen a tap would leave the hover colour stuck.
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="cursor-pointer"
    >
      {external ? (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {letters.map((char, i) => (
            <LetterMotion
              key={i}
              letter={char}
              index={i}
              total={letters.length}
              isHovering={hover}
            />
          ))}
        </a>
      ) : (
        <Link
          to={to}
          className={linkClass}
          // Already here: don't push a duplicate history entry.
          onClick={(e) => isCurrent && e.preventDefault()}
        >
          {letters.map((char, i) => (
            <LetterMotion
              key={i}
              letter={char}
              index={i}
              total={letters.length}
              isHovering={hover}
            />
          ))}
        </Link>
      )}
    </li>
  );
};

// Desktop: transparent, and only the name and links take the pointer, so the
// rest of the bar doesn't block the carousel underneath. Phones: a compact,
// dark, blurred bar, since pages scroll underneath it.
const Navbar: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent pointer-events-none phone:pointer-events-auto phone:bg-black/60 phone:backdrop-blur-md phone:border-b phone:border-white/10">
    <div className="flex flex-col items-center py-4 px-6 phone:pt-2 phone:pb-0.5 phone:px-2">
      <div className="pointer-events-auto text-2xl font-bold mb-2 text-white phone:text-lg phone:leading-6 phone:mb-0">
        Royce Mettler
      </div>
      <ul className="pointer-events-auto flex flex-wrap justify-center space-x-6 text-sm font-medium phone:space-x-0 phone:text-[15px]">
        {NAV_ITEMS.map((item) => (
          <AnimatedNavItem
            key={item.text}
            text={item.text}
            to={item.to}
            download={item.download}
            external={item.external}
          />
        ))}
      </ul>
    </div>
  </nav>
);

export default Navbar;
