import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { AdvantagesSection } from '../components/AdvantagesSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { ModelsGrid } from '../components/ModelsGrid';
import { Footer } from '../components/Footer';

const HomePage = () => {
    const location = useLocation();

    useEffect(() => {
        const scrollTo = location.state?.scrollTo;
        if (scrollTo) {
            // Небольшая задержка, чтобы DOM успел отрисоваться
            setTimeout(() => {
                const element = document.getElementById(scrollTo);
                if (element) {
                    const offset = window.innerHeight / 4;
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: elementPosition - offset,
                        behavior: 'smooth'
                    });
                }
            }, 100); // можно чуть больше, если нужно
        }
    }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main>
        <HeroSection />
        <AdvantagesSection />
        <HowItWorksSection />
        <ModelsGrid />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
