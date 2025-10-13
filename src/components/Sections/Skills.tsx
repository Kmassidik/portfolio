import { motion } from "framer-motion";

interface SkillsProps {
  darkMode: boolean;
  skills: Record<string, string[]>;
}

const Skills = ({ darkMode, skills }: SkillsProps) => {
  return (
    <motion.div
      key="skills"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2
        className={`text-4xl font-bold mb-8 ${
          darkMode ? "text-gray-200" : "text-[#213555]"
        }`}
      >
        Skills & Technologies
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(skills).map(([category, items]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-md p-6`}
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                darkMode ? "text-gray-200" : "text-[#213555]"
              }`}
            >
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <motion.span
                  key={skill}
                  whileHover={{ scale: 1.1 }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    darkMode
                      ? "bg-gray-700 text-gray-200"
                      : "bg-[#D8C4B6] text-[#213555]"
                  }`}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Skills;
