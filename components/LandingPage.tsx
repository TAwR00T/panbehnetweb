
import React, { lazy, Suspense } from 'react';
import HeroSection from './HeroSection'; // Eagerly load the main, above-the-fold component
import { LoaderCircle } from 'lucide-react';

const SectionLoader = () => (
  <div className="w-full flex justify-center items-center py-24">
    <LoaderCircle size={48} className="text-orange-500 animate-spin" />
  </div>
);

// Lazy-load all sections that are not immediately visible
const ChatbotIntroSection = lazy(() => import('./ChatbotIntroSection'));
const StatsSection = lazy(() => import('./StatsSection'));
const TelegramSection = lazy(() => import('./TelegramSection'));
const WhyChooseUsSection = lazy(() => import('./WhyChooseUsSection'));
const PricingSection = lazy(() => import('./PricingSection'));
const CostCalculatorSection = lazy(() => import('./CostCalculatorSection'));
const TestimonialsSection = lazy(() => import('./TestimonialsSection'));
const SupportSection = lazy(() => import('./SupportSection'));
const FaqSection = lazy(() => import('./FaqSection'));
const BottomNav = lazy(() => import('./BottomNav'));

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      
      <Suspense fallback={<SectionLoader />}>
        <ChatbotIntroSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <StatsSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TelegramSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <WhyChooseUsSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <PricingSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CostCalculatorSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <SupportSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <FaqSection />
      </Suspense>
      
      <div className="h-20 lg:hidden" /> 
      
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
    </>
  );
};

export default LandingPage;
