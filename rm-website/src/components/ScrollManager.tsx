// src/components/ScrollManager.tsx

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const scrollToBottomSources = [
  "/ai-engineer-at-vitu",
  "/ai-research",
  "/multimania",
  "/blog",
  "/squingo",
  "/unipsycho",
  "/tech-help",
  "/district-65",
  "/crafty",
  "/police-complaints",
  "/model-un",
  "/music",
];

const ScrollManager: React.FC = () => {
  const { pathname } = useLocation();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === "/") {
      if (prevPath.current && scrollToBottomSources.includes(prevPath.current)) {
        sessionStorage.setItem("skipHeroAnimation", "true");
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "auto",
        });
      } else {
  window.scrollTo({ top: 0, behavior: "auto" });
      }
    } else {
  window.scrollTo({ top: 0, behavior: "auto" });
    }

    prevPath.current = pathname;
  }, [pathname]);

  return null;
};

export default ScrollManager;
