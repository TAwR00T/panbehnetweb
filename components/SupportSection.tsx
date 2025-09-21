
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Bot, MessageSquare } from 'lucide-react';
import { PanbehCharacterAnimated } from './PanbehCharacterAnimated';

const SupportSection = () => {
    return (
        <section id="support" className="w-full py-20 sm:py-28 relative z-10">
            <div className="container mx-auto px-4 max-w-2xl text-center">
                <motion.div
                    className="relative bg-gradient-to-b from-[#232228] to-[#141317] rounded-[40px] shadow-2xl p-8 sm:p-12 border border-white/10 text-white overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.15)_0%,_transparent_50%)] opacity-50"></div>
                    
                    <div className="relative z-10">
                        <div className="w-32 h-32 mx-auto mb-4">
                             <div className="absolute inset-4 bg-yellow-300/50 rounded-full blur-2xl"></div>
                            <PanbehCharacterAnimated size={128} />
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                           کمک فوری نیاز دارید؟
                        </h2>
                        <p className="text-gray-300 mb-10 leading-relaxed max-w-md mx-auto">
                           با یک کلیک با پشتیبانی ما در ارتباط باشید. تیم ما ۲۴ ساعته آماده کمک است.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button className="chat-trigger w-full sm:w-auto rounded-full py-3 px-6 font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                                <Bot size={20} />
                                <span>چت با دستیار هوشمند</span>
                            </Button>
                            <Button className="auth-trigger w-full sm:w-auto rounded-full py-3 px-6 font-bold bg-white/10 text-white border border-white/20 backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-1 flex items-center justify-center gap-2">
                                <MessageSquare size={20} />
                                <span>پشتیبانی انسانی</span>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SupportSection;