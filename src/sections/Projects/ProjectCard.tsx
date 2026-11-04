import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
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

const MAX_PILLS = 3;

interface ProjectCardProps {
  project: Project;
  index: number;
  darkMode: boolean;
  onClick: () => void;
}

const ProjectCard = ({ project, index, darkMode, onClick }: ProjectCardProps) => {
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const body = darkMode ? "text-gray-300" : "text-gray-600";
  const card = darkMode
    ? "border-white/10 bg-[#1e1e1d] hover:border-white/20"
    : "border-black/8 bg-white hover:border-black/20";

  const extraTech = project.tech.length - MAX_PILLS;

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      aria-label={`View details for ${project.name}`}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-2xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c15f3c] ${card}`}
    >
      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold leading-snug transition-colors group-hover:text-[#c15f3c]">
              {project.name}
            </h2>
            {project.status && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClass(project.status)}`}>
                {STATUS_LABEL[project.status]}
              </span>
            )}
          </div>
          {project.date && (
            <span className={`shrink-0 text-xs ${muted}`}>{project.date}</span>
          )}
        </div>

        <p className={`line-clamp-2 text-xs leading-relaxed ${body}`}>
          {project.blurb}
        </p>

        {/* Bottom row: tech pills + links */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, MAX_PILLS).map((t) => (
              <span
                key={t}
                className="rounded-full border border-[#c15f3c]/25 px-2 py-0.5 text-[10px] font-medium text-[#c15f3c]"
              >
                {t}
              </span>
            ))}
            {extraTech > 0 && (
              <span className={`px-1 text-[10px] ${muted}`}>+{extraTech}</span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2" onClick={stopProp}>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${project.name}`}
                className={`transition-colors hover:text-[#c15f3c] ${muted}`}
              >
                <ArrowUpRight size={15} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Source for ${project.name}`}
                className={`transition-colors hover:text-[#c15f3c] ${muted}`}
              >
                <Github size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
