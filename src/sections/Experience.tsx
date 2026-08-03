import { motion } from "framer-motion";
import { roles, education, certifications } from "../data/experience";

interface ExperienceProps {
  darkMode: boolean;
}

const Experience = ({ darkMode }: ExperienceProps) => {
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const body = darkMode ? "text-gray-300" : "text-gray-600";
  const rail = darkMode ? "bg-white/10" : "bg-black/10";
  const divider = darkMode ? "border-white/10" : "border-black/10";

  return (
    <div className="w-full max-w-2xl">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Experience
        </h1>
        <p className={`mt-2 text-sm ${muted}`}>
          Electrical engineering to AI systems — Sep 2018 to now.
        </p>
      </header>

      <ol className="relative">
        <span
          aria-hidden="true"
          className={`absolute left-[5px] top-2 bottom-2 w-px ${rail}`}
        />

        {roles.map((role, index) => (
          <motion.li
            key={role.company}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="relative pl-8 pb-8 last:pb-0"
          >
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 ${
                role.current
                  ? "border-[#c15f3c] bg-[#c15f3c]"
                  : darkMode
                  ? "border-white/25 bg-[#262624]"
                  : "border-black/20 bg-white"
              }`}
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-lg font-bold leading-snug">{role.title}</h2>
              <span className={`text-xs ${muted}`}>{role.period}</span>
            </div>

            <p className="mt-0.5 text-sm font-medium text-[#c15f3c]">
              {role.company}
              <span className={`font-normal ${muted}`}> · {role.location}</span>
            </p>

            {role.points && (
              <ul className={`mt-4 space-y-2.5 text-sm leading-relaxed ${body}`}>
                {role.points.map((point) => (
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
          </motion.li>
        ))}
      </ol>

      <section className={`mt-12 border-t pt-8 ${divider}`}>
        <h2 className={`mb-4 text-xs font-semibold uppercase tracking-wider ${muted}`}>
          Education
        </h2>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-bold">{education.school}</p>
          <span className={`text-xs ${muted}`}>{education.period}</span>
        </div>
        <p className={`mt-0.5 text-sm ${body}`}>
          {education.degree}
          <span className={muted}> · {education.location}</span>
        </p>
      </section>

      <section className={`mt-8 border-t pt-8 ${divider}`}>
        <h2 className={`mb-4 text-xs font-semibold uppercase tracking-wider ${muted}`}>
          Training
        </h2>
        <ul className="space-y-4">
          {certifications.map((cert) => (
            <li key={cert.org}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-sm font-bold">{cert.org}</p>
                <span className={`text-xs ${muted}`}>{cert.period}</span>
              </div>
              <p className={`mt-0.5 text-sm ${body}`}>
                {cert.name}
                <span className={muted}> · {cert.score}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Experience;
