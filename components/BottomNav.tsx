
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Rocket, MessageCircleQuestion, Bot } from 'lucide-react';
import { PanbehCharacterAnimated } from './PanbehCharacterAnimated';

const navItems = [
    { id: 'home', icon: <Home size={24} />, href: '#home', label: 'خانه' },
    { id: 'features', icon: <Rocket size={24} />, href: '#features', label: 'ویژگی‌ها' },
    { id: 'cta', icon: null, href: '#plans', label: 'شروع رایگان و خرید پلن' },
    { id: 'chat', icon: <Bot size={24} />, href: '#', label: 'چت‌بات هوشمند' },
    { id: 'faq', icon: <MessageCircleQuestion size={24} />, href: '#faq', label: 'سوالات متداول' },
];

const useActiveSection = (sectionIds: string[]) => {
    const [activeSection, setActiveSection] = useState<string>(sectionIds[0]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            // A section is active if it's in the middle of the viewport
            { rootMargin: '-40% 0px -60% 0px' } 
        );

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => {
            sectionIds.forEach((id) => {
                const el = document.getElementById(id);
                if (el) observer.unobserve(el);
            });
        };
    }, [sectionIds]);

    return activeSection;
};

const BottomNav = () => {
    const sectionIds = ['home', 'features', 'plans', 'faq', 'airdrop', 'calculator'];
    const activeSection = useActiveSection(sectionIds);

    const getActiveItemId = () => {
        if (activeSection === 'plans' || activeSection === 'airdrop' || activeSection === 'calculator') return 'cta';
        return activeSection;
    };
    
    const activeItemId = getActiveItemId();

    return (
        <motion.nav
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 25, delay: 0.8 }}
            className="fixed bottom-0 left-0 w-full h-16 bg-white/70 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.1)] z-50 border-t border-white/40 flex items-center justify-around px-2 lg:hidden"
        >
            {navItems.map((item) => {
                const isAuthTrigger = item.id === 'cta';
                const isChatTrigger = item.id === 'chat';

                if (item.id === 'cta') {
                    return (
                        <motion.button
                            key={item.id}
                            className="auth-trigger relative -top-6"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9, rotate: -5 }}
                            aria-label={item.label}
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40 border-4 border-white">
                                <PanbehCharacterAnimated float={false} size={40} />
                            </div>
                        </motion.button>
                    );
                }

                const isActive = activeItemId === item.id;

                return (
                    <a key={item.id} href={item.href} className={`relative flex-1 flex flex-col items-center justify-center h-full rounded-2xl transition-colors duration-300 text-gray-600 focus:outline-none focus:text-orange-600 ${isChatTrigger ? 'chat-trigger' : (isAuthTrigger ? 'auth-trigger' : '')}`} aria-label={item.label}>
                        <div className="relative flex flex-col items-center pt-1">
                             <motion.div 
                                className={`relative transition-colors duration-300 ${isActive ? 'text-orange-600' : 'hover:text-orange-500'}`}
                                animate={{ y: isActive ? -2 : 0 }}
                            >
                                {item.icon}
                            </motion.div>
                            <motion.span 
                                className="text-[10px] font-bold text-orange-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isActive ? 1 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                               {item.label}
                            </motion.span>
                        </div>
                         <AnimatePresence>
                         {isActive && (
                            <motion.div
                                className="absolute inset-2 bg-orange-100/80 rounded-xl -z-10"
                                layoutId="active-nav-indicator"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            />
                         )}
                         </AnimatePresence>
                    </a>
                );
            })}
        </motion.nav>
    );
};

export default BottomNav;
