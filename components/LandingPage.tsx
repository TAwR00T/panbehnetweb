
import React from 'react';
import HeroSection from './HeroSection';
import ChatbotIntroSection from './ChatbotIntroSection';
import StatsSection from './StatsSection';
import TelegramSection from './TelegramSection';
import WhyChooseUsSection from './WhyChooseUsSection';
import PricingSection from './PricingSection';
import CostCalculatorSection from './CostCalculatorSection';
import TestimonialsSection from './TestimonialsSection';
import SupportSection from './SupportSection';
import FaqSection from './FaqSection';
import BottomNav from './BottomNav';

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <ChatbotIntroSection />
      <StatsSection />
      <TelegramSection />
      <WhyChooseUsSection />
      <PricingSection />
      <CostCalculatorSection />
      <TestimonialsSection />
      <SupportSection />
      <FaqSection />
      <div className="h-20 lg:hidden" /> 
      <BottomNav />
    </>
  );
};

export default LandingPage;
