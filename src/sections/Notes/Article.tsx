import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost, formatDate } from "../../lib/posts";

interface ArticleProps {
  darkMode: boolean;
}

const Article = ({ darkMode }: ArticleProps) => {
  const { slug } = useParams();
  const post = getPost(slug);
  const { scrollYProgress } = useScroll();
  const muted = darkMode ? "text-gray-400" : "text-gray-500";

  // Effect on purpose: the tab title lives outside React, and it has to be put
  // back when you navigate away. Nothing but a click causes it, but the restore
  // needs a cleanup function, which only an effect gives us.
  useEffect(() => {
    if (!post) return;
    const previous = document.title;
    document.title = `${post.title} — Kurnia Massidik`;
    return () => {
      document.title = previous;
    };
  }, [post]);

  if (!post) {
    return (
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold">Note not found</h1>
        <p className={`mt-2 text-sm ${muted}`}>
          That note doesn't exist, or the link is out of date.
        </p>
        <Link
          to="/notes"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#c15f3c] hover:underline"
        >
          <ArrowLeft size={16} />
          All notes
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[680px]">
      {/* Reading progress */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-[#c15f3c]"
        aria-hidden="true"
      />

      <Link
        to="/notes"
        className={`inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#c15f3c] ${muted}`}
      >
        <ArrowLeft size={16} />
        All notes
      </Link>

      <h1 className="mt-8 text-3xl font-bold leading-tight tracking-tight md:text-[2.6rem]">
        {post.title}
      </h1>

      <div
        className={`mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${muted}`}
      >
        <span>{formatDate(post.date)}</span>
        <span aria-hidden="true">·</span>
        <span>{post.readingMinutes} min read</span>
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#c15f3c]/30 px-2 py-0.5 text-xs text-[#c15f3c]"
          >
            {tag}
          </span>
        ))}
      </div>

      {post.cover && (
        <img
          src={post.cover}
          alt=""
          className="mt-8 w-full rounded-lg object-cover"
        />
      )}

      <article className="article mt-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
      </article>
    </div>
  );
};

export default Article;
