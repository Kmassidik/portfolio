import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { BlogPost } from "../../types";

interface BlogModalProps {
  selectedPost: BlogPost | null;
  setSelectedPost: (post: BlogPost | null) => void;
  darkMode: boolean;
}

const BlogModal = ({
  selectedPost,
  setSelectedPost,
  darkMode,
}: BlogModalProps) => {
  if (!selectedPost) return null;

  // --- Markdown Parser (same as Showcase) ---
  const parseMarkdown = (text: string): string => {
    let html = text.trim();

    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="markdown-img" />'
    );
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
          inList = false;
          listItems = [];
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

  const descriptionHTML = parseMarkdown(selectedPost.content);

  const styles = {
    linkColor: darkMode ? "#60A5FA" : "#2563EB",
    linkHover: darkMode ? "#93C5FD" : "#1D4ED8",
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm"
        onClick={() => setSelectedPost(null)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative rounded-2xl p-4 sm:p-6 md:p-8 max-w-4xl w-full overflow-y-auto max-h-[90vh] shadow-2xl border transition-colors ${
            darkMode
              ? "bg-[#1e1e1d] text-gray-200 border-gray-700/50"
              : "bg-white text-gray-800 border-gray-200/50"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedPost(null)}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
              darkMode
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>

          {/* Header */}
          <div
            className={`flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 pb-3 border-b ${
              darkMode ? "border-gray-700/50" : "border-gray-200/50"
            }`}
          >
            <div>
              <h2
                className={`text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {selectedPost.title}
              </h2>
              <p
                className={`text-xs sm:text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {selectedPost.date}
              </p>
            </div>
          </div>

          {/* Markdown Content */}
          <div
            className="markdown-content text-[0.9rem] sm:text-[1rem] md:text-[1.05rem]"
            dangerouslySetInnerHTML={{ __html: descriptionHTML }}
          />

          {/* Markdown Styles */}
          <style>{`
            .markdown-content {
              line-height: 1.8;
            }

            .markdown-img {
              border-radius: 0.75rem;
              width: 100%;
              margin: 1.25rem 0;
              object-fit: cover;
              max-height: 300px;
            }

            @media (min-width: 640px) {
              .markdown-img {
                max-height: 350px;
              }
            }

            .markdown-link {
              color: ${styles.linkColor};
              border-bottom: 1px solid ${styles.linkColor};
              text-decoration: none;
              transition: all 0.2s;
              font-weight: 500;
            }
            .markdown-link:hover {
              color: ${styles.linkHover};
              border-bottom-color: ${styles.linkHover};
            }

            .markdown-h1 {
              font-size: 1.5rem;
              font-weight: 700;
              margin: 1.5rem 0 1rem 0;
            }

            @media (min-width: 640px) {
              .markdown-h1 {
                font-size: 2rem;
              }
            }

            .markdown-h2 {
              font-size: 1.25rem;
              font-weight: 600;
              margin: 1.25rem 0 0.875rem 0;
              border-bottom: 1px solid ${darkMode ? "#3F3F46" : "#E5E7EB"};
            }

            @media (min-width: 640px) {
              .markdown-h2 {
                font-size: 1.5rem;
              }
            }

            .markdown-h3 {
              font-size: 1.125rem;
              font-weight: 600;
              margin: 1rem 0 0.625rem 0;
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
              font-size: 0.85em;
            }

            .markdown-ul {
              margin: 1rem 0;
              list-style: none;
              padding-left: 0;
            }

            .markdown-li {
              margin: 0.625rem 0;
              padding-left: 1.5rem;
              position: relative;
            }

            .markdown-li:before {
              content: "•";
              position: absolute;
              left: 0.25rem;
              color: ${styles.listMarker};
              font-weight: bold;
              font-size: 1.1em;
            }

            .markdown-p {
              margin: 0.75rem 0;
              line-height: 1.8;
            }

            @media (min-width: 640px) {
              .markdown-p {
                margin: 0.875rem 0;
              }
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogModal;
