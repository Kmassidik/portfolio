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
      key="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`max-w-4xl mx-auto ${
        darkMode ? "text-gray-200" : "text-gray-800"
      }`}
    >
      {blogPosts.map((post) => (
        <motion.div
          key={post.id}
          onClick={() => setSelectedPost(post)}
          className="cursor-pointer mb-6 group p-4 border-l-4 border-l-orange-500 relative"
        >
          <div className="flex justify-between items-baseline pb-2">
            <span className="text-2xl font-bold">{post.year}</span>
          </div>
          <h3
            className={`text-lg mt-2 transition-all duration-300 ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            <span className="flex justify-between pb-2">
              {/* Content */}
              <span>{post.title}</span>
              <span
                className={`text-sm ${
                  darkMode ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {post.date}
              </span>
            </span>
          </h3>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Blog;
