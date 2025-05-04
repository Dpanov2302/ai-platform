
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });
  
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-xl p-2 min-w-6 min-h-6 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 relative"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 bottom-0.5 left-0.5 absolute transition-all duration-300 transform scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
      <Moon className="h-5 w-5 bottom-0.5 left-0.5 absolute transition-all duration-300 transform scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
