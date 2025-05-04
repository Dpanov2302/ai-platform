import { useEffect, useState } from 'react';

const advantages = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: "Без регистрации",
    description: "Начните использовать сервис прямо сейчас"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Быстрый отклик",
    description: "Мгновенная обработка запросов"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    title: "Поддержка популярных моделей",
    description: "GPT, BERT, CNN и другие"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    title: "Работает в браузере",
    description: "Не требует установки"
  }
];

export const AdvantagesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % advantages.length);
        setIsVisible(true);
      }, 1000); // Wait for fade out animation before changing content
      
    }, 4000); // Change item every 4 seconds

    return () => clearInterval(intervalId);
  }, []);

  const currentAdvantage = advantages[currentIndex];

  return (
    <section id="advantages" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Преимущества
        </h2>
        <div className="flex justify-center items-center min-h-[200px] md:min-h-[300px]">
          <div
            className={`flex items-center justify-center space-x-4 transition-all duration-1000 transform ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }  md:px-16 md:py-12 md:bg-white md:dark:bg-gray-800 md:rounded-full md:shadow-lg md:hover:shadow-xl`}
          >
            <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              {currentAdvantage.icon}
            </div>
            <div className="text-left">
              <h3 className="text-lg md:text-2xl font-semibold text-gray-900 dark:text-white">
                {currentAdvantage.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 md:text-lg">
                {currentAdvantage.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
