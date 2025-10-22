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
          className="cursor-pointer mb-6 group"
        >
          <div className="flex justify-between items-baseline pb-2">
            <span className="text-2xl font-bold">{post.year}</span>
          </div>
          <h3
            className={`text-lg mt-2 transition-all duration-300  ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            <span className="flex justify-between pb-2 relative">
              {/* Content */}
              <span className="relative z-10">{post.title}</span>
              <span
                className={`text-sm relative z-10 ${
                  darkMode ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {post.date}
              </span>

              {/* Animated border bottom */}
              <span
                className={`absolute bottom-0 left-0 w-full h-1 ${
                  darkMode ? "bg-orange-500" : "bg-slate-300"
                } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
              />
            </span>
          </h3>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Blog;
