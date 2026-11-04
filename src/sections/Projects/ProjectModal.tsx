import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, Github } from "lucide-react";
import type { Project } from "../../data/projects";

const STATUS_LABEL: Record<NonNullable<Project["status"]>, string> = {
  live: "Live",
  "in-production": "In production",
  "open-source": "Open source",
  "self-hosted": "Self-hosted",
  wip: "WIP",
};

const statusClass = (_s: NonNullable<Project["status"]>) =>
  "bg-[#c15f3c]/10 text-[#c15f3c]";

interface ProjectModalProps {
  project: Project | null;
  darkMode: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, darkMode, onClose }: ProjectModalProps) => {
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const body = darkMode ? "text-gray-300" : "text-gray-600";
  const bg = darkMode ? "bg-[#1a1a19]" : "bg-white";
  const border = darkMode ? "border-white/10" : "border-black/8";

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-label={project.name}
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className={`fixed inset-x-4 bottom-0 top-16 z-50 mx-auto flex max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl sm:inset-x-6 md:inset-x-auto md:left-1/2 md:w-full md:-translate-x-1/2 ${bg} ${border}`}
          >
            {/* Image — only shown when a screenshot exists */}
            {project.image ? (
              <div className="relative h-52 w-full shrink-0 overflow-hidden sm:h-64">
                <img
                  src={`/projects/${project.image}`}
                  alt={project.name}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={onClose}
                  className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-opacity hover:opacity-70 ${
                    darkMode
                      ? "border-white/15 bg-black/50 text-white"
                      : "border-black/10 bg-white/80 text-gray-800"
                  }`}
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div className="relative flex justify-end px-4 pt-4">
                <button
                  onClick={onClose}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition-opacity hover:opacity-70 ${
                    darkMode
                      ? "border-white/15 text-gray-400"
                      : "border-black/10 text-gray-500"
                  }`}
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 pt-6">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold leading-tight">
                      {project.name}
                    </h2>
                    {project.status && (
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(project.status)}`}>
                        {STATUS_LABEL[project.status]}
                      </span>
                    )}
                  </div>
                  {project.date && (
                    <p className={`mt-1 text-sm ${muted}`}>{project.date}</p>
                  )}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-2">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#c15f3c] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                    >
                      Visit <ArrowUpRight size={14} />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:text-[#c15f3c] ${border} ${muted}`}
                    >
                      <Github size={14} /> Source
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className={`mt-5 text-sm leading-relaxed ${body}`}>
                {project.detail ?? project.blurb}
              </p>

              {/* Bullet points */}
              {project.points && (
                <ul className={`mt-4 space-y-2.5 text-sm leading-relaxed ${body}`}>
                  {project.points.map((pt) => (
                    <li key={pt} className="relative pl-4">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-[#c15f3c]"
                      />
                      {pt}
                    </li>
                  ))}
                </ul>
              )}

              {/* Tech tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[#c15f3c]/30 px-2.5 py-0.5 text-xs font-medium text-[#c15f3c]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
