import { motion } from "framer-motion";
import { Github, Linkedin, MapPin, Twitter } from "lucide-react";
import ThemeToggle from "../UI/ThemeToggle";

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const Sidebar = ({ darkMode, setDarkMode }: SidebarProps) => {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`md:w-80 ${
        darkMode ? "bg-[#1a1a1a]" : "bg-[#0f0f0f]"
      } text-white p-8 flex flex-col items-center justify-center`}
    >
      <div className="w-full max-w-xs">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-32 h-32 rounded-full mb-6 overflow-hidden border-4 border-gray-700"
        >
          <img
            src="https://avatars.githubusercontent.com/u/68921931?v=4"
            alt="Kurnia Massidik"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <h1 className="text-2xl font-bold mb-1">Kurnia Massidik</h1>
        <p className="text-gray-400 text-sm mb-4">Kmassidik · he/him</p>

        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          Switch Career from Electrical Engineer to Software Engineer in 2023,
          Teach me everything you have, glad to contribute more.
        </p>

        <div className="space-y-3 mb-8 w-full">
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <Github size={18} />
            <span>Kmassidik</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <MapPin size={18} />
            <span>Jakarta, Indonesia</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
            <span>@KMassidik</span>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <motion.a
            whileHover={{ scale: 1.2 }}
            href="https://github.com/kmassidik"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github size={20} />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.2 }}
            href="https://www.linkedin.com/in/kurnia-massidik-3b176b149/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Linkedin size={20} />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.2 }}
            href="https://x.com/KMassidik"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Twitter size={20} />
          </motion.a>
        </div>

        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </motion.aside>
  );
};

export default Sidebar;
