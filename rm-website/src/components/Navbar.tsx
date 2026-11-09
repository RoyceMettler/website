// src/components/Navbar.tsx

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { normalizePath } from "./PageTransition";
import { useIsPhone } from "../hooks/useMediaQuery";

type NavItem = {
  text: string;
  to: string;
  download?: boolean;
  external?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { text: "Portfolio",      to: "/" },
  { text: "About",     to: "/about" },
  { text: "Resume", to: "/royce-mettler-resume.pdf", external: true },
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
        <Link
          to={to}
          className="inline-block"
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
// rest of the bar doesn't block the carousel underneath.
const DesktopNav: React.FC = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent pointer-events-none">
    <div className="flex flex-col items-center py-4 px-6">
      <div className="pointer-events-auto text-2xl font-bold mb-2 text-white">Royce Mettler</div>
      <ul className="pointer-events-auto flex flex-wrap justify-center space-x-6 text-sm font-medium">
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

/** Hamburger lines that turn into an X. */
const MenuIcon: React.FC<{ open: boolean; reduced: boolean }> = ({ open, reduced }) => {
  const transition = reduced ? { duration: 0 } : { duration: 0.25, ease: "easeInOut" as const };
  return (
    <span aria-hidden="true" className="relative block h-3.5 w-5">
      <motion.span
        className="absolute left-0 top-0 h-0.5 w-5 rounded-full bg-white"
        animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
      <motion.span
        className="absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-white"
        animate={{ opacity: open ? 0 : 1 }}
        transition={transition}
      />
      <motion.span
        className="absolute left-0 top-3 h-0.5 w-5 rounded-full bg-white"
        animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
    </span>
  );
};

// Phones: a slim dark bar with the name and a round menu button, which opens
// a full-screen menu with big tap targets.
const PhoneNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const reduced = !!useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const here = normalizePath(pathname);

  // Close whenever the page changes, including Back/Forward.
  useEffect(() => {
    setOpen(false);
  }, [here]);

  // While open: the page behind can't scroll and is inert (no Tab or
  // screen-reader access), Escape / Android back close the menu, and focus
  // starts on the first link.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const page = document.getElementById("page-content");
    const previous = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    // Keep the layout from shifting when a classic scrollbar disappears.
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    page?.setAttribute("inert", "");
    firstLinkRef.current?.focus({ preventScroll: true });

    const closeAndRefocus = () => {
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAndRefocus();
    window.addEventListener("keydown", onKey);
    // Android's back gesture closes the menu instead of leaving the page,
    // where the browser supports it (Chromium's CloseWatcher).
    type Watcher = { onclose: (() => void) | null; destroy: () => void };
    const Ctor = (window as unknown as { CloseWatcher?: new () => Watcher }).CloseWatcher;
    let watcher: Watcher | undefined;
    try {
      if (Ctor) {
        watcher = new Ctor();
        watcher.onclose = closeAndRefocus;
      }
    } catch {
      watcher = undefined;
    }
    return () => {
      root.style.overflow = previous.overflow;
      root.style.paddingRight = previous.paddingRight;
      page?.removeAttribute("inert");
      window.removeEventListener("keydown", onKey);
      watcher?.destroy();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50" aria-label="Main">
      {/* The bar sits above the open menu so its button can close it. The
          blur lives here, not on <nav>: a backdrop-filter on <nav> would
          trap the full-screen menu inside the bar. */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-black/60 py-2.5 pl-4 pr-3 backdrop-blur-md">
        <span className="text-lg font-bold text-white">Royce Mettler</span>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="phone-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
          className="grid h-11 w-11 place-items-center rounded-full bg-indigo-500 shadow-lg transition-transform active:scale-95 [-webkit-tap-highlight-color:transparent] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
        >
          <MenuIcon open={open} reduced={reduced} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="phone-menu"
            key="phone-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            // Starts below the bar and scrolls if it must (phones held
            // sideways); m-auto centres the list only when there is room.
            className="fixed inset-0 flex flex-col overflow-y-auto overscroll-contain bg-black/85 pt-[4.25rem] pb-6 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            // A tap anywhere but a link closes the menu.
            onClick={(e) => !(e.target as Element).closest("a") && close()}
          >
            <ul className="m-auto flex flex-col items-center gap-4">
              {NAV_ITEMS.map((item, i) => {
                const current = !item.external && here === normalizePath(item.to);
                const className =
                  "block px-6 py-2 text-3xl font-bold transition-colors [-webkit-tap-highlight-color:transparent] active:text-indigo-300 " +
                  // Current page: colour plus an underline, not colour alone.
                  (current ? "text-indigo-300 underline decoration-2 underline-offset-8" : "text-white");
                return (
                  <motion.li
                    key={item.text}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: reduced ? 0 : 0.04 + i * 0.05, ease: "easeOut" }}
                  >
                    {item.external ? (
                      <a
                        ref={i === 0 ? firstLinkRef : undefined}
                        href={item.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                        onClick={close}
                      >
                        {item.text}
                      </a>
                    ) : (
                      <Link
                        ref={i === 0 ? firstLinkRef : undefined}
                        to={item.to}
                        className={className}
                        aria-current={current ? "page" : undefined}
                        onClick={(e) => {
                          // Already here: just close, don't push a duplicate entry.
                          if (current) e.preventDefault();
                          close();
                        }}
                      >
                        {item.text}
                      </Link>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Navbar: React.FC = () => (useIsPhone() ? <PhoneNav /> : <DesktopNav />);

export default Navbar;
