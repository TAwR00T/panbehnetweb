
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanbehCharacterAnimated } from './PanbehCharacterAnimated';
import { Button } from './ui/button';
import { LayoutDashboard, User, List, CreditCard, LogOut, ShoppingBag, Bot } from 'lucide-react';

import DashboardOverview from './dashboard/DashboardOverview';
import DashboardProfile from './dashboard/DashboardProfile';
import DashboardServices from './dashboard/DashboardServices';
import DashboardBilling from './dashboard/DashboardBilling';
import { DashboardAiChat } from './dashboard/DashboardAiChat';
import DashboardPlans from './dashboard/DashboardPlans';
import DashboardBottomNav from './dashboard/DashboardBottomNav';

export type DashboardView = 'overview' | 'profile' | 'services' | 'billing' | 'ai-chat' | 'plans';

export const navItems = [
    { id: 'overview', label: 'نمای کلی', icon: <LayoutDashboard size={20} /> },
    { id: 'services', label: 'سرویس‌ها', icon: <List size={20} /> },
    { id: 'plans', label: 'خرید اشتراک', icon: <ShoppingBag size={20} /> },
    { id: 'ai-chat', label: 'دستیار هوشمند', icon: <Bot size={20} /> },
    { id: 'billing', label: 'صورتحساب', icon: <CreditCard size={20} /> },
    { id: 'profile', label: 'مشخصات', icon: <User size={20} /> },
];


const renderView = (view: DashboardView, props: any) => {
    const viewProps = { ...props, userName: props.userName };
    switch(view) {
        case 'overview': return <DashboardOverview {...viewProps} />;
        case 'profile': return <DashboardProfile {...viewProps} />;
        case 'services': return <DashboardServices {...viewProps} />;
        case 'billing': return <DashboardBilling {...viewProps} />;
        case 'ai-chat': return <DashboardAiChat {...viewProps} />;
        case 'plans': return <DashboardPlans {...viewProps} />;
        default: return <DashboardOverview {...viewProps} />;
    }
};

export const DashboardLayout = ({ userName, onLogout, hasActivePlan, onPlanPurchase }) => {
    const [activeView, setActiveView] = useState<DashboardView>('overview');
    
    const handleNavigate = (view: DashboardView) => {
        setActiveView(view);
    };

    const viewProps = {
        userName,
        hasActivePlan,
        onNavigate: handleNavigate,
        onPlanPurchase,
    };

    return (
        <div className={`w-full min-h-screen flex flex-col lg:flex-row gap-6 z-10 ${activeView === 'ai-chat' ? 'p-0 lg:p-6' : 'p-0 sm:p-4 lg:p-6'}`}>
            {/* Sidebar for Desktop */}
            <motion.aside 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
                className="hidden lg:flex w-full lg:w-64 flex-shrink-0 bg-white/40 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/30 flex-col"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                        <PanbehCharacterAnimated size={40} float={false} />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-800">{userName}</h2>
                        <p className="text-sm text-gray-500">خوش آمدید</p>
                    </div>
                </div>

                <nav className="flex-grow">
                    <ul className="space-y-2">
                        {navItems.map(item => (
                            <li key={item.id}>
                                <button 
                                    onClick={() => handleNavigate(item.id as DashboardView)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-right font-semibold transition-all duration-300 relative ${
                                        activeView === item.id ? 'text-purple-800' : 'text-gray-600 hover:bg-white/50 hover:text-purple-700'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                    {activeView === item.id && (
                                        <motion.div 
                                            layoutId="active-nav-pill" 
                                            className="absolute inset-0 bg-gradient-to-r from-purple-200 to-rose-100 rounded-xl -z-10"
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                        />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <Button onClick={onLogout} className="w-full bg-rose-100/80 text-rose-700 hover:bg-rose-200/80 font-bold rounded-xl flex items-center justify-center gap-2 px-4 py-2.5 shadow-sm transition-colors">
                        <LogOut size={18} />
                        <span>خروج از حساب</span>
                    </Button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className={`flex-grow bg-white/20 backdrop-blur-2xl shadow-inner border border-white/20 overflow-hidden flex flex-col ${
                activeView === 'ai-chat' 
                ? 'p-0 lg:p-8 rounded-none lg:rounded-3xl' 
                : 'p-4 sm:p-6 lg:p-8 rounded-t-3xl lg:rounded-3xl'
            }`}>
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="h-full"
                    >
                        {renderView(activeView, viewProps)}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Nav for Mobile - Conditionally rendered */}
            {activeView !== 'ai-chat' && (
                <DashboardBottomNav activeView={activeView} onNavigate={handleNavigate} onLogout={onLogout} userName={userName} />
            )}
        </div>
    );
}