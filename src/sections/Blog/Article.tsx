import { Link, useParams } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import type { ReactElement } from "react";
import type { Components } from "react-markdown";
import DockerMultiStage from "./DockerMultiStage";
import K8sDiagram from "./K8sDiagram";
import K8sHowItWorks from "./K8sHowItWorks";
import CicdDiagram from "./CicdDiagram";
import WordpressSetup from "./WordpressSetup";
import DataCenterRack from "./DataCenterRack";
import DataCenterTiers from "./DataCenterTiers";
import DataCenterCooling from "./DataCenterCooling";
import DataCenterPower from "./DataCenterPower";
import DependencyTree from "./DependencyTree";
import RadioBridge from "./RadioBridge";
import BandWavelengths from "./BandWavelengths";
import { getPost, formatDate } from "../../lib/posts";

// Render diagrams referenced from markdown as inline React SVGs so they follow
// the site theme (currentColor); everything else stays a normal image.
const diagrams: Record<string, () => ReactElement> = {
  "/blog/docker-multistage.svg": DockerMultiStage,
  "/blog/k3s-architecture.svg": K8sDiagram,
  "/blog/how-kubernetes-works.svg": K8sHowItWorks,
  "/blog/cicd-pipeline.svg": CicdDiagram,
  "/blog/wordpress-setup.svg": WordpressSetup,
  "/blog/data-center-rack.svg": DataCenterRack,
  "/blog/data-center-tiers.svg": DataCenterTiers,
  "/blog/data-center-cooling.svg": DataCenterCooling,
  "/blog/data-center-power.svg": DataCenterPower,
  "/blog/dependency-tree.svg": DependencyTree,
  "/blog/radio-bridge.svg": RadioBridge,
  "/blog/band-wavelengths.svg": BandWavelengths,
};

const markdownComponents: Components = {
  img(props) {
    const Diagram = props.src ? diagrams[props.src] : undefined;
    if (Diagram) return <Diagram />;
    return <img src={props.src} alt={props.alt ?? ""} loading="lazy" />;
  },
};

interface ArticleProps {
  darkMode: boolean;
}

const Article = ({ darkMode }: ArticleProps) => {
  const { slug } = useParams();
  const post = getPost(slug);
  const { scrollYProgress } = useScroll();
  const muted = darkMode ? "text-gray-400" : "text-gray-500";

  // The tab title and head tags are handled centrally by <RouteSeo>, which
  // reacts to the route (including this post's slug) from one meta source.

  if (!post) {
    return (
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className={`mt-2 text-sm ${muted}`}>
          That post doesn't exist, or the link is out of date.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#c15f3c] hover:underline"
        >
          <ArrowLeft size={16} />
          All posts
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
        to="/blog"
        className={`inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#c15f3c] ${muted}`}
      >
        <ArrowLeft size={16} />
        All posts
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
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
          components={markdownComponents}
        >
          {post.body}
        </ReactMarkdown>
      </article>
    </div>
  );
};

export default Article;
