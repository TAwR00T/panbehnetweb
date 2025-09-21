
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, Shield, Power, Globe, KeyRound, Users, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

const faqData = [
    { id: 1, q: 'سرعت اینترنت کم میشه؟', a: 'خیر! سرورهای پنبه بهینه شدن تا شما بالاترین سرعت ممکن رو تجربه کنید و اصلا متوجه افت سرعت نشید.', category: 'عملکرد', icon: <Power size={18} />, isImportant: true },
    { id: 2, q: 'چطور اطمینان پیدا کنم که اطلاعاتم امنه؟', a: 'پنبه از رمزنگاری نظامی AES-256 استفاده می‌کنه که همون استانداردی هست که بانک‌ها و سازمان‌های امنیتی دنیا ازش استفاده می‌کنن. هیچ لاگی از فعالیت‌های شما نگه نمیداریم.', category: 'امنیت', icon: <Shield size={18} />, isImportant: true },
    { id: 3, q: 'چند کشور پوشش دارید؟', a: 'ما بیش از ۵۰ سرور در سراسر دنیا داریم و این تعداد همیشه در حال افزایشه تا شما بهترین اتصال رو داشته باشید.', category: 'پوشش', icon: <Globe size={18} />, isImportant: false },
    { id: 4, q: 'چه اطلاعاتی از من جمع‌آوری میکنید؟', a: 'ما به حریم خصوصی شما احترام میذاریم. تنها اطلاعاتی که نیاز داریم ایمیل شما برای ساخت اکانته. هیچ اطلاعات دیگه‌ای از شما ذخیره نمیشه.', category: 'حریم خصوصی', icon: <KeyRound size={18} />, isImportant: false },
    { id: 5, q: 'پشتیبانی چطوره؟', a: 'تیم پشتیبانی بامزه ما ۲۴ ساعته و ۷ روز هفته از طریق چت آنلاین و تیکت آماده پاسخگویی به سوالات شما هستن.', category: 'پشتیبانی', icon: <MessageCircle size={18} />, isImportant: false },
    { id: 6, q: 'روی چند دستگاه میتونم استفاده کنم؟', a: 'بسته به پلنی که انتخاب می‌کنید، می‌تونید از ۱ تا ۱۰ دستگاه به صورت همزمان استفاده کنید. پلن خانواده ما برای این کار عالیه!', category: 'دستگاه‌ها', icon: <Users size={18} />, isImportant: false },
];

const categories = ['همه', 'امنیت', 'عملکرد', 'پوشش', 'حریم خصوصی', 'دستگاه‌ها', 'پشتیبانی'];

const FaqSection = () => {
    const [openId, setOpenId] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState('همه');

    useEffect(() => {
        // Dynamically generate and inject FAQPage JSON-LD schema for SEO.
        // This helps Google understand the content and can result in rich snippets.
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(item => ({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.a
                }
            }))
        };

        const scriptId = 'faq-schema';
        // FIX: Cast the HTMLElement to HTMLScriptElement to allow setting the 'type' property.
        let script = document.getElementById(scriptId) as HTMLScriptElement | null;
        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.innerHTML = JSON.stringify(faqSchema);

        // Cleanup function to remove the script when the component unmounts
        return () => {
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                document.head.removeChild(existingScript);
            }
        };
    }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount.


    const filteredFaqs = activeCategory === 'همه' ? faqData : faqData.filter(faq => faq.category === activeCategory);

    return (
        <section id="faq" className="w-full py-16 sm:py-24 bg-white/30 backdrop-blur-sm relative z-10">
            <div className="container mx-auto px-4 max-w-5xl text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">سوالات شما، پاسخ‌های کاربردی</h2>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">همه چیزی که باید بدونید تا با خیال راحت شروع کنید.</p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map(cat => (
                        <motion.button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all duration-300 shadow-sm border ${activeCategory === cat ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-transparent shadow-lg' : 'bg-white/60 text-gray-700 hover:bg-white/90 border-gray-200'}`}
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                    {filteredFaqs.map(item => (
                        <motion.div 
                            key={item.id} 
                            className={`bg-white/70 backdrop-blur-lg rounded-2xl shadow-md border ${item.isImportant ? 'border-orange-400' : 'border-white/30'} overflow-hidden`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            layout
                        >
                            <button 
                                className="p-5 flex justify-between items-start w-full text-right" 
                                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                                aria-expanded={openId === item.id}
                                aria-controls={`faq-answer-${item.id}`}
                            >
                                <div className="flex items-start gap-3">
                                     <span className={`p-2 mt-1 rounded-full text-white bg-gradient-to-br ${item.isImportant ? 'from-orange-500 to-yellow-500' : 'from-gray-400 to-gray-500'}`}>{item.icon}</span>
                                     <div className="flex flex-col items-start">
                                        {item.isImportant && (
                                            <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full mb-1.5 shadow-sm">
                                                <Sparkles size={14} className="flex-shrink-0" />
                                                <span>پیشنهاد پنبه</span>
                                            </div>
                                        )}
                                        <span id={`faq-question-${item.id}`} className="font-bold text-gray-800 text-base">{item.q}</span>
                                     </div>
                                </div>
                                <motion.div animate={{ rotate: openId === item.id ? 180 : 0 }} className="mt-1.5 flex-shrink-0 ml-[-4px]">
                                    <ChevronDown className="text-gray-500" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openId === item.id && (
                                    <motion.section
                                        id={`faq-answer-${item.id}`}
                                        role="region"
                                        aria-labelledby={`faq-question-${item.id}`}
                                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                        animate={{ height: 'auto', opacity: 1, marginTop: '-0.5rem' }}
                                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t border-gray-200/80 mx-5"></div>
                                        <p className="p-5 pt-4 text-gray-600 leading-relaxed">{item.a}</p>
                                    </motion.section>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                 <motion.div 
                    className="mt-16 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-8 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">سوال دیگه‌ای داری؟</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">تیم پشتیبانی پنبه همیشه آماده کمک به شماست.</p>
                    <Button className="auth-trigger bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-8 py-3 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                        تماس با پشتیبانی
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default FaqSection;
