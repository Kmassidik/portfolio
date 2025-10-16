import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../../types";

interface ProjectModalProps {
  selectedProject: Project;
  setSelectedProject: (project: Project | null) => void;
  darkMode: boolean;
}

const ProjectModal = ({
  selectedProject,
  setSelectedProject,
  darkMode,
}: ProjectModalProps) => {
  if (!selectedProject) return null;

  // Enhanced markdown parser with better handling
  const parseMarkdown = (text: string): string => {
    let html = text.trim();

    // Images: ![alt](url) - process first to avoid conflicts
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="markdown-img" />'
    );

    // Links: [text](url)
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="markdown-link">$1</a>'
    );

    // Split into lines for processing
    const lines = html.split("\n");
    const processed: string[] = [];
    let inList = false;
    let listItems: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const trimmed = line.trim();

      // Skip empty lines but close lists if needed
      if (!trimmed) {
        if (inList) {
          processed.push(`<ul class="markdown-ul">${listItems.join("")}</ul>`);
          listItems = [];
          inList = false;
        }
        processed.push("");
        continue;
      }

      // Headers
      if (trimmed.startsWith("### ")) {
        if (inList) {
          processed.push(`<ul class="markdown-ul">${listItems.join("")}</ul>`);
          listItems = [];
          inList = false;
        }
        processed.push(`<h3 class="markdown-h3">${trimmed.substring(4)}</h3>`);
        continue;
      }
      if (trimmed.startsWith("## ")) {
        if (inList) {
          processed.push(`<ul class="markdown-ul">${listItems.join("")}</ul>`);
          listItems = [];
          inList = false;
        }
        processed.push(`<h2 class="markdown-h2">${trimmed.substring(3)}</h2>`);
        continue;
      }
      if (trimmed.startsWith("# ")) {
        if (inList) {
          processed.push(`<ul class="markdown-ul">${listItems.join("")}</ul>`);
          listItems = [];
          inList = false;
        }
        processed.push(`<h1 class="markdown-h1">${trimmed.substring(2)}</h1>`);
        continue;
      }

      // List items
      if (trimmed.match(/^[-*]\s+/)) {
        const content = trimmed.substring(2);
        listItems.push(`<li class="markdown-li">${content}</li>`);
        inList = true;
        continue;
      }

      // Close list if we're in one and hit non-list content
      if (inList) {
        processed.push(`<ul class="markdown-ul">${listItems.join("")}</ul>`);
        listItems = [];
        inList = false;
      }

      // Images (already converted)
      if (trimmed.startsWith("<img")) {
        processed.push(trimmed);
        continue;
      }

      // Regular paragraph
      if (trimmed) {
        processed.push(`<p class="markdown-p">${trimmed}</p>`);
      }
    }

    // Close any remaining list
    if (inList) {
      processed.push(`<ul class="markdown-ul">${listItems.join("")}</ul>`);
    }

    html = processed.join("\n");

    // Inline formatting (after block-level processing)
    // Bold: **text**
    html = html.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="markdown-bold">$1</strong>'
    );

    // Italic: *text* (but not in middle of words or list markers)
    html = html.replace(
      /(?<!\w)\*([^*]+)\*(?!\w)/g,
      '<em class="markdown-italic">$1</em>'
    );

    // Inline code: `code`
    html = html.replace(/`([^`]+)`/g, '<code class="markdown-code">$1</code>');

    return html;
  };

  const descriptionHTML = parseMarkdown(selectedProject.description);

  const styles = {
    linkColor: darkMode ? "#60A5FA" : "#2563EB",
    linkHover: darkMode ? "#93C5FD" : "#1D4ED8",
    codeBg: darkMode ? "#1F2937" : "#F3F4F6",
    codeBorder: darkMode ? "#374151" : "#D1D5DB",
    codeText: darkMode ? "#E5E7EB" : "#374151",
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
          className={`rounded-2xl p-8 max-w-4xl w-full overflow-y-auto max-h-[90vh] shadow-2xl ${
            darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-700/50">
            <h2
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {selectedProject.name}
            </h2>
            <button
              onClick={() => setSelectedProject(null)}
              className={`text-2xl w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                darkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
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
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30"
                      : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
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
                className="px-6 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
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
                    ? "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                View Code
              </a>
            )}
          </div>

          {/* Enhanced styles for markdown elements */}
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
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            
            .markdown-link {
              color: ${styles.linkColor};
              text-decoration: none;
              border-bottom: 1px solid ${styles.linkColor};
              transition: all 0.2s;
              font-weight: 500;
            }
            .markdown-link:hover {
              color: ${styles.linkHover};
              border-bottom-color: ${styles.linkHover};
            }
            
            .markdown-h1 {
              font-size: 2rem;
              font-weight: 700;
              margin: 1.75rem 0 1rem 0;
              line-height: 1.2;
            }
            
            .markdown-h2 {
              font-size: 1.5rem;
              font-weight: 600;
              margin: 1.5rem 0 0.875rem 0;
              line-height: 1.3;
              padding-bottom: 0.375rem;
              border-bottom: 1px solid ${darkMode ? "#374151" : "#E5E7EB"};
            }
            
            .markdown-h3 {
              font-size: 1.25rem;
              font-weight: 600;
              margin: 1.25rem 0 0.625rem 0;
              line-height: 1.4;
            }
            
            .markdown-bold {
              font-weight: 600;
              color: ${darkMode ? "#F9FAFB" : "#111827"};
            }
            
            .markdown-italic {
              font-style: italic;
            }
            
            .markdown-code {
              background-color: ${styles.codeBg};
              color: ${styles.codeText};
              border: 1px solid ${styles.codeBorder};
              padding: 0.2rem 0.5rem;
              border-radius: 0.375rem;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 0.875em;
              font-weight: 400;
            }
            
            .markdown-ul {
              margin: 1rem 0;
              padding-left: 0;
              list-style: none;
            }
            
            .markdown-li {
              margin: 0.625rem 0;
              padding-left: 1.75rem;
              position: relative;
              line-height: 1.7;
            }
            
            .markdown-li:before {
              content: "•";
              position: absolute;
              left: 0.5rem;
              color: ${styles.listMarker};
              font-weight: bold;
              font-size: 1.25em;
            }
            
            .markdown-p {
              margin: 0.875rem 0;
              line-height: 1.8;
            }
            
            .markdown-p:first-child {
              margin-top: 0;
            }
            
            .markdown-p:last-child {
              margin-bottom: 0;
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal;
