
import React from 'react';
import { motion } from 'framer-motion';
import { PanbehCharacterAnimated } from './PanbehCharacterAnimated';
import { Button } from './ui/button';
import { TelegramLogoIcon, TreasureCompass, TreasureKey, TreasureChest } from './icons/CustomIcons';
import { ArrowLeft } from 'lucide-react';

const steps = [
    {
        icon: <TreasureCompass />,
        title: "۱. به ربات بپیوند",
        description: "وارد مینی‌اپ تلگرام ما شو و ماجراجویی رو شروع کن.",
    },
    {
        icon: <TreasureKey />,
        title: "۲. ماموریت‌ها رو کامل کن",
        description: "با انجام چند کار ساده مثل دنبال کردن کانال، امتیاز جمع کن.",
    },
    {
        icon: <TreasureChest />,
        title: "۳. جایزه‌ت رو بردار",
        description: "امتیازهایت را به اشتراک VPN رایگان یا تخفیف تبدیل کن!",
    }
];

const StarsBackground = () => {
    const stars = React.useMemo(() => Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 1}px`,
        duration: Math.random() * 2 + 3,
        delay: Math.random() * 3,
    })), []);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {stars.map(star => (
                <motion.div
                    key={star.id}
                    className="absolute bg-white rounded-full"
                    style={{
                        left: star.x,
                        top: star.y,
                        width: star.size,
                        height: star.size,
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};

const TelegramSection = () => {
    return (
        <section id="airdrop" className="w-full py-20 sm:py-28 relative z-10 bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
            <StarsBackground />
            
            <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                     <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400">
                        گنج تلگرامی پنبه رو پیدا کن!
                    </h2>
                    <p className="text-lg text-gray-300 mb-16 leading-relaxed max-w-2xl mx-auto">
                        یک ماجراجویی ساده با جوایز واقعی. مراحل زیر رو دنبال کن و VPN رایگان برنده شو!
                    </p>
                </motion.div>

                <div className="relative flex flex-col items-center">
                    
                    <motion.div 
                        className="absolute -top-40 right-0 hidden lg:block"
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <PanbehCharacterAnimated size={150} />
                    </motion.div>

                    <div className="flex flex-col md:flex-row items-stretch justify-center gap-12 md:gap-4 w-full max-w-md md:max-w-none mx-auto">
                        {steps.map((step, index) => (
                            <React.Fragment key={index}>
                                <motion.div 
                                    className="flex flex-row-reverse md:flex-col items-center text-right md:text-center gap-6 md:gap-4 md:max-w-[240px] w-full p-4 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10"
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    <div className="flex-shrink-0 transform scale-75 md:scale-90">{step.icon}</div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg md:text-xl mb-1 md:mb-2 text-yellow-300">{step.title}</h3>
                                        <p className="text-gray-400 text-sm">{step.description}</p>
                                    </div>
                                </motion.div>
                                
                                {index < steps.length - 1 && (
                                    <div className="hidden md:flex items-center justify-center">
                                         <motion.div 
                                            className="w-16 h-1 border-b-2 border-dashed border-gray-600"
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                                            style={{ transformOrigin: 'center' }}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-20"
                    >
                        <Button className="auth-trigger rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold text-lg px-10 py-4 shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-400/50 transition-all hover:-translate-y-1 flex items-center gap-3 group">
                            <TelegramLogoIcon className="w-8 h-8"/>
                            <span>شروع ماجراجویی در تلگرام</span>
                            <ArrowLeft size={20} className="transition-transform group-hover:translate-x-[-4px]" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default TelegramSection;