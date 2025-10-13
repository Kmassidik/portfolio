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
      className={`max-w-4xl ${darkMode ? "text-gray-200" : "text-[#213555]"}`}
    >
      <h2 className="text-4xl font-bold mb-6">About Me</h2>

      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-md p-8 mb-8`}
      >
        <p className="text-lg leading-relaxed mb-6">
          Passionate Software Engineer with a unique background in electrical
          engineering and customer-facing technical roles, providing a solid
          foundation for system design and complex problem-solving...
        </p>
        <p className="text-lg leading-relaxed">
          Proven ability to enhance system efficiency, reliability, and workflow
          through strategic technology selection and architectural design...
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Highlights and Quick Facts sections */}
        {/* ... rest of the About section content */}
      </div>
    </motion.div>
  );
};

export default About;
