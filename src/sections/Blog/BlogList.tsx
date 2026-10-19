import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Rss } from "lucide-react";
import { posts, formatDate } from "../../lib/posts";

interface BlogListProps {
  darkMode: boolean;
}

const POSTS_PER_PAGE = 5;

const BlogList = ({ darkMode }: BlogListProps) => {
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const divider = darkMode ? "border-white/10" : "border-black/10";

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const [page, setPage] = useState(1);
  const start = (page - 1) * POSTS_PER_PAGE;
  const visible = posts.slice(start, start + POSTS_PER_PAGE);

  const goTo = (next: number) => {
    setPage(Math.min(totalPages, Math.max(1, next)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-2xl">
      <header className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Blog</h1>
      </header>

      {posts.length === 0 ? (
        <p className={`mt-12 text-sm ${muted}`}>
          No posts yet. Add a markdown file to <code>src/content/</code> and it
          shows up here.
        </p>
      ) : (
        <ul className="mt-4">
          {visible.map((post, index) => (
            <motion.li
              key={`${page}-${post.slug}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-b ${divider}`}
            >
              <Link
                to={`/blog/${post.slug}`}
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

      {totalPages > 1 && (
        <nav
          aria-label="Blog pagination"
          className={`mt-8 flex items-center justify-between text-sm ${muted}`}
        >
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            className="inline-flex items-center gap-1 font-medium transition-colors hover:text-[#c15f3c] disabled:pointer-events-none disabled:opacity-0"
          >
            <ChevronLeft size={16} />
            Newer
          </button>

          <span>
            Page {page} <span className="opacity-50">of {totalPages}</span>
          </span>

          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 font-medium transition-colors hover:text-[#c15f3c] disabled:pointer-events-none disabled:opacity-0"
          >
            Older
            <ChevronRight size={16} />
          </button>
        </nav>
      )}

      <footer className="mt-20 text-center">
        <a
          href="/rss.xml"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#c15f3c] transition-opacity hover:opacity-70"
        >
          <Rss size={14} aria-hidden="true" />
          RSS feed
        </a>
        <p className={`mx-auto mt-3 max-w-sm text-xs leading-relaxed ${muted}`}>
          Notes and lessons from building things, software, systems, and the
          occasional piece of hardware.
        </p>
      </footer>
    </div>
  );
};

export default BlogList;
