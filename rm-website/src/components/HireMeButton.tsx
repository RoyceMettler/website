// src/components/HireMeButton.tsx

import React from "react";
import { motion } from "framer-motion";

interface InteractiveButtonProps {
  text: string;
  onClick?: () => void;
  width?: number;
  height?: number;
  outlined?: boolean;
}

const HireMeButton: React.FC<InteractiveButtonProps> = ({
  text,
  onClick,
  width = 220,
  height = 100,
  outlined = false,
}) => {
  return (
    <motion.div
      onClick={onClick}
      className="relative cursor-pointer rounded-lg"
      style={{ width, height }}
      whileHover="hover"
      initial="rest"
      animate="rest"
      variants={{
        rest: { scale: 1 },
        hover: { scale: 1.2 },
      }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <motion.div
          className={`absolute inset-0 ${outlined ? "bg-white" : "bg-indigo-300"}`}
          variants={{
            rest: { scaleX: 0, originX: 0.5 },
            hover: { scaleX: 1, originX: 0.5 },
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        />
      </div>

      {outlined && (
        <div className="absolute inset-0 rounded-lg border-2 border-indigo-500" />
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-bold text-2xl relative z-10 ${
            outlined ? "text-indigo-500" : "text-black"
          }`}
        >
          {text}
        </span>
      </div>
    </motion.div>
  );
};

export default HireMeButton;