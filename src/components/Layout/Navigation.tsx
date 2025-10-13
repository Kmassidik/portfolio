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
    <nav className={`${darkMode ? "bg-[#1a1a1a]" : "bg-slate-50"}`}>
      <div className="flex items-center justify-center gap-6 border-b border-b-gray-200 dark:border-b-[#494949] overflow-x-auto p-2">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() =>
              setActiveSection(section.toLowerCase().replace(" ", ""))
            }
            className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap ${
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
                className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"
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
