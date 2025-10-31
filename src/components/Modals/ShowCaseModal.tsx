import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../../types";

interface ShowCaseProps {
  selectedProject: Project;
  setSelectedProject: (project: Project | null) => void;
  darkMode: boolean;
}

const ShowCaseModal = ({
  selectedProject,
  setSelectedProject,
  darkMode,
}: ShowCaseProps) => {
  if (!selectedProject) return null;

  const parseMarkdown = (text: string): string => {
    let html = text.trim();

    // Images
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="markdown-img" />'
    );

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="markdown-link">$1</a>'
    );

    const lines = html.split("\n");
    const processed: string[] = [];
    let inList = false;
    let listItems: string[] = [];

    for (let line of lines) {
      const trimmed = line.trim();

      if (!trimmed) {
        if (inList) {
          processed.push(`<ul class="markdown-ul">${listItems.join("")}</ul>`);
          listItems = [];
          inList = false;
        }
        processed.push("");
        continue;
      }

      if (trimmed.startsWith("### ")) {
        if (inList) {
          processed.push(`<ul class="markdown-ul">${listItems.join("")}</ul>`);
          inList = false;
          listItems = [];
        }
        processed.push(`<h3 class="markdown-h3">${trimmed.substring(4)}</h3>`);
        continue;
      }

      if (trimmed.startsWith("## ")) {
        if (inList) {
          processed.push(`<ul class="markdown-ul">${listItems.join("")}</ul>`);
          inList = false;
          listItems = [];
        }
        processed.push(`<h2 class="markdown-h2">${trimmed.substring(3)}</h2>`);
        continue;
      }

      if (trimmed.startsWith("# ")) {
        if (inList) {
          processed.push(`<ul class="markdown-ul">${listItems.join("")}</ul>`);
          inList = false;
          listItems = [];
        }
        processed.push(`<h1 class="markdown-h1">${trimmed.substring(2)}</h1>`);
        continue;
      }

      if (trimmed.match(/^[-*]\s+/)) {
        const content = trimmed.substring(2);
        listItems.push(`<li class="markdown-li">${content}</li>`);
        inList = true;
        continue;
      }

      if (inList) {
        processed.push(`<ul class="markdown-ul">${listItems.join("")}</ul>`);
        inList = false;
        listItems = [];
      }

      if (trimmed.startsWith("<img")) {
        processed.push(trimmed);
        continue;
      }

      if (trimmed) processed.push(`<p class="markdown-p">${trimmed}</p>`);
    }

    if (inList)
      processed.push(`<ul class="markdown-ul">${listItems.join("")}</ul>`);

    html = processed.join("\n");

    html = html.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="markdown-bold">$1</strong>'
    );
    html = html.replace(
      /(?<!\w)\*([^*]+)\*(?!\w)/g,
      '<em class="markdown-italic">$1</em>'
    );
    html = html.replace(/`([^`]+)`/g, '<code class="markdown-code">$1</code>');

    return html;
  };

  const descriptionHTML = parseMarkdown(selectedProject.description);

  const styles = {
    codeBg: darkMode ? "#1e1e1d" : "#F9FAFB",
    codeBorder: darkMode ? "#3F3F46" : "#E5E7EB",
    codeText: darkMode ? "#E5E7EB" : "#1F2937",
    listMarker: darkMode ? "#9CA3AF" : "#6B7280",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={() => setSelectedProject(null)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className={`rounded-2xl p-8 max-w-4xl w-full overflow-y-auto custom-scrollbar max-h-[90vh] shadow-2xl border ${
            darkMode
              ? "bg-[#1e1e1d] text-gray-200 border-gray-700/50"
              : "bg-white text-gray-800 border-gray-200/50"
          }`}
        >
          {/* Header */}
          <div
            className={`flex justify-between items-start mb-6 pb-4 border-b ${
              darkMode ? "border-gray-700/50" : "border-gray-200/50"
            }`}
          >
            <h2
              className={`text-3xl font-bold ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {selectedProject.name}
            </h2>
            <button
              onClick={() => setSelectedProject(null)}
              className={`text-2xl w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                darkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {/* Markdown Content */}
          <div
            className="markdown-content mb-8"
            dangerouslySetInnerHTML={{ __html: descriptionHTML }}
          />

          {/* Tech Stack Tags */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {selectedProject.tech.map((tech) => (
                <span
                  key={tech}
                  className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all ${
                    darkMode
                      ? "bg-white/5 text-gray-200 border border-gray-700 hover:bg-white/10"
                      : "bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {selectedProject.demo && (
              <a
                href={selectedProject.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${
                  darkMode
                    ? "bg-white/10 text-gray-200 hover:bg-white/20 border border-gray-700/50"
                    : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-200/50"
                }`}
              >
                Live Demo
              </a>
            )}
            {selectedProject.github && (
              <a
                href={selectedProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${
                  darkMode
                    ? "bg-[#1e1e1d] text-gray-200 border border-gray-700 hover:bg-gray-800"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                View Code
              </a>
            )}
          </div>

          {/* Markdown Style Overrides */}
          <style>{`
            .markdown-content {
              line-height: 1.8;
              font-size: 0.9375rem;
            }
            .markdown-img {
              border-radius: 0.75rem;
              width: 100%;
              margin: 1.5rem 0;
              object-fit: cover;
              max-height: 350px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                          0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            .markdown-link {
              color: #c15f3c;
              border-bottom: 1px solid #c15f3c;
              text-decoration: none;
              transition: all 0.2s;
              font-weight: 500;
            }
            .markdown-link:hover {
              color: #c1603cc4;
              border-bottom-color: #c1603cc4;
            }
            .markdown-h1 {
              font-size: 2rem;
              font-weight: 700;
              margin: 1.75rem 0 1rem 0;
            }
            .markdown-h2 {
              font-size: 1.5rem;
              font-weight: 600;
              margin: 1.5rem 0 0.875rem 0;
              border-bottom: 1px solid ${darkMode ? "#3F3F46" : "#E5E7EB"};
            }
            .markdown-h3 {
              font-size: 1.25rem;
              font-weight: 600;
              margin: 1.25rem 0 0.625rem 0;
            }
            .markdown-bold {
              color: ${darkMode ? "#F9FAFB" : "#111827"};
            }
            .markdown-code {
              background-color: ${styles.codeBg};
              border: 1px solid ${styles.codeBorder};
              color: ${styles.codeText};
              padding: 0.2rem 0.5rem;
              border-radius: 0.375rem;
              font-family: 'Monaco', 'Menlo', monospace;
            }
            .markdown-ul {
              margin: 1rem 0;
              list-style: none;
              padding-left: 0;
            }
            .markdown-li {
              margin: 0.625rem 0;
              padding-left: 1.75rem;
              position: relative;
            }
            .markdown-li:before {
              content: "•";
              position: absolute;
              left: 0.5rem;
              color: ${styles.listMarker};
              font-weight: bold;
              font-size: 1.25em;
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShowCaseModal;
