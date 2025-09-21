
import React from 'react';
import { motion } from 'framer-motion';

const sunbeams = [
    { rotate: 0, duration: 35, delay: 0 },
    { rotate: 40, duration: 40, delay: 2 },
    { rotate: -40, duration: 45, delay: 4 },
];

const SunbeamEffect = () => {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200vw] h-[150vh] z-0 pointer-events-none overflow-hidden mix-blend-soft-light">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
        {sunbeams.map((beam, index) => (
          <motion.div
            key={index}
            {...{
              className: 'absolute top-0 left-1/2 w-[20%] h-[200%]',
              style: {
                background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 235, 59, 0.4) 0%, transparent 70%)',
                transformOrigin: '50% 0%',
              },
              initial: { rotate: beam.rotate, opacity: 0 },
              animate: { 
                rotate: beam.rotate + 20,
                opacity: [0, 0.9, 0]
              },
              transition: {
                rotate: {
                  duration: beam.duration,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatType: 'loop',
                },
                opacity: {
                    duration: beam.duration / 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: beam.delay,
                    repeatType: 'mirror',
                }
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SunbeamEffect;
