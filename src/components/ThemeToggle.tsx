import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const ThemeToggle = ({ darkMode, setDarkMode }: ThemeToggleProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      whileTap={reduceMotion ? undefined : { scale: 0.9 }}
      onClick={() => setDarkMode(!darkMode)}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={darkMode}
      className={`flex cursor-pointer items-center justify-center rounded-full p-2.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c15f3c] focus-visible:ring-offset-2 ${
        darkMode
          ? "text-gray-400 hover:bg-white/5 hover:text-white focus-visible:ring-offset-[#1e1e1d]"
          : "text-gray-500 hover:bg-black/5 hover:text-gray-900 focus-visible:ring-offset-white"
      }`}
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </motion.button>
  );
};

export default ThemeToggle;
