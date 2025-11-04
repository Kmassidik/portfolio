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
      className={`max-w-5xl mx-auto ${
        darkMode ? "text-gray-200" : "text-gray-800"
      }`}
    >
      {/* Header */}
      <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8">
        Blog Posts
      </h2>

      {/* Blog Posts Container */}
      <div className="rounded-lg p-4">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`cursor-pointer group p-3 md:p-4 border-l-4 border-l-[#c15f3c] ${
              darkMode ? "bg-[#1e1e1d] hover:bg-gray-800/50" : "hover:bg-white"
            } rounded-r-lg transition-all duration-300 ${
              index !== blogPosts.length - 1 ? "mb-4 md:mb-6" : ""
            }`}
          >
            {/* Year and Date Row */}
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-base md:text-2xl font-bold text-[#c15f3c]">
                {post.year}
              </span>
              <span
                className={`text-xs md:text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {post.date}
              </span>
            </div>

            {/* Title */}
            <h3
              className={`text-sm md:text-lg ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {post.title}
            </h3>
          </motion.div>
        ))}

        {blogPosts.length === 0 && (
          <p
            className={`text-center text-sm md:text-base py-8 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No blog posts yet. Stay tuned!
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Blog;
