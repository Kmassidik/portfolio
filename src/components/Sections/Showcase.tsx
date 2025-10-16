import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Project } from "../../types";

interface ShowcaseProps {
  darkMode: boolean;
  projects: Project[];
  setSelectedProject: (project: Project) => void;
}

const Showcase = ({
  darkMode,
  projects,
  setSelectedProject,
}: ShowcaseProps) => {
  const [search, setSearch] = useState("");

  const filteredProjects = useMemo(
    () =>
      projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, projects]
  );

  return (
    <motion.div
      key="showcase"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`max-w-6xl mx-auto px-4 ${
        darkMode ? "text-gray-200" : "text-gray-800"
      }`}
    >
      <h2 className="text-3xl md:text-5xl font-bold mb-6">Showcase</h2>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full md:w-1/2 px-4 py-2 rounded-lg border ${
            darkMode
              ? "border-gray-600 bg-gray-800 text-gray-200 placeholder-gray-400"
              : "border-gray-300 bg-white text-gray-800 placeholder-gray-500"
          }`}
        />
      </div>

      {/* Project Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelectedProject(project)}
            className={`rounded-2xl shadow-md p-6 cursor-pointer h-40 flex flex-col justify-between ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-xl font-bold ${
                darkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              {project.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="text-xs bg-blue-500/20 px-2 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Showcase;
