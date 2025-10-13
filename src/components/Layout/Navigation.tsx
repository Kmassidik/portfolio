import { motion } from "framer-motion";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  darkMode: boolean;
}

const sections = ["About Me", "Showcase", "Skills", "Blog", "Experience"];

const Navigation = ({
  activeSection,
  setActiveSection,
  darkMode,
}: NavigationProps) => {
  return (
    <nav
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-md sticky top-0 z-10`}
    >
      <div className="flex gap-2 p-4 overflow-x-auto">
        {sections.map((section) => (
          <motion.button
            key={section}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setActiveSection(section.toLowerCase().replace(" ", ""))
            }
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeSection === section.toLowerCase().replace(" ", "")
                ? darkMode
                  ? "bg-[#3E5879] text-white"
                  : "bg-[#213555] text-white"
                : darkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-[#D8C4B6] text-[#213555]"
            }`}
          >
            {section}
          </motion.button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
