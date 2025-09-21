
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { User, KeyRound, Mail, Phone, CheckCircle, ShieldCheck, LoaderCircle } from 'lucide-react';

const FormInput = ({ label, id, icon, ...props }: { label?: string; id: string; icon: React.ReactNode; [key: string]: any; }) => (
    <div>
        {label && <label htmlFor={id} className="block text-sm font-bold text-gray-600 mb-2">{label}</label>}
        <div className="relative">
            <input
                id={id}
                {...props}
                className="w-full bg-white/70 border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-11 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400">
                {icon}
            </div>
        </div>
    </div>
);

const SectionCard = ({ title, children, delay = 0 }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white/50 backdrop-blur-lg rounded-3xl p-6 border border-white/50 shadow-md"
    >
        <h2 className="text-xl font-extrabold text-gray-800 mb-6">{title}</h2>
        <div className="space-y-4">
            {children}
        </div>
    </motion.div>
);

const VerificationItem = ({ label, isVerified: initialIsVerified, icon }) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'awaiting_otp' | 'success'>(initialIsVerified ? 'success' : 'idle');
    const [otp, setOtp] = useState('');

    const handleVerifyClick = () => {
        setStatus('loading');
        setTimeout(() => {
            setStatus('awaiting_otp');
        }, 1500);
    };

    const handleOtpSubmit = () => {
        // Fake OTP check
        if (otp === '1234') {
            setStatus('success');
        } else {
            alert('کد وارد شده صحیح نیست!');
        }
    };
    
    const renderButton = () => {
        switch (status) {
            case 'idle':
                return <Button onClick={handleVerifyClick} size="sm" className="bg-orange-100 text-orange-700 hover:bg-orange-200 font-bold rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all w-28 justify-center">ارسال کد تایید</Button>;
            case 'loading':
                return <Button disabled size="sm" className="bg-orange-100 text-orange-700 font-bold rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all w-28 justify-center"><LoaderCircle size={14} className="animate-spin" /><span>در حال ارسال...</span></Button>;
            case 'success':
                return <div className="flex items-center gap-2 text-green-600 font-bold text-sm"><CheckCircle size={18} /><span>تایید شده</span></div>;
            case 'awaiting_otp':
                return null;
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-200/80">
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="font-semibold text-gray-700">{label}</span>
                </div>
                {renderButton()}
            </div>
             <AnimatePresence>
                {status === 'awaiting_otp' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '0.75rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="flex items-center gap-2"
                    >
                         <FormInput 
                            id={`otp-${label}`}
                            icon={<ShieldCheck size={18} />}
                            type="text" 
                            placeholder="کد تایید" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                         />
                         <Button onClick={handleOtpSubmit} size="sm" className="bg-green-500 text-white font-bold rounded-lg px-4 h-[45px] mt-auto">تایید کد</Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DashboardProfile = () => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-8">مشخصات کاربری</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                    <SectionCard title="اطلاعات شخصی">
                        <FormInput label="نام کامل" id="fullName" icon={<User size={18} />} type="text" defaultValue="کاربر پنبه‌ای" />
                        <FormInput label="آدرس ایمیل" id="email" icon={<Mail size={18} />} type="email" defaultValue="user@example.com" />
                         <Button className="w-full mt-2 rounded-lg bg-purple-600 text-white font-bold py-2.5">ذخیره تغییرات</Button>
                    </SectionCard>
                    <SectionCard title="امنیت حساب" delay={0.1}>
                        <VerificationItem label="ایمیل" isVerified={true} icon={<Mail size={20} className="text-gray-500"/>} />
                        <VerificationItem label="شماره موبایل" isVerified={false} icon={<Phone size={20} className="text-gray-500"/>} />
                    </SectionCard>
                </div>
                <SectionCard title="تغییر رمز عبور" delay={0.2}>
                    <FormInput label="رمز عبور فعلی" id="currentPassword" icon={<KeyRound size={18} />} type="password" placeholder="••••••••" />
                    <FormInput label="رمز عبور جدید" id="newPassword" icon={<KeyRound size={18} />} type="password" placeholder="••••••••" />
                    <FormInput label="تکرار رمز عبور جدید" id="confirmPassword" icon={<KeyRound size={18} />} type="password" placeholder="••••••••" />
                    <Button className="w-full mt-2 rounded-lg bg-purple-600 text-white font-bold py-2.5">تغییر رمز</Button>
                </SectionCard>
            </div>
        </div>
    );
};

export default DashboardProfile;