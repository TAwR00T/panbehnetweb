
import React from 'react';

const BackgroundPattern = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-soft-light">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="soft-dots" width="40" height="40" patternUnits="userSpaceOnUse">
             <circle cx="20" cy="20" r="1.5" fill="black" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#soft-dots)" />
      </svg>
    </div>
  );
};

export default BackgroundPattern;
