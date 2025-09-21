
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import BubbleBg from './components/BubbleBg';
import CursorLightEffect from './components/CursorLightEffect';
import BackgroundPattern from './components/BackgroundPattern';
import SunbeamEffect from './components/SunbeamEffect';
import AuthModal from './components/AuthModal';
import { DashboardLayout } from './components/Dashboard';
import { DashboardAiChat } from './components/dashboard/DashboardAiChat';
import LandingPage from './components/LandingPage';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [hasActivePlan, setHasActivePlan] = useState(false);

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setHasActivePlan(false); 
  };

  const handleLogout = () => {
    setUserName('');
    setIsAuthenticated(false);
    setHasActivePlan(false);
  };
  
  const handlePlanPurchase = () => {
    setHasActivePlan(true);
  };

  useEffect(() => {
    const handleAuthTriggerClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.auth-trigger')) {
        e.preventDefault();
        setIsAuthModalOpen(true);
      }
    };

    document.addEventListener('click', handleAuthTriggerClick);
    return () => {
      document.removeEventListener('click', handleAuthTriggerClick);
    };
  }, []);

  useEffect(() => {
    const handleChatTriggerClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('.chat-trigger')) {
            e.preventDefault();
            setIsChatOpen(true);
        }
    };
    document.addEventListener('click', handleChatTriggerClick);
    return () => {
        document.removeEventListener('click', handleChatTriggerClick);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      document.title = `داشبورد کاربری | پنبه VPN`;
    }
  }, [isAuthenticated]);

  const renderPage = () => {
    const path = window.location.pathname;

    if (path.startsWith('/blog/')) {
        const slug = path.substring(6); // Remove '/blog/'
        return <BlogPostPage slug={slug} />;
    }

    if (path === '/blog') {
        return <BlogPage />;
    }
    
    // Default to landing page for '/' or any other path
    return <LandingPage />;
  };


  return (
    <motion.main 
      className="relative flex flex-col items-center px-0 pb-0 overflow-x-hidden"
      style={{
        background: 'linear-gradient(160deg, #fff5c0 0%, #ffe08c 40%, #ffc288 70%, #ffbda6 100%)',
        backgroundSize: '400% 400%',
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      <CursorLightEffect />
      <SunbeamEffect />
      <BackgroundPattern /> 
      <BubbleBg />
      
      {isAuthenticated ? (
        <DashboardLayout 
          userName={userName} 
          onLogout={handleLogout} 
          hasActivePlan={hasActivePlan}
          onPlanPurchase={handlePlanPurchase}
        />
      ) : (
        <>
          <Header />
          {renderPage()}
          <Footer />
        </>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen && !isAuthenticated} 
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLogin}
      />

      <AnimatePresence>
        {isChatOpen && (
            <motion.div
                className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center lg:p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsChatOpen(false)}
            >
                <motion.div 
                    className="w-full h-full lg:w-full lg:max-w-[1200px] lg:h-full lg:max-h-[85vh] lg:rounded-3xl overflow-hidden"
                    initial={{ y: '100vh', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100vh', opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <DashboardAiChat 
                        onNavigate={() => {}}
                        isStandalone={true}
                        onClose={() => setIsChatOpen(false)}
                        userName={userName}
                    />
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}