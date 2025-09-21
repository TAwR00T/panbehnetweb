
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanbehCharacterAnimated } from '../PanbehCharacterAnimated';
import { Button } from '../ui/button';
import { Bot, ChevronLeft, Download, HardDrive, Calendar, Sparkles, Lightbulb } from 'lucide-react';
import CircularProgress from './CircularProgress';

const ActionCard = ({ icon, title, description, buttonText, onClick = () => {} }) => (
    <motion.div
        whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -2px rgba(0,0,0,0.05)' }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-start text-right border border-white/50 shadow-lg cursor-pointer h-full"
        onClick={onClick}
    >
        <div className="p-3 bg-white/60 rounded-full shadow-inner mb-4">{icon}</div>
        <h3 className="font-extrabold text-lg text-gray-800 flex-grow">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{description}</p>
        <div className="w-full text-left mt-auto">
             <button className="text-sm font-bold text-orange-600 flex items-center gap-1 group">
                <span>{buttonText}</span>
                <ChevronLeft size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
        </div>
    </motion.div>
);

const GetStartedCard = ({ userName, onNavigate }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-full bg-gradient-to-br from-purple-200 via-rose-100 to-amber-100 rounded-[32px] p-8 shadow-xl border border-white/40 flex flex-col"
    >
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right flex-grow">
             <div className="relative w-40 h-40 flex-shrink-0">
                <div className="absolute inset-0 bg-white/50 rounded-full blur-2xl"></div>
                <PanbehCharacterAnimated size={160} float={true} expression="excited"/>
            </div>
            <div>
                <h2 className="text-3xl font-black text-gray-800">خوش آمدی، {userName}!</h2>
                <p className="text-gray-700 mt-2 mb-6 leading-relaxed">به نظر میرسه هنوز هیچ پلن فعالی نداری. بیا با هم یک ماجراجویی جدید رو با انتخاب بهترین پلن برای تو شروع کنیم!</p>
            </div>
        </div>
         <div className="mt-auto text-center md:text-right">
            <Button 
                onClick={() => onNavigate('plans')}
                className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-8 py-3 shadow-lg hover:shadow-orange-400/50 transition-all hover:-translate-y-1 flex items-center gap-2 mx-auto md:mx-0"
            >
                <Sparkles size={18} className="ml-1"/>
                مشاهده و انتخاب پلن
            </Button>
        </div>
    </motion.div>
);

const ExistingUserView = ({ onNavigate }) => {
    const panbehTips = [
        "میدونستی با سرورهای گیمینگ ما میتونی پینگ بهتری بگیری؟",
        "برای امنیت بیشتر، تایید دو مرحله‌ای رو از تنظیمات فعال کن!",
        "مینی‌اپ تلگرام ما سریع‌ترین راه برای مدیریت حسابت در تلگرامه!",
    ];
    const randomTip = panbehTips[Math.floor(Math.random() * panbehTips.length)];

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Status Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-purple-200 via-rose-100 to-amber-100 rounded-[32px] p-8 shadow-xl border border-white/40">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center md:text-right">
                    <div className="relative w-40 h-40 mx-auto md:mx-0 flex-shrink-0">
                        <div className="absolute inset-0 bg-white/50 rounded-full blur-2xl"></div>
                        <PanbehCharacterAnimated size={160} float={true} expression="default"/>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-purple-700 font-bold">پلن فعلی شما: پنبه پرو</p>
                        <h2 className="text-3xl font-black mt-1 mb-6 text-gray-800">اشتراک شما فعال است!</h2>
                        <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-6 mb-6">
                            <CircularProgress progress={30} value="۱۵ GB" label="از ۵۰ GB" color="#3b82f6" />
                            <CircularProgress progress={80} value="۲۴" label="روز مانده" color="#16a34a" />
                        </div>
                        <Button onClick={() => onNavigate('plans')} className="w-full md:w-auto rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-8 py-3 shadow-lg hover:shadow-orange-400/50 transition-all hover:-translate-y-1">
                            <Sparkles size={18} className="ml-2"/>
                            تمدید یا ارتقا پلن
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Tips Column */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                <ActionCard 
                    icon={<Bot size={28} className="text-purple-600"/>}
                    title="چت با دستیار هوشمند"
                    description="برای خرید، راهنمایی و رفع مشکل کمک بگیرید."
                    buttonText="شروع گفتگو"
                    onClick={() => onNavigate('ai-chat')}
                />
                 <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-white/40 shadow-md">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-yellow-100 rounded-full text-yellow-600"><Lightbulb size={20}/></div>
                        <h3 className="font-extrabold text-gray-800">نکته پنبه‌ای</h3>
                     </div>
                     <p className="text-sm text-gray-600 leading-relaxed">{randomTip}</p>
                 </div>
            </div>
        </div>
    );
};

const DashboardOverview = ({ userName, hasActivePlan, onNavigate }) => {
    return (
        <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6">نمای کلی حساب</h1>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={hasActivePlan ? 'user-view' : 'new-user-view'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {hasActivePlan ? (
                        <ExistingUserView onNavigate={onNavigate} />
                    ) : (
                        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <GetStartedCard userName={userName} onNavigate={onNavigate} />
                            </div>
                            <ActionCard 
                                icon={<Bot size={28} className="text-purple-600"/>}
                                title="چت با دستیار هوشمند"
                                description="برای خرید، راهنمایی و رفع مشکل کمک بگیرید."
                                buttonText="شروع گفتگو"
                                onClick={() => onNavigate('ai-chat')}
                            />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default DashboardOverview;