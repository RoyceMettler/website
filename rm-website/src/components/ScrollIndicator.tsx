// ScrollIndicator.tsx

import React from 'react';

interface ScrollIndicatorProps {
  scrollPosition: number;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ scrollPosition }) => {
  const opacity = Math.max(0, 1 - scrollPosition / 200);
  
  return (
    <div 
      className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-30 transition-opacity duration-300"
      style={{ opacity }}
    >
      <div className="flex flex-col items-center text-white">
        <p className="mb-2 text-sm font-medium">Scroll Down for my Portfolio</p>
        <svg 
          className="w-6 h-6 scroll-hint" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
    </div>
  );
};

export default ScrollIndicator;