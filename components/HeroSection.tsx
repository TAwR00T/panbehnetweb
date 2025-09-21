
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { PlayCircle, Download, X } from 'lucide-react';
import { PanbehCharacterAnimated } from './PanbehCharacterAnimated';

// --- Particle Burst Component for Button Click ---
const ClickBurst = ({ onComplete }) => {
    const particles = Array.from({ length: 12 });
    return (
        <div className="absolute inset-0 pointer-events-none">
            {particles.map((_, i) => {
                const angle = (i / particles.length) * 360;
                const radius = Math.random() * 40 + 40; 
                const x = Math.cos(angle * (Math.PI / 180)) * radius;
                const y = Math.sin(angle * (Math.PI / 180)) * radius;

                return (
                    <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-pink-400 rounded-full"
                        style={{ transform: 'translate(-50%, -50%)' }}
                        initial={{ scale: 0.5, opacity: 1 }}
                        animate={{ x: `${x}px`, y: `${y}px`, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: Math.random() * 0.1 }}
                        onAnimationComplete={i === 0 ? onComplete : undefined}
                    />
                );
            })}
        </div>
    );
};


// --- VideoModal Component ---
interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;
}

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
    exit: { opacity: 0, scale: 0.85, y: 50, transition: { duration: 0.3, ease: 'easeIn' as const } },
};

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoId }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                    aria-modal="true"
                    role="dialog"
                >
                    <motion.div
                        className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl border border-white/30"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                    >
                         <button
                            onClick={onClose}
                            className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-lg hover:bg-rose-100 hover:text-rose-600 hover:scale-110 hover:rotate-90 transition-all duration-300 z-10"
                            aria-label="بستن ویدیو"
                        >
                            <X size={24} />
                        </button>
                        <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-2xl">
                             <iframe
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                                title="پخش کننده ویدیو یوتیوب"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- End of VideoModal Component ---


const tags = [
    { text: "آنلاین ✨", className: "bg-gradient-to-br from-teal-300/90 to-green-400/90 text-teal-900 border-teal-200/50", position: "top-10 left-0", rotation: -15, delay: 0.8, duration: 3.5 },
    { text: "سریع 🚀", className: "bg-gradient-to-br from-amber-300/90 to-yellow-400/90 text-amber-900 border-amber-200/50", position: "top-0 right-8", rotation: 15, delay: 1, duration: 4 },
    { text: "پنبه‌ای ⚡", className: "bg-gradient-to-br from-yellow-300/90 to-orange-400/90 text-orange-900 border-yellow-200/50", position: "top-24 -right-4", rotation: -10, delay: 1.2, duration: 4.5 },
    { text: "امن 🔒", className: "bg-gradient-to-br from-purple-300/90 to-indigo-400/90 text-purple-900 border-purple-200/50", position: "bottom-8 left-4", rotation: 10, delay: 1.4, duration: 3.8 },
];

const HeroSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bursts, setBursts] = useState([]);

    const addBurst = () => {
        setBursts(prev => [...prev, { id: Date.now() }]);
    };

    const removeBurst = (id) => {
        setBursts(prev => prev.filter(b => b.id !== id));
    };


    return (
        <>
            <section id="home" className="w-full pt-36 pb-20 sm:pb-28 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Text Column */}
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-right order-2 lg:order-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm text-purple-700 font-semibold px-4 py-2 rounded-full mb-6 border border-purple-200"
                            >
                                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                                اولین VPN هوشمند فارسی
                            </motion.div>

                            <motion.h1
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", duration: 0.8, delay: 0.4 }}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-500 drop-shadow-md"
                            >
                                اینترنت آزاد برای همه
                            </motion.h1>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.6 }}
                                className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
                            >
                            تجربه‌ای بی‌نظیر از اتصال امن و سریع با بیش از ۱۰۰ هزار کاربر راضی. <br className="hidden sm:block"/>
                            <span className="text-sm font-semibold text-gray-600">رمزگذاری نظامی • سرعت فوق‌العاده • پشتیبانی ۲۴ ساعته</span>
                            </motion.p>
                            
                             <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.8 }}
                                className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 w-full"
                            >
                                <Button 
                                    onClick={addBurst}
                                    className="auth-trigger relative overflow-hidden w-full sm:w-auto text-lg rounded-full bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-lg shadow-pink-500/30 px-8 py-4 font-bold flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-xl hover:shadow-rose-400/40 hover:-translate-y-1">
                                    <Download size={22}/>
                                    <span>شروع رایگان</span>
                                    <AnimatePresence>
                                        {bursts.map(burst => <ClickBurst key={burst.id} onComplete={() => removeBurst(burst.id)} />)}
                                    </AnimatePresence>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full sm:w-auto text-lg rounded-full bg-rose-50/90 border-2 border-rose-200/90 backdrop-blur-sm text-rose-700 shadow-md px-8 py-4 font-bold flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-rose-100 hover:border-rose-300"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <PlayCircle size={22}/>
                                    <span>مشاهده ویدیو</span>
                                </Button>
                            </motion.div>
                        </div>

                         {/* Mascot Column */}
                        <div className="flex justify-center items-center order-1 lg:order-2">
                             <motion.div 
                                className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                            >
                                <PanbehCharacterAnimated size={280} float={true} />
                                
                                {tags.map((tag) => (
                                    <motion.div
                                        key={tag.text}
                                        className={`absolute px-4 py-2 rounded-full text-base font-bold shadow-lg backdrop-blur-md border ${tag.className} ${tag.position}`}
                                        initial={{ opacity: 0, scale: 0.5, rotate: tag.rotation }}
                                        animate={{ 
                                            opacity: 1, 
                                            scale: 1, 
                                            y: [0, -12, 0]
                                        }}
                                        transition={{
                                            opacity: { duration: 0.5, delay: tag.delay },
                                            scale: { duration: 0.5, delay: tag.delay },
                                            y: { duration: tag.duration, delay: tag.delay, repeat: Infinity, ease: "easeInOut" }
                                        }}
                                        whileHover={{ scale: 1.15, y: -18, rotate: tag.rotation + 5, transition: { duration: 0.3 } }}
                                    >
                                        {tag.text}
                                    </motion.div>
                                ))}
                                
                                <motion.div
                                    className="absolute bottom-[20%] right-[10%] w-10 h-10 bg-orange-400/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border-2 border-white/30"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.6 }}
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                >
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6 5h2v10H6V5zm6 0h2v10h-2V5z"></path></svg>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            <VideoModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                videoId="xU4G23_SStU"
            />
        </>
    );
};

export default HeroSection;
