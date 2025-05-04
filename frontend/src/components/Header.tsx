
import {useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {ThemeToggle} from './ThemeToggle';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {pathname} = useLocation();
    const navigate = useNavigate();

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        if (pathname !== '/') {
            navigate('/', { state: { scrollTo: targetId } });
        } else {
            const element = document.getElementById(targetId);
            if (element) {
                const offset = window.innerHeight / 4;
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });

                navigate(location.pathname, { replace: true });
            }
        }
        setIsMenuOpen(false);
    };

    return (
        <header
            className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm fixed top-0 z-50 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <Link to="/" onClick={(e) => handleNavClick(e, 'hero')} className="text-xl font-bold text-blue-600 dark:text-blue-400">AI Platform</Link>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>

                    <div className="hidden md:flex items-center space-x-8">
                        <nav className="flex space-x-8">
                            <a
                                href="#advantages"
                                onClick={(e) => handleNavClick(e, 'advantages')}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                            >
                                Преимущества
                            </a>
                            <a
                                href="#how-it-works"
                                onClick={(e) => handleNavClick(e, 'how-it-works')}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                            >
                                Как это работает
                            </a>
                            <a
                                href="#models"
                                onClick={(e) => handleNavClick(e, 'models')}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                            >
                                Модели
                            </a>
                        </nav>
                        <ThemeToggle/>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="pt-2 pb-3 space-y-1">
                            <a
                                href="#advantages"
                                className="block px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Преимущества
                            </a>
                            <a
                                href="#how-it-works"
                                className="block px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Как это работает
                            </a>
                            <a
                                href="#models"
                                className="block px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Модели
                            </a>
                        </div>
                        <div className="pt-2 pb-3 px-3">
                            <ThemeToggle/>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
