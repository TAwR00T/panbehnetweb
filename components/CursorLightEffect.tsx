
import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorLightEffect = () => {
    const mouse = {
        x: useMotionValue(0),
        y: useMotionValue(0)
    };

    const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
    const smoothMouse = {
        x: useSpring(mouse.x, smoothOptions),
        y: useSpring(mouse.y, smoothOptions)
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            // Center the light on the cursor
            mouse.x.set(clientX - 500); // Adjust size offset
            mouse.y.set(clientY - 500); // Adjust size offset
        };
        
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mouse.x, mouse.y]);

    return (
        <motion.div
            className="pointer-events-none fixed z-10"
            style={{
                width: 1000,
                height: 1000,
                background: 'radial-gradient(circle, rgba(255, 235, 59, 0.7) 0%, rgba(251, 146, 60, 0.25) 40%, transparent 70%)',
                x: smoothMouse.x,
                y: smoothMouse.y,
            } as any}
        />
    );
};

export default CursorLightEffect;
