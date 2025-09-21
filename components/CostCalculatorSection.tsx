
import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { HardHat, Check, ChevronLeft, ChevronRight, Wand2, ChevronDown } from 'lucide-react';
import { PanbehCharacterAnimated } from './PanbehCharacterAnimated';

const AnimatedCounter = ({ value }: { value: number }) => {
    const spring = useSpring(value, { mass: 0.8, stiffness: 100, damping: 20 });
    const display = useTransform(spring, (current: number) => Math.round(current).toLocaleString('fa-IR'));

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span>{display}</motion.span>;
};

const CustomSwitch = ({ label, price, checked, onChange, disabled = false }) => (
    <div className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${checked ? 'bg-green-100/80' : 'bg-gray-100/80'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => !disabled && onChange(!checked)}>
        <div>
            <p className={`font-bold ${checked ? 'text-green-800' : 'text-gray-800'}`}>{label}</p>
            <p className={`text-sm ${checked ? 'text-green-600' : 'text-gray-500'}`}>+ {price.toLocaleString('fa-IR')} تومان</p>
        </div>
        <div className={`relative w-14 h-8 flex items-center rounded-full transition-colors duration-300 ${checked ? 'bg-green-500' : 'bg-gray-300'}`}>
            <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md"
                layout
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                style={{
                    position: 'absolute',
                    right: checked ? '0.25rem' : 'auto',
                    left: checked ? 'auto' : '0.25rem'
                }}
            >
                {checked && <Check size={16} className="text-green-500 m-1" />}
            </motion.div>
        </div>
    </div>
);

