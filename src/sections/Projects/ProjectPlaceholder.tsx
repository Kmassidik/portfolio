import type { Project } from "../../data/projects";

/** Styled placeholder shown when a project has no screenshot yet. */
const ProjectPlaceholder = ({ project }: { project: Project }) => {
  const initials = project.name
    .split(/[\s\-_]/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#c15f3c]/5 px-4">
      <span
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c15f3c]/15 text-lg font-bold text-[#c15f3c]"
        aria-hidden="true"
      >
        {initials}
      </span>
      <div className="flex flex-wrap justify-center gap-1.5">
        {project.tech.slice(0, 4).map((t) => (
          <span
            key={t}
            className="rounded-full bg-[#c15f3c]/10 px-2 py-0.5 text-[10px] font-medium text-[#c15f3c]/80"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProjectPlaceholder;
