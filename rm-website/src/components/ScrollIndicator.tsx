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
        <p className="text-sm font-medium">Scroll Down for my Portfolio</p>
      </div>
    </div>
  );
};

export default ScrollIndicator;