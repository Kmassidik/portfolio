import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { posts, formatDate } from "../../lib/posts";

interface NotesListProps {
  darkMode: boolean;
}

const NotesList = ({ darkMode }: NotesListProps) => {
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const divider = darkMode ? "border-white/10" : "border-black/10";

  return (
    <div className="w-full max-w-2xl">
      <header className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Notes</h1>
        <p className={`mt-2 text-sm ${muted}`}>
          Things I build, break, and read about.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className={`mt-12 text-sm ${muted}`}>
          No notes yet. Add a markdown file to <code>src/content/</code> and it
          shows up here.
        </p>
      ) : (
        <ul>
          {posts.map((post, index) => (
            <motion.li
              key={post.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-b ${divider}`}
            >
              <Link
                to={`/notes/${post.slug}`}
                className="group flex items-start gap-6 py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c15f3c]"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold leading-snug transition-colors group-hover:text-[#c15f3c] md:text-xl">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p
                      className={`mt-2 line-clamp-2 text-sm leading-relaxed ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {post.excerpt}
                    </p>
                  )}

                  <div
                    className={`mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs ${muted}`}
                  >
                    <span>{formatDate(post.date)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingMinutes} min read</span>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#c15f3c]/30 px-2 py-0.5 text-[#c15f3c]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {post.cover && (
                  <img
                    src={post.cover}
                    alt=""
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded object-cover md:h-28 md:w-28"
                  />
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotesList;
