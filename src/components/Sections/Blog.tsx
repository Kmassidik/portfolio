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
      className={`max-w-3xl mx-auto p-4 ${
        darkMode ? "text-gray-200" : "text-gray-800"
      }`}
    >
      {blogPosts.map((post) => (
        <motion.div
          key={post.id}
          onClick={() => setSelectedPost(post)}
          className="cursor-pointer mb-6 "
        >
          <div className="flex justify-between items-baseline pb-2">
            <span className="text-2xl font-bold">{post.year}</span>
          </div>
          <h3
            className={`text-lg mt-2 hover:text-2xl${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            <span className="flex justify-between border-b-2 border-b-orange-500 pb-2">
              {post.title}
              <span className="text-sm text-gray-500">{post.date}</span>
            </span>
          </h3>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Blog;
