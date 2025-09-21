
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoaderCircle, CheckCircle } from 'lucide-react';

// --- Global Toast Notification System ---
const toastEventEmitter = new EventTarget();
export const showToast = (message: string) => {
    toastEventEmitter.dispatchEvent(new CustomEvent('showtoast', { detail: message }));
};

const Toast = () => {
    const [toast, setToast] = useState<{ message: string; id: number } | null>(null);

    useEffect(() => {
        const handleShowToast = (e: Event) => {
            const customEvent = e as CustomEvent;
            setToast({ message: customEvent.detail, id: Date.now() });
        };
        
        toastEventEmitter.addEventListener('showtoast', handleShowToast);
        
        return () => {
            toastEventEmitter.removeEventListener('showtoast', handleShowToast);
        };
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    className="fixed bottom-24 lg:bottom-10 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-gray-900/80 backdrop-blur-md text-white font-bold rounded-full shadow-lg flex items-center gap-3 border border-white/20"
                >
                    <CheckCircle size={20} className="text-green-400" />
                    {toast.message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
// --- End of Toast System ---


// Loader component to be used as a fallback for Suspense
const FullPageLoader = () => (
    <div className="fixed inset-0 flex justify-center items-center bg-white/50">
        <LoaderCircle size={48} className="text-orange-500 animate-spin" />
    </div>
);


// Lazy load all major components
const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));
const BubbleBg = lazy(() => import('./components/BubbleBg'));
const CursorLightEffect = lazy(() => import('./components/CursorLightEffect'));
const BackgroundPattern = lazy(() => import('./components/BackgroundPattern'));
const SunbeamEffect = lazy(() => import('./components/SunbeamEffect'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const DashboardLayout = lazy(() => import('./components/Dashboard').then(module => ({ default: module.DashboardLayout })));
const LandingPage = lazy(() => import('./components/LandingPage'));
const BlogPage = lazy(() => import('./components/BlogPage'));
const BlogPostPage = lazy(() => import('./components/BlogPostPage'));
const DashboardAiChat = lazy(() => import('./components/dashboard/DashboardAiChat').then(module => ({ default: module.DashboardAiChat })));


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
        const slug = path.substring(6);
        return <BlogPostPage slug={slug} />;
    }

    if (path === '/blog') {
        return <BlogPage />;
    }
    
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
      <Suspense fallback={null}>
        <CursorLightEffect />
        <SunbeamEffect />
        <BackgroundPattern /> 
        <BubbleBg />
      </Suspense>
      
      <Suspense fallback={<FullPageLoader />}>
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
      </Suspense>
      
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
                    <Suspense fallback={<FullPageLoader />}>
                      <DashboardAiChat 
                          onNavigate={() => {}}
                          isStandalone={true}
                          onClose={() => setIsChatOpen(false)}
                          userName={userName}
                      />
                    </Suspense>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <Toast />
    </motion.main>
  );
}