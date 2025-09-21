
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, User, KeyRound, ShieldCheck } from 'lucide-react';
import { PanbehCharacterAnimated } from './PanbehCharacterAnimated';
import { Button } from './ui/button';
import { GoogleIcon } from './icons/GoogleIcon';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (name: string) => void;
}

type AuthStep = 'welcome' | 'login' | 'register';

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalContainerVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
    exit: { opacity: 0, scale: 0.85, y: 50, transition: { duration: 0.3, ease: 'easeIn' as const } },
};

const stepVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
    }),
};

// --- A simple styled input component ---
const FormInput = ({ icon, ...props }) => (
    <div className="relative">
        <input
            {...props}
            className="w-full bg-white/70 border-2 border-gray-200 rounded-full px-4 py-3 pr-12 placeholder:text-gray-400 placeholder:font-medium placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
        />
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400">
            {icon}
        </div>
    </div>
);


const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [[step, direction], setStep] = useState<[AuthStep, number]>(['welcome', 0]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');

    const paginate = (newStep: AuthStep, newDirection: number) => {
        setStep([newStep, newDirection]);
    };

    const handleContinue = () => {
        // Fake check if user exists.
        const knownNumbers = ['09123456789'];
        if (knownNumbers.includes(phoneNumber.trim())) {
            paginate('login', 1);
        } else {
            paginate('register', 1);
        }
    };

    const handleBack = () => {
        paginate('welcome', -1);
    };
    
    const handleLogin = () => {
        // In a real app, you'd verify the password
        onLoginSuccess('کاربر بازگشته');
    };

    const handleRegister = () => {
        // In a real app, you'd save the user
        if (fullName.trim()) {
            onLoginSuccess(fullName);
        } else {
            onLoginSuccess('کاربر جدید');
        }
    };

    // Reset to welcome screen when modal is closed/reopened
    useEffect(() => {
        if (isOpen) {
            setStep(['welcome', 0]);
            setPhoneNumber('');
            setFullName('');
            setPassword('');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
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
    
    const panbehExpression = {
        welcome: 'default',
        login: 'thinking',
        register: 'writing',
    }[step] as 'default' | 'thinking' | 'writing';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    variants={backdropVariants}
                    initial="hidden" animate="visible" exit="hidden"
                    onClick={onClose} aria-modal="true" role="dialog"
                >
                    <motion.div
                        className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-sm border border-white/30 text-center p-8"
                        variants={modalContainerVariants}
                        layout
                        transition={{
                            layout: { duration: 0.4, type: 'spring', stiffness: 250, damping: 25 },
                            ...modalContainerVariants.visible.transition
                        }}
                        initial="hidden" animate="visible" exit="exit"
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 left-4 w-10 h-10 bg-white/50 rounded-full flex items-center justify-center text-gray-700 shadow-md hover:bg-rose-100 hover:text-rose-600 hover:scale-110 hover:rotate-90 transition-all duration-300 z-20"
                            aria-label="بستن"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative w-28 h-28 mx-auto -mt-20 mb-4">
                           <div className="absolute inset-0 bg-yellow-300 rounded-full blur-2xl opacity-80"></div>
                           <PanbehCharacterAnimated size={120} float={false} expression={panbehExpression} />
                        </div>
                        
                        <div className="relative min-h-[260px]">
                           <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={step}
                                    custom={direction}
                                    variants={stepVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                                    className="absolute w-full"
                                >
                                    {step === 'welcome' && (
                                        <div>
                                            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">به دنیای پنبه خوش آمدی!</h2>
                                            <p className="text-gray-600 mb-8">برای ادامه وارد شوید یا ثبت‌نام کنید.</p>
                                            <div className="space-y-4">
                                                <Button className="w-full rounded-full bg-white text-gray-800 font-bold px-6 py-3 shadow-md hover:shadow-lg hover:bg-gray-50 border border-gray-200 transition-all flex items-center justify-center gap-3">
                                                    <GoogleIcon className="w-6 h-6" />
                                                    <span>ادامه با حساب گوگل</span>
                                                </Button>
                                                <div className="flex items-center gap-4"><hr className="flex-grow border-gray-200"/><span className="text-sm text-gray-500 font-semibold">یا</span><hr className="flex-grow border-gray-200"/></div>
                                                <div className="flex flex-col gap-3">
                                                    <input type="tel" placeholder="شماره موبایل خود را وارد کنید" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                                                        className="w-full text-center tracking-wider font-bold text-lg bg-white/70 border-2 border-gray-200 rounded-full px-4 py-3 placeholder:text-gray-400 placeholder:font-medium placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                                    />
                                                    <Button onClick={handleContinue} className="w-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-6 py-3 shadow-lg hover:shadow-orange-400/50 transition-all">ادامه</Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {step === 'login' && (
                                        <div>
                                            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">ورود به حساب</h2>
                                            <p className="text-gray-600 mb-8">شماره شما: <span className="font-bold tracking-wider">{phoneNumber}</span></p>
                                            <div className="space-y-4">
                                                <FormInput type="password" placeholder="رمز عبور خود را وارد کنید" icon={<KeyRound size={18} />} />
                                                <Button onClick={handleLogin} className="w-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-6 py-3 shadow-lg hover:shadow-orange-400/50 transition-all">ورود</Button>
                                            </div>
                                        </div>
                                    )}

                                    {step === 'register' && (
                                        <div>
                                            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">ساخت حساب جدید</h2>
                                            <p className="text-gray-600 mb-6">فقط چند قدم تا ماجراجویی مونده!</p>
                                            <div className="space-y-3">
                                                <FormInput type="text" placeholder="نام کامل" icon={<User size={18} />} value={fullName} onChange={e => setFullName(e.target.value)} />
                                                <FormInput type="password" placeholder="یک رمز عبور قوی انتخاب کن" icon={<KeyRound size={18} />} value={password} onChange={e => setPassword(e.target.value)} />
                                                <Button onClick={handleRegister} className="w-full mt-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-6 py-3 shadow-lg hover:shadow-orange-400/50 transition-all">ساخت حساب</Button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        
                        <div className="mt-8">
                             <p className="text-xs text-gray-500 leading-relaxed">
                                با ورود یا ثبت‌نام، <a href="#" className="text-orange-600 font-bold hover:underline">شرایط خدمات</a> و <a href="#" className="text-orange-600 font-bold hover:underline">سیاست حفظ حریم خصوصی</a> پنبه را می‌پذیرید.
                            </p>
                            <AnimatePresence>
                                {step !== 'welcome' && (
                                     <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="mt-4"
                                    >
                                        <button onClick={handleBack} className="text-gray-500 hover:text-orange-600 font-semibold flex items-center gap-1.5 transition-colors mx-auto">
                                            <ArrowRight size={16} />
                                            <span>بازگشت</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;