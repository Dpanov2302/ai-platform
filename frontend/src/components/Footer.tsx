import {Github} from 'lucide-react';
import {TelegramIcon, MireaIcon, MireaEmblem} from '@/components/icons';
import {Link} from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wider uppercase">
                            Платформа
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link to="/models"
                                      className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                                    Модели
                                </Link>
                            </li>
                            <li>
                                <Link to="/api"
                                      className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                                    API
                                </Link>
                            </li>
                            <li>
                                <Link to="/docs"
                                      className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                                    Документация
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wider uppercase">
                            Ресурсы
                        </h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <a href="#"
                                   className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                                    Руководства
                                </a>
                            </li>
                            <li>
                                <a href="#"
                                   className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                                    Примеры
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wider uppercase">
                            Социальные сети
                        </h3>
                        <div className="flex items-center space-x-6 mt-4">
                            <a
                                href="https://github.com/Dpanov2302/ai-platform"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                            >
                                <Github className="h-6 w-6"/>
                            </a>
                            <a
                                href="https://t.me/dpanov2302"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                            >
                                <TelegramIcon className="h-6 w-6"/>
                            </a>
                            <a
                                href="https://www.mirea.ru/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                            >
                                <MireaEmblem className="h-8 w-8"/>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                    <p className="text-base text-gray-400 text-center">
                        &copy; 2025 AI Infrastructure Platform.
                    </p>
                </div>
            </div>
        </footer>
    );
};