const ReceiptDetails = ({ dataGB, dataCost, hasSharedIP, hasDedicatedIP, SHARED_IP_COST, DEDICATED_IP_COST, isMobile = false }) => (
    <motion.div
      className="space-y-3 text-sm font-medium text-right"
      {...(isMobile && {
            initial:{ opacity: 0, height: 0 },
            animate:{ opacity: 1, height: 'auto' },
            exit: { opacity: 0, height: 0 },
            transition: { duration: 0.4, ease: 'easeInOut' }
        })}
    >
        <div className="flex justify-between items-center text-gray-600">
            <span>هزینه حجم ({dataGB.toLocaleString('fa-IR')} گیگابایت)</span>
            <span><AnimatedCounter value={dataCost} /> تومان</span>
        </div>
        {(hasSharedIP || (hasDedicatedIP && isMobile)) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex justify-between items-center ${hasSharedIP ? 'text-green-700' : 'text-gray-400 line-through'}`}>
                <span>+ IP ثابت اشتراکی</span>
                <span>{SHARED_IP_COST.toLocaleString('fa-IR')} تومان</span>
            </motion.div>
        )}
        {hasDedicatedIP && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center text-green-700">
                <span>+ IP ثابت اختصاصی</span>
                <span>{DEDICATED_IP_COST.toLocaleString('fa-IR')} تومان</span>
            </motion.div>
        )}
    </motion.div>
);


const CostCalculatorSection = () => {
    const [dataGB, setDataGB] = useState(10); // Default 10GB
    const [hasSharedIP, setHasSharedIP] = useState(false);
    const [hasDedicatedIP, setHasDedicatedIP] = useState(false);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [panbehExpression, setPanbehExpression] = useState<'default' | 'excited' | 'wow'>('default');

    const COST_PER_GB = 5000;
    const SHARED_IP_COST = 10000;
    const DEDICATED_IP_COST = 100000;

    const dataCost = dataGB * COST_PER_GB;
    const ipCost = (hasSharedIP ? SHARED_IP_COST : 0) + (hasDedicatedIP ? DEDICATED_IP_COST : 0);
    const totalCost = dataCost + ipCost;

    useEffect(() => {
        if (hasDedicatedIP && hasSharedIP) {
            setHasSharedIP(false);
        }
    }, [hasDedicatedIP, hasSharedIP]);
    
    useEffect(() => {
        if (dataGB >= 250) {
            setPanbehExpression('wow');
        } else if (dataGB >= 50) {
            setPanbehExpression('excited');
        } else {
            setPanbehExpression('default');
        }
    }, [dataGB]);

    const receiptProps = { dataGB, dataCost, hasSharedIP, hasDedicatedIP, SHARED_IP_COST, DEDICATED_IP_COST };

    return (
        <section id="calculator" className="w-full py-20 sm:py-28 relative z-10 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-3/4 bg-gradient-to-b from-purple-50 via-rose-50 to-transparent"></div>
            <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
                        کارگاه ساخت پلن پنبه‌ای شما
                    </h2>
                    <p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                        پلن خود را دقیقاً مطابق با نیازهایتان بسازید و فقط برای چیزی که استفاده می‌کنید، پول بدهید.
                    </p>
                </motion.div>

                {/* --- Desktop Layout --- */}
                <div className="hidden lg:grid grid-cols-1 lg:grid-cols-5 gap-8 items-center bg-white/60 backdrop-blur-xl rounded-[40px] shadow-2xl p-6 sm:p-10 border border-white/40">
                    <div className="lg:col-span-3 space-y-6 text-right">
                        <div>
                            <div className="flex justify-between items-baseline mb-3">
                                <label className="font-bold text-gray-700">حجم مصرفی ماهانه</label>
                                <p className="text-2xl font-black text-purple-600">
                                    {dataGB.toLocaleString('fa-IR')}
                                    <span className="text-base font-bold text-purple-500"> GB</span>
                                </p>
                            </div>
                            <div className="relative flex items-center">
                                <ChevronRight size={20} className="text-gray-400"/>
                                <input
                                    type="range" min="1" max="500" value={dataGB}
                                    onChange={(e) => setDataGB(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
                                />
                                <ChevronLeft size={20} className="text-gray-400"/>
                            </div>
                        </div>
                        <div className="w-full h-px bg-gray-200"></div>
                        <div>
                            <label className="font-bold text-gray-700 mb-3 block">قابلیت‌های ویژه</label>
                            <div className="space-y-3">
                                <CustomSwitch label="IP ثابت اشتراکی" price={SHARED_IP_COST} checked={hasSharedIP} onChange={setHasSharedIP} disabled={hasDedicatedIP}/>
                                <CustomSwitch label="IP ثابت اختصاصی" price={DEDICATED_IP_COST} checked={hasDedicatedIP} onChange={setHasDedicatedIP}/>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-purple-50/70 rounded-3xl p-6 h-full flex flex-col justify-between shadow-inner">
                        <div className="text-center">
                            <h3 className="text-xl font-extrabold text-purple-800 flex items-center justify-center gap-2">
                                <HardHat size={20}/> فاکتور ساخت شما
                            </h3>
                             <div className="relative w-28 h-28 mx-auto my-4">
                                <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl opacity-70"></div>
                                <PanbehCharacterAnimated size={110} float={false} expression={panbehExpression} />
                             </div>
                        </div>
                        <ReceiptDetails {...receiptProps} />
                        <div className="border-t-2 border-dashed border-gray-300 my-4"></div>
                        <div className="text-center">
                            <p className="font-bold text-gray-600">هزینه نهایی ماهانه</p>
                            <p className="text-4xl font-black text-purple-700 my-1">
                                <AnimatedCounter value={totalCost} />
                                <span className="text-xl font-bold"> تومان</span>
                            </p>
                        </div>
                        <Button className="auth-trigger w-full mt-4 rounded-full py-3 font-bold text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-purple-500/50 hover:-translate-y-1 transition-all">
                             <Wand2 size={18} className="ml-2"/> ساخت و خرید پلن
                        </Button>
                    </div>
                </div>

                {/* --- App-like Mobile Layout --- */}
                <div className="lg:hidden bg-white/60 backdrop-blur-xl rounded-[40px] shadow-2xl p-6 sm:p-8 border border-white/40 flex flex-col gap-6">
                    {/* Total Cost Display */}
                    <div className="text-center bg-purple-50/70 rounded-3xl p-4 shadow-inner">
                         <div className="relative w-20 h-20 mx-auto mb-2">
                            <div className="absolute inset-0 bg-yellow-200 rounded-full blur-lg opacity-70"></div>
                            <PanbehCharacterAnimated size={80} float={false} expression={panbehExpression} />
                         </div>
                        <p className="font-bold text-gray-600">هزینه نهایی ماهانه</p>
                        <p className="text-4xl font-black text-purple-700 my-1">
                            <AnimatedCounter value={totalCost} />
                            <span className="text-xl font-bold"> تومان</span>
                        </p>
                    </div>

                     {/* Controls */}
                    <div className="space-y-6 text-right">
                        <div>
                            <div className="flex justify-between items-baseline mb-3">
                                <label className="font-bold text-gray-700">حجم مصرفی</label>
                                <p className="text-xl font-black text-purple-600">
                                    {dataGB.toLocaleString('fa-IR')}
                                    <span className="text-sm font-bold text-purple-500"> GB</span>
                                </p>
                            </div>
                            <div className="relative flex items-center">
                                <input type="range" min="1" max="500" value={dataGB} onChange={(e) => setDataGB(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="font-bold text-gray-700 mb-3 block">قابلیت‌های ویژه</label>
                            <div className="space-y-3">
                                <CustomSwitch label="IP ثابت اشتراکی" price={SHARED_IP_COST} checked={hasSharedIP} onChange={setHasSharedIP} disabled={hasDedicatedIP}/>
                                <CustomSwitch label="IP ثابت اختصاصی" price={DEDICATED_IP_COST} checked={hasDedicatedIP} onChange={setHasDedicatedIP}/>
                            </div>
                        </div>
                    </div>
                    
                    {/* Details Toggle */}
                    <div className="border-t border-gray-200 pt-4">
                        <button onClick={() => setDetailsVisible(!detailsVisible)} className="flex justify-between items-center w-full text-gray-600 font-bold">
                            <span>مشاهده جزئیات فاکتور</span>
                             <motion.div animate={{ rotate: detailsVisible ? 180 : 0 }}>
                                <ChevronDown size={20} />
                            </motion.div>
                        </button>
                        <AnimatePresence>
                            {detailsVisible && (
                                <div className="pt-4">
                                     <ReceiptDetails {...receiptProps} isMobile={true} />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* CTA Button */}
                    <Button className="auth-trigger w-full mt-2 rounded-full py-3 font-bold text-base bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-purple-500/50 hover:-translate-y-1 transition-all">
                        <Wand2 size={18} className="ml-2"/> ساخت و خرید پلن
                    </Button>
                </div>

            </div>
        </section>
    );
};

export default CostCalculatorSection;