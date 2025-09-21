import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanbehCharacterAnimated } from '../PanbehCharacterAnimated';
import { Button } from '../ui/button';
import { List, ChevronLeft, QrCode, Clipboard, Check, ChevronDown, Monitor, Smartphone } from 'lucide-react';
import { showToast } from '../../App'; // Import the global toast function

const subscription = {
    name: 'پنبه پرو',
    expiry: '۱۴۰۳/۰۵/۱۵',
    link: 'vless://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx@example.com:443?security=reality&sni=example.com&fp=chrome&pbk=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&sid=xxxxxx&type=tcp&headerType=none#Panbeh-Pro'
};

const QrCodePlaceholder = () => (
    <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-inner flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-80">
            <defs>
                <pattern id="qr-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect width="5" height="5" fill="#4a044e" />
                    <rect x="5" y="5" width="5" height="5" fill="#4a044e" />
                </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#qr-pattern)" />
            <rect x="10" y="10" width="20" height="20" fill="white" stroke="#4a044e" strokeWidth="5"/>
            <rect x="70" y="10" width="20" height="20" fill="white" stroke="#4a044e" strokeWidth="5"/>
            <rect x="10" y="70" width="20" height="20" fill="white" stroke="#4a044e" strokeWidth="5"/>
        </svg>
    </div>
);

const Accordion = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl border border-white/50 overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex justify-between items-center text-right font-bold text-gray-700">
                <div className="flex items-center gap-3">
                    {icon}
                    <span>{title}</span>
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown size={20} />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 border-t border-gray-200/60 pt-3 text-sm text-gray-600 space-y-2">
                           {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ActiveServiceView = () => {
    const [activeTab, setActiveTab] = useState('v2ray');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(subscription.link);
        setCopied(true);
        showToast('لینک با موفقیت کپی شد!'); // Use the global toast function
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 bg-white/50 backdrop-blur-lg rounded-3xl p-6 border border-white/50 shadow-md text-right"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-800">{subscription.name}</h2>
                        <p className="text-sm text-gray-500 font-semibold">تاریخ انقضا: {subscription.expiry}</p>
                    </div>
                    <div className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-full text-sm">فعال</div>
                </div>
                
                <div className="mb-6">
                    <div className="flex border-b border-gray-200">
                        <button onClick={() => setActiveTab('v2ray')} className={`px-4 py-2 font-bold transition-colors ${activeTab === 'v2ray' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}>
                            V2Ray
                        </button>
                        <button onClick={() => setActiveTab('xray')} className={`px-4 py-2 font-bold transition-colors ${activeTab === 'xray' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}>
                            XRay (بزودی)
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {activeTab === 'v2ray' ? (
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-shrink-0">
                                    <QrCodePlaceholder />
                                    <p className="text-center text-xs text-gray-500 mt-2">برای اتصال با موبایل اسکن کنید</p>
                                </div>
                                <div className="w-full">
                                    <label className="font-bold text-gray-700 text-sm">لینک اشتراک</label>
                                    <div className="relative mt-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={subscription.link}
                                            className="w-full bg-gray-100/80 border-2 border-gray-200/80 rounded-xl p-3 text-xs text-gray-500 truncate"
                                        />
                                        <Button onClick={handleCopy} size="sm" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg bg-orange-500 text-white font-bold h-8">
                                            {copied ? <Check size={16}/> : <Clipboard size={16}/>}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500">پروتکل XRay بزودی به پنبه اضافه خواهد شد!</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
             >
                <h3 className="font-extrabold text-lg text-gray-800 text-right">راهنمای اتصال سریع</h3>
                <Accordion title="اندروید" icon={<Smartphone size={20} className="text-green-600" />}>
                   <p>۱. برنامه V2RayNG را نصب کنید.</p>
                   <p>۲. کد QR را اسکن کنید یا لینک را کپی کنید.</p>
                   <p>۳. در برنامه، اشتراک را اضافه و بروزرسانی کنید.</p>
                   <p>۴. به سرور دلخواه متصل شوید!</p>
                </Accordion>
                <Accordion title="ویندوز" icon={<Monitor size={20} className="text-blue-600" />}>
                   <p>۱. برنامه NekoRay را نصب کنید.</p>
                   <p>۲. لینک اشتراک را کپی کنید.</p>
                   <p>۳. از قسمت Subscriptions لینک را اضافه کنید.</p>
                   <p>۴. اشتراک را آپدیت و به سرور متصل شوید.</p>
                </Accordion>
             </motion.div>
        </div>
    );
};


const EmptyState = ({ onNavigate }) => (
     <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white/50 backdrop-blur-lg rounded-3xl p-12 border border-white/50 shadow-md flex flex-col items-center"
     >
        <div className="relative w-32 h-32 mb-4">
            <div className="absolute inset-0 bg-yellow-200 rounded-full blur-2xl opacity-70"></div>
            <PanbehCharacterAnimated size={120} expression="thinking" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">هنوز سرویسی نداری!</h2>
        <p className="text-gray-600 mb-6 max-w-sm">به نظر میرسه هنوز هیچکدوم از پلن‌های پنبه‌ای رو برای خودت فعال نکردی. بیا با هم یه نگاهی به پلن‌ها بندازیم.</p>
        <Button onClick={() => onNavigate('plans')} className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-8 py-3 shadow-lg hover:shadow-orange-400/50 transition-all hover:-translate-y-1 flex items-center gap-2">
            <span>مشاهده پلن‌ها</span>
             <ChevronLeft size={18} />
        </Button>
     </motion.div>
);

const DashboardServices = ({ hasActivePlan, onNavigate }) => {
    return (
        <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-8">سرویس‌های من</h1>
            
            {hasActivePlan ? (
                <ActiveServiceView />
            ) : (
                <EmptyState onNavigate={onNavigate} />
            )}
        </div>
    );
};

export default DashboardServices;