import { motion } from "framer-motion";
import {
  Download,
  DownloadIcon,
  Github,
  Linkedin,
  MapPin,
  Twitter,
} from "lucide-react";
import ThemeToggle from "../UI/ThemeToggle";

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const Sidebar = ({ darkMode, setDarkMode }: SidebarProps) => {
  const bgColor = darkMode ? "bg-[#1a1a1a]" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-gray-800";
  const subTextColor = darkMode ? "text-gray-400" : "text-gray-500";
  const descriptionColor = darkMode ? "text-gray-300" : "text-gray-600";

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`
        md:w-80 w-full 
        h-screen md:h-auto 
        ${bgColor} ${textColor} 
        p-8 flex flex-col items-center md:items-start justify-center 
        transition-colors duration-300 ease-in-out
      `}
    >
      <div className="w-full max-w-sm">
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-36 h-36 md:w-64 md:h-64 rounded-full mb-6 overflow-hidden mx-auto md:mx-0"
        >
          <img
            src="https://avatars.githubusercontent.com/u/68921931?v=4"
            alt="Kurnia Massidik"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Text only centered on mobile */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold mb-1">Kurnia Massidik</h1>
          <p className={`${subTextColor} text-sm mb-4`}>Kmassidik · he/him</p>

          <p className={`${descriptionColor} text-sm leading-relaxed mb-6`}>
            Switch Career from Electrical Engineer to Software Engineer in 2023,
            Teach me everything you have, glad to contribute more.
          </p>
        </div>

        {/* Info section */}
        <div className={`space-y-3 mb-8 w-full text-center md:text-left`}>
          <div
            className={`flex items-center justify-center md:justify-start gap-3 ${subTextColor} text-sm`}
          >
            <Github size={18} />
            <span>Kmassidik</span>
          </div>
          <div
            className={`flex items-center justify-center md:justify-start gap-3 ${subTextColor} text-sm`}
          >
            <MapPin size={18} />
            <span>Jakarta, Indonesia</span>
          </div>
          <div
            className={`flex items-center justify-center md:justify-start gap-3 ${subTextColor} text-sm`}
          >
            <Twitter size={18} />
            <span>@KMassidik</span>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex gap-6 justify-center md:justify-start mb-8">
          <motion.a
            whileHover={{ scale: 1.2 }}
            href="https://github.com/kmassidik"
            target="_blank"
            rel="noopener noreferrer"
            className={`${subTextColor} ${
              darkMode ? "hover:text-white" : "hover:text-gray-900"
            } transition-colors duration-300`}
          >
            <Github size={20} />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.2 }}
            href="https://www.linkedin.com/in/kurnia-massidik-3b176b149/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${subTextColor} ${
              darkMode ? "hover:text-white" : "hover:text-gray-900"
            } transition-colors duration-300`}
          >
            <Linkedin size={20} />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.2 }}
            href="https://x.com/KMassidik"
            target="_blank"
            rel="noopener noreferrer"
            className={`${subTextColor} ${
              darkMode ? "hover:text-white" : "hover:text-gray-900"
            } transition-colors duration-300`}
          >
            <Twitter size={20} />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.2 }}
            href="https://x.com/KMassidik"
            target="_blank"
            rel="noopener noreferrer"
            className={`${subTextColor} ${
              darkMode ? "hover:text-white" : "hover:text-gray-900"
            } transition-colors duration-300`}
          >
            <DownloadIcon size={20} />
          </motion.a>
        </div>

        {/* Theme toggle */}
        <div className="flex justify-center md:justify-start">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
