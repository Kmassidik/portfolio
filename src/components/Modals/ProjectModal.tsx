import { motion } from "framer-motion";
import { X, Github, ExternalLink } from "lucide-react";
import type { Project } from "../../types";

interface ProjectModalProps {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  darkMode: boolean;
}

const ProjectModal = ({
  selectedProject,
  setSelectedProject,
  darkMode,
}: ProjectModalProps) => {
  if (!selectedProject) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={() => setSelectedProject(null)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative`}
      >
        <button
          onClick={() => setSelectedProject(null)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X
            size={24}
            className={darkMode ? "text-gray-200" : "text-[#213555]"}
          />
        </button>

        <h2
          className={`text-3xl font-bold mb-4 ${
            darkMode ? "text-gray-200" : "text-[#213555]"
          }`}
        >
          {selectedProject.name}
        </h2>

        <p
          className={`text-lg mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {selectedProject.description}
        </p>

        <div className="mb-6">
          <h3
            className={`text-xl font-bold mb-3 ${
              darkMode ? "text-gray-200" : "text-[#213555]"
            }`}
          >
            Technologies Used
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedProject.tech.map((tech) => (
              <span
                key={tech}
                className={`px-3 py-1 rounded-full ${
                  darkMode
                    ? "bg-gray-700 text-gray-200"
                    : "bg-[#D8C4B6] text-[#213555]"
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          {selectedProject.github && (
            <a
              href={selectedProject.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-[#213555] hover:bg-[#3E5879]"
              } text-white transition-colors`}
            >
              <Github size={20} />
              View Code
            </a>
          )}
          {selectedProject.demo && (
            <a
              href={selectedProject.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-[#3E5879] hover:bg-[#213555]"
              } text-white transition-colors`}
            >
              <ExternalLink size={20} />
              Live Demo
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;
