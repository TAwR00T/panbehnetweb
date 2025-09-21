
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, User, List, ShoppingBag, Bot } from 'lucide-react';
import { DashboardView, navItems } from '../Dashboard';

interface BottomNavProps {
    activeView: DashboardView;
    onNavigate: (view: DashboardView) => void;
    onLogout: () => void;
    userName: string;
}

const mobileNavItems = [
    { id: 'overview', label: 'نمای کلی', icon: <LayoutDashboard size={24} /> },
    { id: 'plans', label: 'پلن‌ها', icon: <ShoppingBag size={24} /> },
    { id: 'ai-chat', label: 'دستیار', icon: <Bot size={30} /> },
    { id: 'services', label: 'سرویس‌ها', icon: <List size={24} /> },
    { id: 'profile', label: 'پروفایل', icon: <User size={24} /> },
];


const DashboardBottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="lg:hidden fixed bottom-0 left-0 w-full h-20 bg-white/70 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.1)] z-50 border-t border-white/40 flex items-center justify-around px-2"
        >
            {mobileNavItems.map((item) => {
                const isActive = activeView === item.id;

                if (item.id === 'ai-chat') {
                    return (
                         <button 
                            key={item.id} 
                            onClick={() => onNavigate(item.id as DashboardView)}
                            className="relative -top-6"
                         >
                            <motion.div 
                                whileTap={{ scale: 0.9 }}
                                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/40 border-4 border-white"
                            >
                                <div className="text-white">{item.icon}</div>
                            </motion.div>
                        </button>
                    );
                }

                return (
                    <button 
                        key={item.id} 
                        onClick={() => onNavigate(item.id as DashboardView)}
                        className="relative flex-1 flex flex-col items-center justify-center h-full rounded-2xl transition-colors duration-300 text-gray-600 focus:outline-none focus:text-purple-700"
                        aria-label={item.label}
                    >
                         <div className="relative flex flex-col items-center pt-1">
                             <motion.div 
                                className={`relative transition-colors duration-300 ${isActive ? 'text-purple-700' : 'hover:text-purple-600'}`}
                                animate={{ y: isActive ? -2 : 0 }}
                            >
                                {item.icon}
                            </motion.div>
                             <motion.span 
                                className="text-[10px] font-bold text-purple-700"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isActive ? 1 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                               {item.label}
                            </motion.span>
                        </div>
                        <AnimatePresence>
                         {isActive && (
                            <motion.div
                                className="absolute inset-2 bg-purple-100/80 rounded-xl -z-10"
                                layoutId="active-dashboard-nav-indicator"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            />
                         )}
                         </AnimatePresence>
                    </button>
                );
            })}
        </motion.nav>
    );
};

export default DashboardBottomNav;