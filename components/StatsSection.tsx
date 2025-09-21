
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Globe, ShieldCheck, Users } from 'lucide-react';

// Enhanced stats data with a more cartoonish and beautiful design theme
const stats = [
    { 
        value: "5", 
        label: "امتیاز کاربران", 
        icon: <Star />, 
        colorClasses: { 
            bg: "from-yellow-300 to-yellow-200", 
            border: "border-yellow-400", 
            shadow: "shadow-yellow-400/40", 
            text: "text-yellow-800", 
            fill: "fill-yellow-500" 
        } 
    },
    { 
        value: "+50", 
        label: "سرور جهانی", 
        icon: <Globe />, 
        colorClasses: { 
            bg: "from-blue-300 to-sky-200", 
            border: "border-blue-400", 
            shadow: "shadow-blue-400/40", 
            text: "text-blue-800", 
            fill: "fill-current" // Will inherit text color
        } 
    },
    { 
        value: "99.9%", 
        label: "آپتایم سرور", 
        icon: <ShieldCheck />, 
        colorClasses: { 
            bg: "from-green-300 to-teal-200", 
            border: "border-green-400", 
            shadow: "shadow-green-400/40", 
            text: "text-green-800", 
            fill: "fill-green-500" 
        } 
    },
    { 
        value: "+100K", 
        label: "کاربران فعال", 
        icon: <Users />, 
        colorClasses: { 
            bg: "from-pink-300 to-rose-200", 
            border: "border-pink-400", 
            shadow: "shadow-pink-400/40", 
            text: "text-pink-800", 
            fill: "fill-current" // Will inherit text color
        } 
    },
];

const StatsSection = () => {
    return (
        <section id="stats" className="w-full py-12 sm:py-16 relative z-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            className={`rounded-[32px] p-4 sm:p-6 text-center flex flex-col items-center gap-3 border-4 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${stat.colorClasses.bg} ${stat.colorClasses.border} ${stat.colorClasses.shadow} ${stat.colorClasses.text}`}
                            initial={{ opacity: 0, y: 60, rotate: -10 }}
                            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.7, delay: i * 0.15, type: 'spring', stiffness: 80 }}
                            whileHover={{ scale: 1.08, y: -12, rotate: 3, transition: { type: 'spring', stiffness: 200, damping: 10 } }}
                        >
                             <div className="p-3 bg-white/50 rounded-full shadow-inner">
                                {React.cloneElement(stat.icon, { size: 32, className: stat.colorClasses.fill })}
                            </div>
                            <p className="text-3xl sm:text-4xl font-black drop-shadow-sm">{stat.value}</p>
                            <p className="text-sm sm:text-base font-extrabold opacity-80">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;