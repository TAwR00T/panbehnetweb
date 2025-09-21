
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Check, Shield, Lock, Globe, Zap, Users, Gem, HardHat, Banknote } from 'lucide-react';

const baseFeatures = [
    { text: "امنیت نظامی AES-256", icon: <Shield size={16} /> },
    { text: "مسدودساز تبلیغات مزاحم", icon: <Zap size={16} /> },
    { text: "قفل کودک و محتوای امن", icon: <Lock size={16} /> },
    { text: "دسترسی به سایت‌های بانکی", icon: <Banknote size={16} /> },
];

const plans = [
    {
        name: "پنبه منعطف",
        price: "شروع از ۵٬۰۰۰",
        period: "تومان/ماه",
        description: "برای شروع و مصارف کم. فقط برای چیزی که لازم دارید پول بدهید.",
        features: [
            ...baseFeatures,
            { text: "۲ گیگابایت ترافیک رایگان اولیه", icon: <Check size={16} /> },
            { text: "۱ کاربر همزمان", icon: <Users size={16} /> },
            { text: "IP ثابت اشتراکی", icon: <Globe size={16} /> },
        ],
        buttonText: "محاسبه هزینه",
        buttonClass: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        isPopular: false,
    },
    {
        name: "پنبه پرو",
        price: "۹۹٬۰۰۰",
        period: "تومان/ماه",
        description: "محبوب‌ترین انتخاب برای سرعت، امنیت و استریم بدون وقفه.",
        features: [
            ...baseFeatures,
            { text: "ترافیک نامحدود", icon: <Check size={16} /> },
            { text: "۵ کاربر همزمان", icon: <Users size={16} /> },
            { text: "IP ثابت اشتراکی (۵ کشور)", icon: <Globe size={16} /> },
            { text: "بهینه برای استریم 4K", icon: <Check size={16} /> },
        ],
        buttonText: "انتخاب پلن پرو",
        buttonClass: "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/40",
        isPopular: true,
    },
    {
        name: "پنبه خانواده",
        price: "۱۴۹٬۰۰۰",
        period: "تومان/ماه",
        description: "یک اکانت برای تمام اعضای خانواده. امنیت کامل برای همه.",
        features: [
            ...baseFeatures,
            { text: "ترافیک نامحدود", icon: <Check size={16} /> },
            { text: "۱۰ کاربر همزمان", icon: <Users size={16} /> },
            { text: "IP ثابت اختصاصی (۱ کشور)", icon: <Gem size={16} /> },
            { text: "اولویت در پشتیبانی", icon: <Check size={16} /> },
        ],
        buttonText: "انتخاب پلن خانواده",
        buttonClass: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/40",
        isPopular: false,
    },
    {
        name: "پنبه سفارشی",
        price: "توافقی",
        period: "",
        description: "برای نیازهای خاص و کاربران حرفه‌ای. با ما تماس بگیرید.",
        features: [
            ...baseFeatures,
            { text: "تمام ویژگی‌های پرو", icon: <Check size={16} /> },
            { text: "کاربران نامحدود", icon: <Users size={16} /> },
            { text: "IP اختصاصی از کشورهای دلخواه", icon: <Gem size={16} /> },
            { text: "مدیر حساب اختصاصی", icon: <HardHat size={16} /> },
        ],
        buttonText: "تماس با فروش",
        buttonClass: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/40",
        isPopular: false,
    }
];

const PricingSection = () => {
    return (
        <section id="plans" className="w-full py-20 sm:py-28 relative z-10">
            <div className="container mx-auto px-4 max-w-7xl">
                <motion.div
                    {...{
                        initial: { opacity: 0, y: 20 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true, amount: 0.3 },
                        transition: { duration: 0.6 },
                        className: "text-center"
                    }}
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
                        یک پلن برای هر نیاز پنبه‌ای شما
                    </h2>
                    <p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                        چه یک کاربر معمولی باشید و چه یک خانواده کامل، ما پلن مناسب شما را داریم.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            {...{
                                className: `relative bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg p-8 flex flex-col text-right border ${plan.isPopular ? 'border-orange-400' : 'border-white/30'}`,
                                initial: { opacity: 0, y: 50 },
                                whileInView: { opacity: 1, y: 0 },
                                viewport: { once: true, amount: 0.3 },
                                transition: { duration: 0.5, delay: i * 0.1 },
                                whileHover: { y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }
                            }}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-4 right-8 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-md">
                                    محبوب‌ترین
                                </div>
                            )}
                            <h3 className="text-2xl font-extrabold text-gray-800 mb-2">{plan.name}</h3>
                            <p className="text-gray-500 mb-6 h-12">{plan.description}</p>

                            <div className="mb-6">
                                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                                <span className="text-gray-600 font-medium mr-1">{plan.period}</span>
                            </div>

                            <ul className="space-y-4 mb-8 text-right flex-grow">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="w-6 h-6 flex items-center justify-center text-green-600 bg-green-100 rounded-full">
                                            {feature.icon}
                                        </div>
                                        <span className="text-gray-700">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button className={`auth-trigger w-full rounded-full py-3 font-bold transition-all ${plan.buttonClass}`}>
                                {plan.buttonText}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
