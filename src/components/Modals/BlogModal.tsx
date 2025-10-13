import { motion } from "framer-motion";
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={() => setSelectedPost(null)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative`}
      >
        <button
          onClick={() => setSelectedPost(null)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X
            size={24}
            className={darkMode ? "text-gray-200" : "text-[#213555]"}
          />
        </button>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-gray-200" : "text-[#213555]"
              }`}
            >
              {selectedPost.title}
            </h2>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {selectedPost.date}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {selectedPost.tags.map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2 py-1 rounded ${
                darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-[#D8C4B6] text-[#213555]"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className={`prose prose-lg ${
            darkMode ? "prose-invert" : ""
          } max-w-none`}
        >
          {selectedPost.content.split("\n").map((line, idx) => {
            if (line.startsWith("# ")) {
              return (
                <h1
                  key={idx}
                  className={`text-3xl font-bold mt-8 mb-4 ${
                    darkMode ? "text-gray-200" : "text-[#213555]"
                  }`}
                >
                  {line.replace("# ", "")}
                </h1>
              );
            } else if (line.startsWith("## ")) {
              return (
                <h2
                  key={idx}
                  className={`text-2xl font-bold mt-6 mb-3 ${
                    darkMode ? "text-gray-200" : "text-[#213555]"
                  }`}
                >
                  {line.replace("## ", "")}
                </h2>
              );
            } else if (line.startsWith("- **")) {
              const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
              if (match) {
                return (
                  <li key={idx} className="ml-4 mb-2">
                    <strong
                      className={darkMode ? "text-gray-200" : "text-[#213555]"}
                    >
                      {match[1]}
                    </strong>
                    : {match[2]}
                  </li>
                );
              }
            } else if (line.startsWith("- ")) {
              return (
                <li key={idx} className="ml-4 mb-2">
                  {line.replace("- ", "")}
                </li>
              );
            } else if (line.trim() !== "") {
              return (
                <p
                  key={idx}
                  className={`mb-4 leading-relaxed ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {line}
                </p>
              );
            }
            return null;
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BlogModal;
