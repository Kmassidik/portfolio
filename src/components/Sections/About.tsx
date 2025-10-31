import { motion } from "framer-motion";

interface AboutProps {
  darkMode: boolean;
}

const techStack = [
  {
    name: "JavaScript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "TypeScript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "Node.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "React",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Vue.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  },
  {
    name: "Svelte",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
  },
  {
    name: "Go",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  },
  {
    name: "Python",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "PostgreSQL",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "MongoDB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "Redis",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  },
  {
    name: "Docker",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "Kubernetes",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
  },
];

const About = ({ darkMode }: AboutProps) => {
  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`max-w-5xl mx-auto ${
        darkMode ? "text-gray-200" : "text-gray-800"
      }`}
    >
      {/* Header */}
      <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8">About Me</h2>

      {/* Main Content with floating cat */}
      <div
        className={`${
          darkMode ? "bg-[#1e1e1d]" : "bg-white/50"
        } rounded-lg p-5 md:p-8 mb-4 md:mb-8 border ${
          darkMode ? "border-gray-700/50" : "border-gray-200/50"
        }`}
      >
        <img
          src="https://media.tenor.com/y2JXkY1pXkwAAAAM/time-to-dev-cat.gif"
          alt="Coding cat"
          className="dev-cat"
        />

        <p className="text-sm md:text-xl leading-relaxed mb-2 md:mb-4">
          Hi! I'm <strong>Kurnia Massidik</strong>, a Software Engineer based in
          Jakarta, Indonesia.
        </p>

        <p className="text-xs md:text-lg leading-relaxed mb-3 md:mb-6">
          I'm a passionate software engineer with a unique background in
          electrical engineering and hands-on technical experience. My journey
          from maintaining ATM systems at Hitachi Omron to architecting cloud
          infrastructure has given me a deep understanding of both hardware
          reliability and software scalability.
        </p>

        <p className="text-xs md:text-lg leading-relaxed mb-3 md:mb-6">
          After transitioning into software development through intensive
          bootcamps, I rapidly advanced to an Application Architect role where I
          enhanced system efficiency and reduced deployment onboarding time.
          Currently, I'm working as a freelance Software Engineer, owning
          end-to-end development from concept to deployment.
        </p>
      </div>

      <div
        className={`${
          darkMode ? "bg-[#1e1e1d]" : "bg-white"
        } rounded-lg p-4 md:p-6 border ${
          darkMode ? "border-gray-700/50" : "border-gray-200/50"
        }`}
      >
        <p
          className={`text-xs md:text-sm mb-4 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <strong>Current Tech Stack</strong>
        </p>

        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-4 place-items-center">
          {techStack.map(({ name, logo }) => (
            <motion.div
              key={name}
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              title={name}
              className="flex flex-col items-center gap-1 text-center"
            >
              <img
                src={logo}
                alt={name}
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />
              <span className="text-[10px] md:text-xs opacity-70">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default About;
