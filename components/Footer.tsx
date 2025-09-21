
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { PanbehCharacterAnimated } from './PanbehCharacterAnimated';
import { Mail, Phone, Twitter, Instagram, Send, Sparkles } from 'lucide-react';

const FooterCard = ({ children, className = '' }) => (
    <motion.div
        className={`bg-gray-800/60 backdrop-blur-lg rounded-3xl p-6 border border-gray-600/50 ${className}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
        {children}
    </motion.div>
);

const Footer = () => {
    return (
        <footer className="w-full bg-gray-900 text-white pt-32 pb-12 lg:pb-12 pb-32 relative z-10 overflow-hidden">
             <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_center,_rgba(124,58,237,0.2)_0%,_transparent_40%)]"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.15)_0%,_transparent_50%)]"></div>
             </div>
            
            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                {/* --- Desktop Layout --- */}
                <div className="hidden lg:grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Contact Info */}
                    <FooterCard className="lg:col-span-1">
                        <h3 className="font-bold text-lg mb-4 text-orange-400">تماس با ما</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-center gap-3 hover:text-white transition-colors">
                                <Mail size={18} className="text-orange-400" />
                                <a href="mailto:support@panbeh.vpn">support@panbeh.vpn</a>
                            </li>
                            <li className="flex items-center gap-3 hover:text-white transition-colors">
                                <Phone size={18} className="text-orange-400" />
                                <a href="tel:+982112345678">۰۲۱-۱۲۳۴۵۶۷۸</a>
                            </li>
                        </ul>
                    </FooterCard>

                    {/* Main CTA */}
                    <div className="lg:col-span-2 order-first lg:order-none">
                        <motion.div
                             className="bg-gray-800/60 backdrop-blur-lg rounded-3xl p-6 pt-0 border border-gray-600/50 text-center"
                             initial={{ opacity: 0, y: 60 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             viewport={{ once: true, amount: 0.5 }}
                             transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
                        >
                            <div className="relative -mt-16">
                                <PanbehCharacterAnimated size={160} />
                            </div>
                            <h2 className="text-2xl font-extrabold text-white mb-3">
                                آماده شروع یک ماجراجویی امن هستی؟
                            </h2>
                            <p className="text-gray-400 mb-6">
                                به بیش از ۱۰۰ هزار کاربر راضی پنبه بپیوندید.
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button className="auth-trigger rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-8 py-3 text-base shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all hover:-translate-y-1 flex items-center gap-2 mx-auto">
                                    <Sparkles size={20} />
                                    شروع ماجراجویی
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                    
                    {/* Quick Links */}
                    <FooterCard className="lg:col-span-1">
                        <h3 className="font-bold text-lg mb-4 text-orange-400">لینک‌های مفید</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li><a href="/#features" className="hover:text-white transition-colors">ویژگی‌ها</a></li>
                            <li><a href="/#plans" className="hover:text-white transition-colors">پلن‌ها</a></li>
                            <li><a href="/blog" className="hover:text-white transition-colors">وبلاگ</a></li>
                            <li><a href="/#faq" className="hover:text-white transition-colors">سوالات متداول</a></li>
                        </ul>
                    </FooterCard>
                </div>
                
                {/* --- App-like Mobile Layout --- */}
                <div className="lg:hidden flex flex-col items-center text-center -mt-12">
                     <motion.div
                        className="bg-gray-800/60 backdrop-blur-lg rounded-3xl p-8 border border-gray-600/50 w-full max-w-sm"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    >
                        <div className="relative w-24 h-24 mx-auto -mt-20 mb-4">
                            <PanbehCharacterAnimated size={120} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-white mb-2">
                            آماده شروع هستی؟
                        </h2>
                        <p className="text-gray-400 mb-6">
                            به بیش از ۱۰۰ هزار کاربر راضی پنبه بپیوندید.
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="auth-trigger rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-8 py-3 text-base shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all hover:-translate-y-1 flex items-center gap-2 mx-auto">
                                <Sparkles size={20} />
                                شروع ماجراجویی
                            </Button>
                        </motion.div>
                        <div className="mt-8 pt-6 border-t border-gray-700/50 flex justify-center gap-6">
                            <motion.a href="#" whileHover={{ y: -3 }} className="p-3 bg-gray-700 rounded-full hover:bg-orange-500 transition-colors">
                                <Twitter size={20} />
                            </motion.a>
                            <motion.a href="#" whileHover={{ y: -3 }} className="p-3 bg-gray-700 rounded-full hover:bg-orange-500 transition-colors">
                                <Instagram size={20} />
                            </motion.a>
                            <motion.a href="#" whileHover={{ y: -3 }} className="p-3 bg-gray-700 rounded-full hover:bg-orange-500 transition-colors">
                                <Send size={20} />
                            </motion.a>
                        </div>
                    </motion.div>
                </div>

                {/* --- Common Bottom Bar for all sizes --- */}
                <div className="mt-16 pt-8 border-t border-gray-700/50 flex flex-col md:flex-row justify-between items-center text-center md:text-right">
                    <p className="text-sm text-gray-500 mb-4 md:mb-0">
                        © {new Date().getFullYear()} Panbeh VPN. تمام حقوق پنبه‌ای محفوظ است.
                    </p>
                    <div className="hidden lg:flex items-center gap-4">
                        <motion.a href="#" whileHover={{ y: -3 }} className="p-2 bg-gray-800 rounded-full hover:bg-orange-500 transition-colors">
                            <Twitter size={20} />
                        </motion.a>
                        <motion.a href="#" whileHover={{ y: -3 }} className="p-2 bg-gray-800 rounded-full hover:bg-orange-500 transition-colors">
                            <Instagram size={20} />
                        </motion.a>
                        <motion.a href="#" whileHover={{ y: -3 }} className="p-2 bg-gray-800 rounded-full hover:bg-orange-500 transition-colors">
                            <Send size={20} />
                        </motion.a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;