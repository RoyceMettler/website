// src/components/Navbar.tsx

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

const AnimatedNavItem: React.FC<NavItem> = ({
  text,
  to,
  external = false,
}) => {
  const [hover, setHover] = React.useState(false);
  const letters = text.split("");

  return (
    <li
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="cursor-pointer"
    >
      {external ? (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
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
        <Link to={to} className="inline-block">
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

const Navbar: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 bg-transparent z-50">
    <div className="flex flex-col items-center py-4 px-6">
      <div className="text-2xl font-bold mb-2 text-white">Royce Mettler</div>
      <ul className="flex flex-wrap justify-center space-x-6 text-sm font-medium">
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
