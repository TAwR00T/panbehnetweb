import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PanbehProps {
    float?: boolean;
    size?: number;
    expression?: 'default' | 'excited' | 'wow' | 'writing' | 'thinking';
}

const randomDelay = () => Math.random() * 3;

export function PanbehCharacterAnimated({ float = true, size = 120, expression = 'default' }: PanbehProps) {
  const floatAnimation = float
    ? { y: [0, -size * 0.05, 0], rotate: [-1, 1.5, -1] }
    : { y: 0, rotate: 0 };

  const floatTransition = float
    ? { 
        y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
        rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" as const }
      }
    : {};

    const smilePath = {
        default: "M88 128 Q100 142 112 128",
        excited: "M85 125 Q100 148 115 125",
        wow: "M88 128 Q100 132 112 128",
        writing: "M90 130 Q100 125 110 130",
        thinking: "M95 128 C 100 132, 100 132, 105 128"
    };

  return (
    <motion.div
      animate={floatAnimation}
      transition={floatTransition}
      className="drop-shadow-lg"
      style={{ width: size, height: size }}
    >
        <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shadow */}
            <motion.ellipse
                cx="100"
                cy="170"
                rx="60"
                ry="15"
                fill="#000"
                opacity={0.1}
                animate={{ scale: [1, 0.95, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const }}
            />
            
            <AnimatePresence>
              {expression === 'thinking' && (
                <motion.g
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <path d="M40 30 C 50 10, 80 10, 90 30 C 100 15, 120 15, 130 30" stroke="#D1D5DB" strokeWidth="5" strokeLinecap="round" fill="none"/>
                  <circle cx="35" cy="45" r="4" fill="#D1D5DB" />
                  <circle cx="28" cy="60" r="2" fill="#D1D5DB" />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Base */}
            <path d="M45 155C55 165, 145 165, 155 155C160 152.5, 160 147.5, 155 145L45 145C40 147.5, 40 152.5, 45 155Z" fill="#A5F3FC"/>
            <path d="M45 145C40 147.5, 40 152.5, 45 155" stroke="#164E63" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M155 145C160 147.5, 160 152.5, 155 155" stroke="#164E63" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>

            {/* Main Body with Breathing */}
            <motion.g 
                animate={{ scale: [1.0, 1.015, 1.0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
            >
                <circle cx="100" cy="100" r="70" fill="white"/>
                <circle cx="100" cy="100" r="70" stroke="#E5E7EB" strokeWidth="6"/>

                {/* Ears with Wiggle */}
                <motion.g 
                    animate={{ rotate: [0, 2, -1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const, delay: 0.2 }}
                >
                    <circle cx="45" cy="50" r="22" fill="white" stroke="#E5E7EB" strokeWidth="5"/>
                </motion.g>
                <motion.g 
                    animate={{ rotate: [0, -1, 2, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" as const }}
                >
                    <circle cx="155" cy="50" r="22" fill="white" stroke="#E5E7EB" strokeWidth="5"/>
                </motion.g>

                {/* Glowing Cheeks */}
                <motion.circle 
                    cx="65"
                    cy="118"
                    r="14"
                    fill="#FECDD3"
                    animate={{ fill: ["#FECDD3", "#FBADC1", "#FECDD3"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
                />
                <motion.circle 
                    cx="135"
                    cy="118"
                    r="14"
                    fill="#FECDD3"
                    animate={{ fill: ["#FECDD3", "#FBADC1", "#FECDD3"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 }}
                />

                {/* Eyes and Glasses */}
                <g>
                    <circle cx="82" cy="100" r="20" stroke="#D1D5DB" strokeWidth="6"/>
                    <circle cx="118" cy="100" r="20" stroke="#D1D5DB" strokeWidth="6"/>
                    <path d="M100 95 L100 105" stroke="#D1D5DB" strokeWidth="6" strokeLinecap="round"/>
                    
                    {/* Blinking Eyes */}
                    <motion.circle 
                        cx="82"
                        cy="100"
                        r="5"
                        fill="#1F2937"
                        animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const, delay: 1 }}
                    />
                    <motion.circle 
                        cx="118"
                        cy="100"
                        r="5"
                        fill="#1F2937"
                        animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const, delay: 1 }}
                    />
                </g>
                
                {/* Smile */}
                 <AnimatePresence mode="wait">
                    <motion.path
                        key={expression}
                        d={smilePath[expression] || smilePath.default}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        stroke="#F472B6" strokeWidth="5" fill="none" strokeLinecap="round"
                    />
                </AnimatePresence>
                {expression === 'wow' && (
                    <motion.ellipse cx="100" cy="138" rx="8" ry="6" fill="#F472B6" opacity={0.4} 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    />
                )}

                {/* Excitement Sparkles */}
                <AnimatePresence>
                {(expression === 'excited' || expression === 'wow') && (
                    <motion.g
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                    >
                        <motion.path 
                            d="M70 85 L72 80 L74 85 L79 87 L74 89 L72 94 L70 89 L65 87 Z"
                            fill="#FFD700"
                            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], rotate: [0, 45, 90] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0, ease: 'easeInOut' }}
                        />
                        <motion.path 
                            d="M130 85 L132 80 L134 85 L139 87 L134 89 L132 94 L130 89 L125 87 Z"
                            fill="#FFD700"
                            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], rotate: [0, -45, -90] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
                        />
                    </motion.g>
                )}
                </AnimatePresence>
                
                 <AnimatePresence>
                  {expression === 'writing' && (
                    <motion.g 
                      initial={{ opacity: 0, y: 20, rotate: -20 }}
                      animate={{ opacity: 1, y: 0, rotate: 15 }}
                      exit={{ opacity: 0, y: 20, rotate: -20 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                       <path d="M150 110 L165 95 L180 110 L170 120 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="4" strokeLinejoin="round" />
                       <rect x="163" y="108" width="7" height="30" fill="#FDE68A" transform="rotate(45 163 108)" />
                       <path d="M150 110 L145 115" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
                    </motion.g>
                  )}
                </AnimatePresence>


                {/* Forehead Dot */}
                <circle cx="100" cy="62" r="6" fill="#FBBF24" opacity="0.8"/>
                <circle cx="105" cy="65" r="5" fill="#F472B6" opacity="0.8"/>
                <circle cx="95" cy="65" r="4" fill="#A5F3FC" opacity="0.8"/>
            </motion.g>

            {/* Fantasy Sparkles */}
            <g>
                <motion.path 
                    d="M160 80 L162 75 L164 80 L169 82 L164 84 L162 89 L160 84 L155 82 Z"
                    fill="#FFFFFF"
                    animate={{ opacity: [0, 1, 0, 0], scale: [0.5, 1, 0.5, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity, delay: randomDelay() }}
                />
                 <motion.path 
                    d="M50 125 L52 120 L54 125 L59 127 L54 129 L52 134 L50 129 L45 127 Z"
                    fill="#FFFFFF"
                    animate={{ opacity: [0, 0, 1, 0], scale: [0.5, 0.5, 1, 0.5] }}
                    transition={{ duration: 5, repeat: Infinity, delay: randomDelay() }}
                />
                 <motion.path 
                    d="M140 40 L142 35 L144 40 L149 42 L144 44 L142 49 L140 44 L135 42 Z"
                    fill="#FFFFFF"
                    animate={{ opacity: [0, 1, 0, 0], scale: [0.5, 1, 0.5, 0.5] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: randomDelay() }}
                />
            </g>
        </svg>
    </motion.div>
  );
}