import { motion } from "framer-motion";

interface AboutProps {
  darkMode: boolean;
}

const About = ({ darkMode }: AboutProps) => {
  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`max-w-4xl mx-auto px-4 ${
        darkMode ? "text-gray-200" : "text-gray-800"
      }`}
    >
      {/* Header */}
      <h2 className="text-4xl font-bold mb-8">About Me</h2>

      {/* Main Content with floating cat */}
      <div
        className={`${
          darkMode ? "bg-gray-800/30" : "bg-white/50"
        } rounded-lg p-8 mb-8 border ${
          darkMode ? "border-gray-700/50" : "border-gray-200/50"
        }`}
      >
        <img
          src="https://media.tenor.com/y2JXkY1pXkwAAAAM/time-to-dev-cat.gif"
          alt="Coding cat"
          className="w-64 h-64 object-contain mx-auto mb-6 md:float-right md:ml-6 md:mb-4"
          style={{
            shapeOutside: "circle(50%)",
            clipPath: "circle(50%)", // optional, visually matches the wrap shape
          }}
        />

        <p className="text-xl leading-relaxed mb-4">
          Hi! I'm <strong>Kurnia Massidik</strong>, a Software Engineer based in
          Jakarta, Indonesia.
        </p>

        <p className="text-lg leading-relaxed mb-6">
          I'm a passionate software engineer with a unique background in
          electrical engineering and hands-on technical experience. My journey
          from maintaining ATM systems at Hitachi Omron to architecting cloud
          infrastructure has given me a deep understanding of both hardware
          reliability and software scalability.
        </p>

        <p className="text-lg leading-relaxed mb-6">
          After transitioning into software development through intensive
          bootcamps, I rapidly advanced to an Application Architect role where I
          enhanced system efficiency by 20% and reduced deployment onboarding
          time by 80%. Currently, I'm working as a freelance Software Engineer,
          owning end-to-end development from concept to deployment.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8">Background</h3>

        <p className="text-lg leading-relaxed mb-4">
          I hold a Bachelor's degree in Electrical Engineering from Telkom
          University and completed intensive Full Stack JavaScript bootcamps at
          both Binar Academy and Hacktiv8. Before software engineering, I spent
          nearly 5 years as a Customer Engineer at Hitachi Omron, where I
          achieved 99.4% system uptime and consistently met 100% of preventive
          maintenance targets.
        </p>

        <p className="text-lg leading-relaxed">
          This unique blend of electrical engineering fundamentals, hands-on
          technical operations, and modern software development gives me a
          holistic perspective on building reliable, efficient systems that
          actually work in production.
        </p>
      </div>

      {/* Tech Stack Mention */}
      <div
        className={`${
          darkMode ? "bg-gray-800/20" : "bg-gray-50"
        } rounded-lg p-6 border ${
          darkMode ? "border-gray-700/50" : "border-gray-200/50"
        }`}
      >
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          <strong>Current Tech Stack:</strong> JavaScript/TypeScript, Node.js,
          React, Vue.js, Svelte, Go, Python, PostgreSQL, MongoDB, Redis, Docker,
          Kubernetes, and more. Always learning, always building.
        </p>
      </div>
    </motion.div>
  );
};

export default About;
