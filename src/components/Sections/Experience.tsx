import { motion } from "framer-motion";
import type { Experience } from "../../types";

interface ExperienceProps {
  darkMode: boolean;
  experience: Experience[];
}

const ExperienceSection = ({ darkMode, experience }: ExperienceProps) => {
  return (
    <motion.div
      key="experience"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2
        className={`text-4xl font-bold mb-8 ${
          darkMode ? "text-gray-200" : "text-[#213555]"
        }`}
      >
        Experience
      </h2>

      <div className="space-y-6">
        {experience.map((exp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-md p-6`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3
                  className={`text-xl font-bold ${
                    darkMode ? "text-gray-200" : "text-[#213555]"
                  }`}
                >
                  {exp.title}
                </h3>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {exp.company}
                </p>
              </div>
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {exp.period}
              </span>
            </div>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {exp.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExperienceSection;
