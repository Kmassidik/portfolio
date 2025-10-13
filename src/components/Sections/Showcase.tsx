import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../../types";

interface ShowcaseProps {
  darkMode: boolean;
  projects: Project[];
  setSelectedProject: (project: Project | null) => void;
  hoveredProject: string | null;
  setHoveredProject: (id: string | null) => void;
}

const Showcase = ({
  darkMode,
  projects,
  setSelectedProject,
  hoveredProject,
  setHoveredProject,
}: ShowcaseProps) => {
  return (
    <motion.div
      key="showcase"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2
        className={`text-4xl font-bold mb-8 ${
          darkMode ? "text-gray-200" : "text-[#213555]"
        }`}
      >
        Showcase
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            className="relative"
            onHoverStart={() => setHoveredProject(project.id)}
            onHoverEnd={() => setHoveredProject(null)}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedProject(project)}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-md p-6 cursor-pointer h-32 flex items-center justify-center text-center`}
            >
              <h3
                className={`text-xl font-bold ${
                  darkMode ? "text-gray-200" : "text-[#213555]"
                }`}
              >
                {project.name}
              </h3>
            </motion.div>

            <AnimatePresence>
              {hoveredProject === project.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute inset-0 ${
                    darkMode ? "bg-gray-700" : "bg-[#213555]"
                  } text-white rounded-2xl shadow-lg p-6 z-10`}
                >
                  <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                  <p className="text-sm mb-3 text-gray-300">
                    {project.description.slice(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-white/20 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Showcase;
