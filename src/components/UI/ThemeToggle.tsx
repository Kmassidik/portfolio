import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const ThemeToggle = ({ darkMode, setDarkMode }: ThemeToggleProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setDarkMode(!darkMode)}
      className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full"
    >
      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      <span className="text-sm">{darkMode ? "Light" : "Dark"} Mode</span>
    </motion.button>
  );
};

export default ThemeToggle;
