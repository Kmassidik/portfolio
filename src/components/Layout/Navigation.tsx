import { motion } from "framer-motion";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  darkMode: boolean;
}

const sections = ["About Me", "Showcase", "Blog"];

const Navigation = ({
  activeSection,
  setActiveSection,
  darkMode,
}: NavigationProps) => {
  return (
    <nav className="backdrop-blur-sm mt-10">
      <div className="flex items-center justify-start md:justify-center gap-4 md:gap-10 overflow-x-auto px-4 md:px-2 py-3 md:py-2 scrollbar-hide">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() =>
              setActiveSection(section.toLowerCase().replace(" ", ""))
            }
            className={`relative py-2 px-1 text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              activeSection === section.toLowerCase().replace(" ", "")
                ? darkMode
                  ? "text-white"
                  : "text-slate-900"
                : darkMode
                ? "text-gray-400 hover:text-white"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {section}
            {activeSection === section.toLowerCase().replace(" ", "") && (
              <motion.div
                layoutId="activeSection"
                className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-[#C15F3C]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
