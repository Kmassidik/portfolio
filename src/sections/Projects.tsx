import { useState } from "react";
import { featured, selfProjects, earlier } from "../data/projects";
import type { Project } from "../data/projects";
import ProjectCard from "./Projects/ProjectCard";
import ProjectModal from "./Projects/ProjectModal";

interface ProjectsProps {
  darkMode: boolean;
}

const Projects = ({ darkMode }: ProjectsProps) => {
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const divider = darkMode ? "border-white/10" : "border-black/8";
  const [active, setActive] = useState<Project | null>(null);

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

      {/* Client / work projects */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {featured.map((project, i) => (
          <ProjectCard
            key={project.name}
            project={project}
            index={i}
            darkMode={darkMode}
            onClick={() => setActive(project)}
          />
        ))}
      </div>

      {/* Self / personal projects */}
      <section className={`mt-12 border-t pt-8 ${divider}`}>
        <h2 className={`mb-6 text-xs font-semibold uppercase tracking-wider ${muted}`}>
          Self-hosted &amp; personal
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {selfProjects.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i}
              darkMode={darkMode}
              onClick={() => setActive(project)}
            />
          ))}
        </div>
      </section>

      {/* Earlier work */}
      <section className={`mt-12 border-t pt-8 ${divider}`}>
        <h2 className={`mb-6 text-xs font-semibold uppercase tracking-wider ${muted}`}>
          Earlier work
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {earlier.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i}
              darkMode={darkMode}
              onClick={() => setActive(project)}
            />
          ))}
        </div>
      </section>

      {/* Modal */}
      <ProjectModal
        project={active}
        darkMode={darkMode}
        onClose={() => setActive(null)}
      />
    </div>
  );
};

export default Projects;
