import {ArrowRight} from 'lucide-react';
import {Header} from './Header';

export const HeroSection = () => {
    const handleTryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const element = document.getElementById('models');
        if (element) {
            const offset = window.innerHeight / 4;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div id='hero' className="relative isolate px-6 pt-14 lg:px-8">
            <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-32">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                        Откройте для себя магию искусственного интеллекта
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Мгновенная генерация текста, анализ тональности и другие AI-возможности прямо в браузере —
                        никаких сложных настроек
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="#models"
                            onClick={handleTryClick}
                            className="group rounded-full px-8 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 transition-all"
                        >
                            Попробовать
                            <ArrowRight
                                className="inline-block ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
