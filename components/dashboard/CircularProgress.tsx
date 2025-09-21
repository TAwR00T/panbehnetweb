
import React from 'react';
import { motion } from 'framer-motion';

interface CircularProgressProps {
    progress: number; // 0 to 100
    value: string;
    label: string;
    size?: number;
    strokeWidth?: number;
    color?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ 
    progress, 
    value,
    label,
    size = 110, 
    strokeWidth = 10, 
    color = "#7c3aed" 
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    className="opacity-50"
                />
                <motion.circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ strokeDasharray: circumference }}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-gray-800">{value}</span>
                <span className="text-xs font-bold text-gray-500 mt-1">{label}</span>
            </div>
        </div>
    );
};

export default CircularProgress;