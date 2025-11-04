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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredProjects = useMemo(
    () =>
      projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, projects]
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to page 1 when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <motion.div
      key="showcase"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`max-w-8xl mx-auto ${
        darkMode ? "text-gray-200" : "text-gray-800"
      }`}
    >
      {/* Header Section */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8">
          Showcase
        </h2>

        <div className="flex items-center gap-3">
          <p
            className={`text-xs md:text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Explore {projects.length} projects built with passion and expertise
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all duration-300 border ${
                  currentPage === 1
                    ? darkMode
                      ? "text-gray-600 border-gray-700 cursor-not-allowed"
                      : "text-gray-400 border-gray-200 cursor-not-allowed"
                    : darkMode
                    ? "text-[#c15f3c] border-gray-700 hover:bg-[#c15f3c]/10"
                    : "text-[#c15f3c] border-gray-200 hover:bg-[#c15f3c]/10"
                }`}
                aria-label="Previous page"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span
                className={`text-sm font-medium min-w-[60px] text-center ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all duration-300 border ${
                  currentPage === totalPages
                    ? darkMode
                      ? "text-gray-600 border-gray-700 cursor-not-allowed"
                      : "text-gray-400 border-gray-200 cursor-not-allowed"
                    : darkMode
                    ? "text-[#c15f3c] border-gray-700 hover:bg-[#c15f3c]/10"
                    : "text-[#c15f3c] border-gray-200 hover:bg-[#c15f3c]/10"
                }`}
                aria-label="Next page"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full px-5 py-3 pl-12 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#c15f3c] ${
              darkMode
                ? "bg-[#1e1e1d] text-gray-200 border border-gray-700"
                : "bg-white border border-gray-200 text-gray-800 placeholder-gray-400"
            }`}
          />
          <svg
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Results Count */}
      {search && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mb-4 text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Found {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
        </motion.p>
      )}

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            onClick={() => setSelectedProject(project)}
            className={`group relative p-6 rounded-xl cursor-pointer overflow-hidden transition-all duration-300 border ${
              darkMode
                ? "bg-[#1e1e1d] border-gray-700/50 hover:border-[#c15f3c]/50 hover:bg-gray-800/50"
                : "bg-white/50 border-gray-200 hover:border-[#c15f3c] hover:bg-white shadow-sm hover:shadow-lg"
            }`}
          >
            {/* Orange accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#c15f3c] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

            {/* Project Number Badge */}
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#c15f3c]/10 flex items-center justify-center group-hover:bg-[#c15f3c]/20 transition-colors duration-300">
              <span className="text-xs font-bold text-[#c15f3c]">
                #{String(startIndex + index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col h-full">
              <h3
                className={`text-xl font-bold mb-3 pr-10 line-clamp-2 transition-colors duration-300 ${
                  darkMode
                    ? "text-gray-100 group-hover:text-white"
                    : "text-gray-900 group-hover:text-black"
                }`}
              >
                {project.name}
              </h3>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.slice(0, 2).map((tech) => (
                  <span
                    key={tech}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 text-[#c15f3c] border border-[#c15f3c]/30 group-hover:bg-[#c15f3c]/20 group-hover:border-[#c15f3c]`}
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 2 && (
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-700 text-gray-400 group-hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }`}
                  >
                    +{project.tech.length - 2}
                  </span>
                )}
              </div>

              {/* Hover Arrow */}
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#c15f3c]">
                <span>View details</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-16 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-medium mb-1">No projects found</p>
          <p className="text-sm">Try adjusting your search terms</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Showcase;
