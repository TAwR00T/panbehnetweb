
import React from 'react';
import { motion } from 'framer-motion';
import { PanbehCharacterAnimated } from './PanbehCharacterAnimated';
import { Bot, Send } from 'lucide-react';

const ChatWindowMockup = () => {
    const messageVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring' as const,
                stiffness: 200,
                damping: 20,
                delay: 0.5 + i * 0.4
            }
        })
    };

    return (
        <motion.div
            className="relative w-[320px] h-[400px] z-10"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
            {/* Base layer with data stream background */}
            <div className="absolute inset-0 bg-white/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                 <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
                     <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="data-stream" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                <motion.path d="M 0,10 L 40,10 M 0,30 L 40,30" stroke="#a78bfa" strokeWidth="0.5"
                                     initial={{ strokeDashoffset: 40 }}
                                     animate={{ strokeDashoffset: [40, 0, 40] }}
                                     transition={{ duration: 3, repeat: Infinity, ease: "linear" as const }}
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#data-stream)" />
                    </svg>
                </div>
            </div>

             {/* Sheen Effect */}
            <motion.div
                className="absolute inset-0 rounded-3xl overflow-hidden"
                style={{ transform: 'translateZ(1px)' }}
            >
                <motion.div
                    className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    animate={{ x: ['0%', '350%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: [0.1, 0.25, 0.75, 0.9], delay: 1.5 }}
                />
            </motion.div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col overflow-hidden rounded-3xl">
                {/* Chat Header */}
                <div className="p-3 bg-white/80 rounded-t-3xl flex items-center gap-3 border-b border-gray-200/50 flex-shrink-0">
                    <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center border-2 border-white">
                        <PanbehCharacterAnimated size={30} float={false} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">دستیار پنبه</p>
                        <p className="text-xs text-green-600 font-semibold">● آنلاین</p>
                    </div>
                </div>

                {/* Chat Body */}
                <div className="flex-grow p-4 space-y-4">
                    <motion.div variants={messageVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="flex items-end gap-2">
                        <div className="text-sm p-3 rounded-2xl rounded-bl-none bg-gray-200 text-gray-800 max-w-[80%]">
                            سلام! چطور میتونم کمکت کنم؟
                        </div>
                    </motion.div>
                    <motion.div variants={messageVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="flex items-end gap-2 justify-end">
                        <div className="text-sm p-3 rounded-2xl rounded-br-none bg-blue-500 text-white max-w-[80%]">
                            میخوام اشتراک یکماهه بخرم!
                        </div>
                    </motion.div>
                    <motion.div variants={messageVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} className="flex items-end gap-2">
                        <div className="flex gap-1.5 items-center text-sm p-3 rounded-2xl rounded-bl-none bg-gray-200 text-gray-500">
                            <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0,-3,0]}} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0 }} />
                            <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0,-3,0]}} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
                            <motion.span className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0,-3,0]}} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
                        </div>
                    </motion.div>
                </div>
                
                {/* Chat Input */}
                <div className="p-3 border-t border-gray-200/50 flex-shrink-0">
                    <div className="flex items-center gap-2 bg-white/70 rounded-full p-1 pl-3">
                        <p className="flex-grow bg-transparent text-sm text-gray-400 focus:outline-none px-2">پیام خود را بنویسید...</p>
                        <div className="p-2 bg-gray-300 rounded-full text-white cursor-not-allowed">
                            <Send size={16} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const textContentVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        }
    }
};

const textChildVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
        opacity: 1, 
        x: 0,
        transition: { type: 'spring' as const, stiffness: 100 }
    }
};

const CircuitryBackground = () => (
    <div className="absolute inset-0 z-0 opacity-20 mix-blend-screen overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="circuit-pattern" width="200" height="200" patternUnits="userSpaceOnUse">
                     <motion.path d="M 50 0 V 50 H 100 V 100 H 150 V 200" fill="none" stroke="#a78bfa" strokeWidth="1" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' as const }}
                    />
                     <motion.path d="M 0 150 H 50 V 100 H 100 V 50 H 200" fill="none" stroke="#f472b6" strokeWidth="1" 
                        initial={{ pathLength: 1 }}
                        animate={{ pathLength: 0 }}
                        transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' as const }}
                     />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
    </div>
);

const ChatbotIntroSection = () => {
    return (
        <section id="chatbot-intro" className="w-full py-20 sm:py-28 relative z-10 overflow-hidden bg-gradient-to-b from-indigo-900 to-gray-900">
             <CircuitryBackground />
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 gap-x-8 items-center">
                    
                    {/* Text Content Column: Order first on mobile, second on desktop */}
                    <motion.div 
                        className="text-center lg:text-right order-2 lg:order-1"
                        variants={textContentVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                         <motion.h2 variants={textChildVariants} className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                            آینده پشتیبانی، امروز در دستان شما
                        </motion.h2>
                        <motion.p variants={textChildVariants} className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                             دیگر منتظر پاسخ نمانید. دستیار هوشمند پنبه، ۲۴ ساعته و در یک چشم به هم زدن آماده است تا شما را برای خرید، راهنمایی و رفع هر مشکلی همراهی کند.
                        </motion.p>
                        <motion.div variants={textChildVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <motion.button 
                                className="chat-trigger text-lg rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-8 py-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 mx-auto lg:mx-0"
                                animate={{
                                    boxShadow: [
                                        '0 10px 20px -5px rgba(124, 58, 237, 0.4)',
                                        '0 15px 30px -5px rgba(124, 58, 237, 0.6)',
                                        '0 10px 20px -5px rgba(124, 58, 237, 0.4)',
                                    ]
                                }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const }}
                            >
                                <Bot size={24} />
                                <span>شروع گفتگو با دستیار هوشمند</span>
                            </motion.button>
                        </motion.div>
                    </motion.div>

                     {/* Visuals Column: Order second on mobile, first on desktop */}
                    <div className="relative flex flex-col items-center justify-center order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.8 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
                            className="z-20"
                        >
                            <PanbehCharacterAnimated size={180} />
                        </motion.div>
                        <div className="-mt-16">
                            <ChatWindowMockup />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChatbotIntroSection;