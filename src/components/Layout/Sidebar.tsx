import { motion } from "framer-motion";
import {
  ChevronDown,
  FileUserIcon,
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
        min-h-screen md:h-auto 
        ${bgColor} ${textColor} 
        p-8 flex flex-col items-center justify-center
        transition-colors duration-300 ease-in-out
        overflow-y-auto md:overflow-visible
      `}
    >
      <div className="w-full max-w-sm mx-auto md:mx-0">
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
        <div className="text-center md:text-justify">
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
          {[
            {
              href: "https://github.com/kmassidik",
              icon: <Github size={20} />,
            },
            {
              href: "https://www.linkedin.com/in/kurnia-massidik-3b176b149/",
              icon: <Linkedin size={20} />,
            },
            {
              href: "https://x.com/KMassidik",
              icon: <Twitter size={20} />,
            },
            {
              href: "https://drive.google.com/file/d/1UoH16iPNAdU0RzlaIk0m6h-Lb3kfvm9p/view?usp=drive_link",
              icon: <FileUserIcon size={20} />,
            },
          ].map(({ href, icon }, idx) => (
            <motion.a
              key={idx}
              whileHover={{ scale: 1.2 }}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${subTextColor} ${
                darkMode ? "hover:text-white" : "hover:text-gray-900"
              } transition-colors duration-300`}
            >
              {icon}
            </motion.a>
          ))}
        </div>

        {/* Theme toggle */}
        <div className="flex justify-center md:justify-start">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </div>
      {/* Bouncing “scroll down” text */}
      <div className="flex items-center justify-center mt-28 md:mt-0 md:hidden">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <ChevronDown
            size={16}
            className={`${subTextColor} animate-pulse transition-colors`}
          />
          <span className={`${subTextColor} font-semibold tracking-wide`}>
            Scroll Down
          </span>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
