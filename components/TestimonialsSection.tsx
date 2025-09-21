
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, LoaderCircle, AlertTriangle } from 'lucide-react';

// Hardcoded data has been removed from here. It will now be fetched.
const mockTestimonials = [
    { name: "سارا احمدی", role: "طراح گرافیک - تهران", avatar: "👩‍🎨", text: "واقعاً به یه چیز دیگه به جز پنبه فکر نمی‌کنم! سرعتش فوق‌العاده‌ست و قطعی نداره. برای من که کارم با اینترنته، عالیه.", rating: 5, date: "۲ ماه پیش" },
    { name: "علی رضایی", role: "دانشجو", avatar: "🧑‍🎓", text: "پشتیبانی‌شون خیلی بامزه و سریعه! نصف شب پیام دادم و زیر ۵ دقیقه جوابمو دادن. دمشون گرم.", rating: 5, date: "۱ هفته پیش" },
    { name: "مریم حسینی", role: "فریلنسر", avatar: "👩‍💻", text: "مینی‌اپ تلگرامش زندگی رو راحت کرده. دیگه لازم نیست از تلگرام بیام بیرون. همه چی همونجاست.", rating: 5, date: "۳ ماه پیش" },
    { name: "رضا محمدی", role: "گیمر", avatar: "🎮", text: "پینگ پایینی که با سرورهای گیمینگ پنبه میگیرم باورنکردنیه. بازی‌ها بدون لگ اجرا میشن.", rating: 5, date: "۱ ماه پیش" },
    { name: "فاطمه کاظمی", role: "مادر", avatar: "🤱", text: "با پلن خانواده هم من و هم همسرم وصلیم و هم بچه‌ها با خیال راحت تو اینترنت امن می‌گردن. محافظت کودکش عالیه.", rating: 5, date: "۳ هفته پیش" },
];


const TestimonialCard = ({ testimonial }) => (
    <div className="w-full h-full flex-shrink-0 bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg p-6 text-right border border-gray-200/80 flex flex-col transition-all duration-300 hover:border-orange-300">
        <div className="flex items-center mb-3">
            <span className="text-4xl p-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full shadow-inner">{testimonial.avatar}</span>
            <div className="mr-4">
                <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
            <div className="mr-auto flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
            </div>
        </div>
        <p className="text-gray-700 leading-relaxed mb-3 flex-grow">"{testimonial.text}"</p>
        <p className="text-xs text-gray-400">{testimonial.date}</p>
    </div>
);

const TestimonialsSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                // =================================================================
                // DEVELOPER NOTE: This is where you will fetch data from your WordPress API.
                // Replace the mocked data below with your actual fetch call.
                //
                // Example:
                // const response = await fetch('https://your-wordpress-site.com/wp-json/wp/v2/testimonials');
                // if (!response.ok) throw new Error('Network response was not ok');
                // const data = await response.json();
                // setTestimonials(data);
                //
                // نکته برای توسعه‌دهنده: اینجا جایی است که اطلاعات را از وردپرس خود دریافت می‌کنید.
                // کد شبیه‌سازی شده زیر را با کد واقعی فراخوانی API جایگزین کنید.
                // =================================================================

                // Simulating a network request for demonstration
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Set the mocked data
                setTestimonials(mockTestimonials);
                
            } catch (err) {
                setError("متاسفانه در دریافت نظرات مشکلی پیش آمد. لطفاً بعداً تلاش کنید.");
                console.error("Failed to fetch testimonials:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestimonials();
    }, []);


    const handleNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
    const handlePrev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    const goToIndex = (index: number) => setActiveIndex(index);

    useEffect(() => {
        if (isHovered || testimonials.length === 0) return;
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [activeIndex, isHovered, testimonials]);

    // For mobile swiping
    const dragEndHandler = (_event: any, info: PanInfo) => {
        const swipeThreshold = 50;
        if (info.offset.x < -swipeThreshold) {
            handleNext();
        } else if (info.offset.x > swipeThreshold) {
            handlePrev();
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-[320px] text-gray-600">
                    <LoaderCircle size={40} className="animate-spin mb-4" />
                    <p className="font-bold text-lg">در حال بارگذاری نظرات...</p>
                </div>
            );
        }

        if (error) {
            return (
                 <div className="flex flex-col items-center justify-center h-[320px] text-red-600 bg-red-50/50 rounded-3xl">
                    <AlertTriangle size={40} className="mb-4" />
                    <p className="font-bold text-lg">{error}</p>
                </div>
            );
        }

        if (testimonials.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-[320px] text-gray-500">
                    <p className="font-bold text-lg">در حال حاضر نظری برای نمایش وجود ندارد.</p>
                </div>
            );
        }

        return (
            <>
                {/* --- Desktop Carousel --- */}
                <div 
                    className="hidden lg:flex flex-col items-center justify-center space-y-8"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="relative w-full h-[320px] flex items-center justify-center">
                        {testimonials.map((testimonial, index) => {
                            const offset = index - activeIndex;
                            const scale = 1 - Math.abs(offset) * 0.25;
                            const x = offset * 35; 
                            const opacity = Math.abs(offset) > 1 ? 0 : 1 - Math.abs(offset) * 0.4;
                            const zIndex = testimonials.length - Math.abs(offset);

                            if (Math.abs(offset) > 2) return null;

                            return (
                                <motion.div
                                    key={index}
                                    className="absolute w-[45%] h-full"
                                    style={{ cursor: offset !== 0 ? 'pointer' : 'default' }}
                                    initial={false}
                                    animate={{ x: `${x}%`, scale, opacity, zIndex }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                                    onClick={() => offset !== 0 && goToIndex(index)}
                                >
                                    <TestimonialCard testimonial={testimonial} />
                                </motion.div>
                            );
                        })}
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <motion.button onClick={handlePrev} className="p-3 bg-white/70 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors border border-white/30" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <ChevronRight size={24} className="text-gray-700" />
                        </motion.button>
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button key={index} onClick={() => goToIndex(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-orange-500 w-6' : 'bg-gray-300 hover:bg-gray-400'}`} />
                            ))}
                        </div>
                        <motion.button onClick={handleNext} className="p-3 bg-white/70 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors border border-white/30" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <ChevronLeft size={24} className="text-gray-700" />
                        </motion.button>
                    </div>
                </div>

                {/* --- Mobile Card Stack --- */}
                <div className="lg:hidden flex flex-col items-center gap-8">
                     <div className="relative w-full max-w-[85vw] h-[320px] flex items-center justify-center">
                        <AnimatePresence>
                             {/* The stack is created by mapping a few cards based on activeIndex */}
                             {testimonials.slice(activeIndex, activeIndex + 3).reverse().map((testimonial) => {
                                const indexInStack = testimonials.indexOf(testimonial) - activeIndex;
                                const isTopCard = indexInStack === 0;

                                return (
                                    <motion.div
                                        key={testimonial.name}
                                        className="absolute w-full h-[280px]"
                                        style={{
                                            cursor: isTopCard ? 'grab' : 'default',
                                        }}
                                        initial={{ scale: 1 - indexInStack * 0.1, y: indexInStack * 15, opacity: 0 }}
                                        animate={{
                                            scale: 1 - indexInStack * 0.1,
                                            y: indexInStack * 15,
                                            opacity: isTopCard ? 1 : 1 - (indexInStack * 0.4),
                                            zIndex: testimonials.length - indexInStack,
                                        }}
                                        exit={{
                                            x: -300, // Fling off to the left
                                            opacity: 0,
                                            transition: { duration: 0.2 }
                                        }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                                        drag={isTopCard ? "x" : false}
                                        dragConstraints={{ left: 0, right: 0 }}
                                        onDragEnd={isTopCard ? dragEndHandler : undefined}
                                    >
                                        <TestimonialCard testimonial={testimonial} />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                     <div className="flex items-center gap-6">
                        <motion.button onClick={handlePrev} className="p-3 bg-white/70 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors border border-white/30" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <ChevronRight size={24} className="text-gray-700" />
                        </motion.button>
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button key={index} onClick={() => goToIndex(index)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-orange-500 w-5' : 'bg-gray-300 hover:bg-gray-400'}`} />
                            ))}
                        </div>
                        <motion.button onClick={handleNext} className="p-3 bg-white/70 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors border border-white/30" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <ChevronLeft size={24} className="text-gray-700" />
                        </motion.button>
                    </div>
                </div>
            </>
        )
    };
    
    return (
        <section id="testimonials" className="w-full py-16 sm:py-24 relative z-10 overflow-hidden">
            <div className="container mx-auto px-4 max-w-5xl text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">حرف مردم درباره پنبه</h2>
                    <p className="text-lg text-gray-600 mb-12 leading-relaxed">بیش از ۱۰۰ هزار کاربر راضی از سراسر کشور.</p>
                </motion.div>
                
                {renderContent()}

            </div>
        </section>
    );
};

export default TestimonialsSection;
