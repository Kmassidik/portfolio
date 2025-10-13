import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const ThemeToggle = ({ darkMode, setDarkMode }: ThemeToggleProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setDarkMode(!darkMode)}
      className={`
        w-full mt-8 py-3 font-semibold
        transition-colors duration-300 ease-in-out
        flex items-left justify-left gap-2
        ${darkMode ? "text-[#F5EFE7]" : "text-[#213555]"}
      `}
    >
      {darkMode ? (
        <>
          <Sun size={18} className="text-orange-500" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={18} className="text-black" />
          <span>Dark Mode</span>
        </>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
