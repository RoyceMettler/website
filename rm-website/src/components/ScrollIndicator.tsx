// ScrollIndicator.tsx

import React from 'react';

interface ScrollIndicatorProps {
  scrollPosition: number;
  /** Apply the opacity at once instead of fading to it. */
  instant?: boolean;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ scrollPosition, instant = false }) => {
  const opacity = Math.max(0, 1 - scrollPosition / 200);
  
  return (
    <div 
      className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-30 ${
        instant ? '' : 'transition-opacity duration-300'
      }`}
      style={{ opacity }}
    >
      <div className="flex flex-col items-center text-white">
        <p className="text-sm font-medium">Scroll Down</p>
      </div>
    </div>
  );
};

export default ScrollIndicator;