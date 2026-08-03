import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { featured, earlier } from "../data/projects";
import type { Project } from "../data/projects";

interface ProjectsProps {
  darkMode: boolean;
}

const Projects = ({ darkMode }: ProjectsProps) => {
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const body = darkMode ? "text-gray-300" : "text-gray-600";
  const divider = darkMode ? "border-white/10" : "border-black/10";
  const card = darkMode
    ? "border-white/10 bg-[#1e1e1d]"
    : "border-black/10 bg-white";

  const links = (project: Project) => (
    <div className="mt-4 flex flex-wrap gap-4">
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#c15f3c] hover:underline"
        >
          Visit
          <ArrowUpRight size={15} />
        </a>
      )}
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#c15f3c] ${muted}`}
        >
          <Github size={15} />
          Source
        </a>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-2xl">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Projects
        </h1>
        <p className={`mt-2 text-sm ${muted}`}>
          AI platforms in production, and the work that led there.
        </p>
      </header>

      <div className="space-y-5">
        {featured.map((project, index) => (
          <motion.article
            key={project.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={`rounded-xl border p-6 ${card}`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-lg font-bold">{project.name}</h2>
              {project.date && (
                <span className={`text-xs ${muted}`}>{project.date}</span>
              )}
            </div>

            <p className={`mt-3 text-sm leading-relaxed ${body}`}>
              {project.blurb}
            </p>

            {project.points && (
              <ul className={`mt-4 space-y-2 text-sm leading-relaxed ${body}`}>
                {project.points.map((point) => (
                  <li key={point} className="relative pl-4">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[0.55em] h-1 w-1 rounded-full bg-[#c15f3c]"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[#c15f3c]/30 px-2.5 py-0.5 text-xs font-medium text-[#c15f3c]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {links(project)}
          </motion.article>
        ))}
      </div>

      <section className={`mt-12 border-t pt-8 ${divider}`}>
        <h2
          className={`mb-6 text-xs font-semibold uppercase tracking-wider ${muted}`}
        >
          Earlier work
        </h2>

        <ul className="space-y-8">
          {earlier.map((project) => (
            <li key={project.name}>
              <h3 className="font-bold">{project.name}</h3>
              <p className={`mt-1.5 text-sm leading-relaxed ${body}`}>
                {project.blurb}
              </p>
              <div className={`mt-2 text-xs ${muted}`}>
                {project.tech.join(" · ")}
              </div>
              {links(project)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Projects;
