import { motion } from "framer-motion";
import type { BlogPost } from "../../types";

interface BlogProps {
  darkMode: boolean;
  blogPosts: BlogPost[];
  setSelectedPost: (post: BlogPost | null) => void;
}

const Blog = ({ darkMode, blogPosts, setSelectedPost }: BlogProps) => {
  return (
    <motion.div
      key="blog"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`max-w-4xl mx-auto ${
        darkMode ? "text-gray-200" : "text-gray-800"
      }`}
    >
      {/* Header */}
      <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8">Showcase</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedPost(post)}
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-md p-6 cursor-pointer`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3
                className={`text-xl font-bold ${
                  darkMode ? "text-gray-200" : "text-[#213555]"
                }`}
              >
                {post.title}
              </h3>
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {post.date}
              </span>
            </div>
            <p
              className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              {post.snippet}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
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
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Blog;
