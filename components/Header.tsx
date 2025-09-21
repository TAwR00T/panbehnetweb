
import React from 'react';
import { PanbehCharacterAnimated } from './PanbehCharacterAnimated';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const Header = () => {
  const navLinks = [
    { name: "ویژگی‌ها", href: "/#features" },
    { name: "پلن‌ها", href: "/#plans" },
    { name: "وبلاگ", href: "/blog" },
    { name: "نظرات", href: "/#testimonials" },
  ];

  return (
    <header className="hidden lg:block fixed top-0 left-0 w-full z-50 px-4">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center pt-4">
        <div className="w-full bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-lg p-3 sm:p-4 border border-gray-600/30">
            <div className="flex justify-between items-center">
                <a href="/" className="flex items-center gap-3">
                    <motion.div 
                        className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        <PanbehCharacterAnimated float={false} size={45} />
                    </motion.div>
                    <div className="hidden sm:block">
                        <h1 className="text-xl font-extrabold text-white">پنبه وی‌پی‌ان</h1>
                        <p className="text-xs text-gray-400">اینترنت آزاد برای همه</p>
                    </div>
                </a>

                <nav className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                    <motion.a
                        key={link.name}
                        href={link.href}
                        className="relative font-medium text-gray-300 transition-colors"
                        whileHover="hover"
                        initial="initial"
                    >
                        <span className="hover:text-orange-400">{link.name}</span>
                        <motion.span
                            className="absolute bottom-[-5px] left-0 h-[2px] w-full bg-orange-400"
                            variants={{
                                initial: { scaleX: 0, originX: 0.5 },
                                hover: { scaleX: 1, originX: 0.5 }
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    </motion.a>
                ))}
                </nav>

                <div>
                    <div className="hidden lg:flex">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="auth-trigger rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-6 py-2.5 hover:shadow-lg hover:shadow-orange-400/50 transition-all">
                                شروع رایگان
                            </Button>
                        </motion.div>
                    </div>
                    {/* Hamburger menu is removed as the header is hidden on mobile */}
                </div>
            </div>
        </div>
    </header>
  );
};

export default Header;