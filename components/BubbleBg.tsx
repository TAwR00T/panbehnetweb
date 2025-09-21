
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const randomBorderRadius = () => [
    "40% 60% 70% 30% / 40% 30% 70% 60%",
    "60% 40% 30% 70% / 50% 60% 40% 50%",
    "30% 70% 60% 40% / 70% 40% 60% 30%",
    "40% 60% 70% 30% / 40% 30% 70% 60%",
];

const generateBubbles = (count, { sizeMin, sizeMax, durationMin, durationMax, blur, opacity }) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * (sizeMax - sizeMin) + sizeMin,
        delay: Math.random() * 15,
        duration: Math.random() * (durationMax - durationMin) + durationMin,
        borderRadiusDuration: Math.random() * 10 + 10,
        blur,
        opacity,
    }));
};

function BubbleBg() {
  const [farBubbles, setFarBubbles] = useState<any[]>([]);
  const [nearBubbles, setNearBubbles] = useState<any[]>([]);

  useEffect(() => {
    // Slower, smaller, more blurred background bubbles for parallax effect
    setFarBubbles(generateBubbles(20, { 
        sizeMin: 20, sizeMax: 80, 
        durationMin: 60, durationMax: 100, 
        blur: 'blur-2xl', opacity: 'from-yellow-100/40 via-orange-200/30 to-amber-300/30'
    }));
    // Faster, larger, sharper foreground bubbles for parallax effect
    setNearBubbles(generateBubbles(8, { 
        sizeMin: 150, sizeMax: 300, 
        durationMin: 20, durationMax: 40,
        blur: 'blur-lg', opacity: 'from-yellow-100/60 via-orange-200/50 to-amber-300/50'
    }));
  }, []);

  const renderBubbleLayer = (bubbles) => bubbles.map((b) => (
    <motion.div
      key={b.id}
      {...{
        className: `absolute bg-gradient-to-br ${b.opacity} ${b.blur}`,
        style: {
          left: `${b.left}%`,
          top: `${b.top}%`,
          width: b.size,
          height: b.size,
        },
        initial: { y: "110vh", opacity: 0, x: `${b.left}%` },
        animate: {
          y: "-110vh",
          x: `${b.left + (Math.random() - 0.5) * 50}%`,
          opacity: [0, 1, 1, 0],
          borderRadius: randomBorderRadius(),
        },
        transition: {
          duration: b.duration,
          delay: b.delay,
          repeat: Infinity,
          ease: "linear",
          opacity: { duration: b.duration, ease: 'easeInOut' },
          borderRadius: {
              duration: b.borderRadiusDuration,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror"
          }
        }
      }}
    />
  ));

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {renderBubbleLayer(farBubbles)}
        {renderBubbleLayer(nearBubbles)}
    </div>
  );
}

export default BubbleBg;
