
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanbehCharacterAnimated } from './PanbehCharacterAnimated';
import { Rocket, Shield, Globe, MessageSquare, ChevronDown } from 'lucide-react';

const features = [
    {
        icon: <Rocket size={28} />,
        title: "سرعت کیهانی",
        desc: "پنبه شما را به یک جت فضایی تبدیل می‌کند! با سرعت نور در اینترنت پرواز کنید، از کنار بافرینگ‌ها رد شوید و در دنیای آنلاین، یک قهرمان شکست‌ناپذیر باشید.",
        color: "orange",
    },
    {
        icon: <Shield size={28} />,
        title: "قلعه امنیتی",
        desc: "هر کلیک شما، یک راز بین ماست! پنبه یک سپر جادویی دور شما می‌کشد که هیچکس نمی‌تواند از آن عبور کند. با خیال راحت گشت‌وگذار کنید، چون ما نگهبان اسرار شماییم.",
        color: "blue",
    },
    {
        icon: <Globe size={28} />,
        title: "جهانگردی دیجیتال",
        desc: "چمدان دیجیتالی خود را ببندید! پنبه پاسپورت شما برای سفر به هر گوشه از اینترنت است. هر محتوایی که در هر جای دنیا قفل شده، با یک کلیک برای شما باز می‌شود.",
        color: "green",
    },
    {
        icon: <MessageSquare size={28} />,
        title: "پشتیبانی دوستانه",
        desc: "در دنیای دیجیتال گم شده‌اید؟ نگران نباشید! تیم پشتیبانی ما مثل یک دوست مهربان، همیشه یک فنجان چای گرم و یک راه‌حل سریع برای شما دارد.",
        color: "purple",
    }
];

const colorVariants = {
    orange: {
        bg: 'bg-orange-100/80',
        border: 'border-orange-400',
        text: 'text-orange-800',
        glow: 'from-orange-200/80',
        icon: 'text-orange-500',
    },
    blue: {
        bg: 'bg-blue-100/80',
        border: 'border-blue-400',
        text: 'text-blue-800',
        glow: 'from-blue-200/80',
        icon: 'text-blue-500',
    },
    green: {
        bg: 'bg-green-100/80',
        border: 'border-green-400',
        text: 'text-green-800',
        glow: 'from-green-200/80',
        icon: 'text-green-500',
    },
    purple: {
        bg: 'bg-purple-100/80',
        border: 'border-purple-400',
        text: 'text-purple-800',
        glow: 'from-purple-200/80',
        icon: 'text-purple-500',
    }
};


const WhyChooseUsSection = () => {
    const [selected, setSelected] = useState(0);
    const activeFeature = features[selected];
    const activeColor = colorVariants[activeFeature.color];

    return (
        <section id="features" className="w-full py-20 sm:py-28 bg-white/40 backdrop-blur-md relative z-10 overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
                        چرا پنبه بهترین دوست شماست؟
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        ما فقط یک VPN نیستیم. ما یک معجون جادویی از سرعت، امنیت و آزادی هستیم که توسط یک همستر بامزه برای شما آماده شده!
                    </p>
                </motion.div>

                {/* --- Desktop Layout --- */}
                <div className="hidden lg:grid grid-cols-2 gap-16 items-center">
                    {/* Left Column: Mascot + Description */}
                    <div className="relative flex flex-col text-center lg:text-right">
                        {/* Mascot */}
                        <motion.div 
                            className="relative flex flex-col items-center"
                        >
                             <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-8">
                                <motion.div 
                                    className={`absolute inset-0 rounded-full filter blur-3xl transition-colors duration-500 bg-gradient-radial ${activeColor.glow} to-transparent`}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                />
                                <PanbehCharacterAnimated size={250} float={true} />
                            </div>
                        </motion.div>

                        {/* Description, now flowing naturally */}
                        <div className="w-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selected}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full"
                                >
                                    <h3 className={`text-2xl font-bold mb-3 ${activeColor.text}`}>{activeFeature.title}</h3>
                                    <p className="text-gray-700 leading-loose text-base">
                                        {activeFeature.desc}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column: Interactive Cards Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {features.map((feature, index) => {
                            const isSelected = selected === index;
                            return (
                                <motion.div
                                    key={index}
                                    onClick={() => setSelected(index)}
                                    className={`relative p-6 rounded-3xl cursor-pointer shadow-lg flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 border ${isSelected ? colorVariants[feature.color].border : 'border-transparent'}`}
                                    style={{ backdropFilter: 'blur(12px)', backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.5)'}}
                                    whileHover={{ y: -10, scale: 1.05, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <motion.div 
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                        className={`p-4 rounded-xl shadow-inner ${colorVariants[feature.color].bg}`}
                                    >
                                        {React.cloneElement(feature.icon, { className: colorVariants[feature.color].icon })}
                                    </motion.div>
                                    <h4 className={`font-bold text-lg ${colorVariants[feature.color].text}`}>{feature.title}</h4>

                                    {isSelected && (
                                        <motion.div 
                                            className="absolute inset-0 border-4 rounded-3xl pointer-events-none"
                                            style={{ borderColor: colorVariants[feature.color].border.replace('border-', '')}}
                                            layoutId="active-feature-border-desktop"
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* --- Mobile Layout --- */}
                <div className="block lg:hidden">
                    {/* Mascot */}
                    <motion.div className="relative flex flex-col items-center justify-center text-center mb-12">
                        <div className="relative w-60 h-60">
                            <motion.div 
                                className={`absolute inset-0 rounded-full filter blur-3xl transition-colors duration-500 bg-gradient-radial ${activeColor.glow} to-transparent`}
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <PanbehCharacterAnimated size={220} float={true} />
                        </div>
                    </motion.div>

                    {/* Accordion */}
                    <div className="space-y-4">
                        {features.map((feature, index) => {
                            const isSelected = selected === index;
                            const colors = colorVariants[feature.color];
                            return (
                                <motion.div
                                    key={index}
                                    layout
                                    className={`rounded-3xl shadow-lg border overflow-hidden transition-colors duration-300 ${isSelected ? `border-transparent ${colors.bg}` : 'bg-white/50 border-white/30'}`}
                                    style={{ backdropFilter: 'blur(12px)' }}
                                >
                                    <motion.button
                                        onClick={() => setSelected(index)}
                                        className="w-full p-4 flex items-center justify-between text-right font-bold"
                                        aria-expanded={isSelected}
                                    >
                                        <div className="flex items-center gap-4">
                                            <motion.div 
                                                animate={{ scale: isSelected ? 1.15 : 1, rotate: isSelected ? 5 : 0 }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                                className={`p-3 rounded-xl shadow-inner transition-colors duration-300 ${isSelected ? 'bg-white/50' : colors.bg}`}
                                            >
                                               {React.cloneElement(feature.icon, { className: colors.icon })}
                                            </motion.div>
                                            <span className={`${colors.text}`}>{feature.title}</span>
                                        </div>
                                        <motion.div animate={{ rotate: isSelected ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                            <ChevronDown className={`w-6 h-6 transition-colors duration-300 ${colors.icon}`} />
                                        </motion.div>
                                    </motion.button>
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.section
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5">
                                                     <div className="border-t border-gray-400/30 mb-4 mx-2"></div>
                                                    <p className="text-gray-700 leading-relaxed text-sm">
                                                        {feature.desc}
                                                    </p>
                                                </div>
                                            </motion.section>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUsSection;