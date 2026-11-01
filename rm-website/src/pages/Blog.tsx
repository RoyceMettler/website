// src/pages/Blog.tsx

import React from 'react';
import TiltWrapper from '../components/TiltWrapper';

const Blog: React.FC = () => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-20 min-h-screen text-white">
      <div className="w-full px-12 md:px-20 lg:px-32 flex flex-col items-center justify-center text-center">
        <TiltWrapper
          maxTilt={4}
          transitionSpeed={1000}
          hoverScaleEffect
        >
          <h1 className="text-9xl font-extrabold text-indigo-300 drop-shadow-xl">
            Coming Soon!
          </h1>
        </TiltWrapper>
      </div>
    </div>
  );
};

export default Blog;
