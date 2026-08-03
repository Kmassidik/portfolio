import { motion } from "framer-motion";
import { FileUserIcon, Github, Linkedin, MapPin, Twitter } from "lucide-react";

const socials = [
  { href: "https://github.com/kmassidik", label: "GitHub", icon: Github },
  {
    href: "https://www.linkedin.com/in/kurnia-massidik-3b176b149/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  { href: "https://x.com/KMassidik", label: "X", icon: Twitter },
  {
    href: "https://drive.google.com/file/d/1UoH16iPNAdU0RzlaIk0m6h-Lb3kfvm9p/view?usp=drive_link",
    label: "Resume",
    icon: FileUserIcon,
  },
];

interface AboutProps {
  darkMode: boolean;
}

const About = ({ darkMode }: AboutProps) => {
  const subTextColor = darkMode ? "text-gray-400" : "text-gray-500";
  const descriptionColor = darkMode ? "text-gray-300" : "text-gray-600";

  return (
    <div className="flex min-h-[calc(100vh-13rem)] w-full max-w-sm flex-col items-center justify-center text-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="mb-6 h-36 w-36 overflow-hidden rounded-full md:h-52 md:w-52"
      >
        <img
          src="https://avatars.githubusercontent.com/u/68921931?v=4"
          alt="Kurnia Massidik"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <h1 className="mb-1 text-2xl font-bold">Kurnia Massidik</h1>
      <p className={`${subTextColor} mb-4 text-sm`}>Kmassidik · he/him</p>

      <p className={`${descriptionColor} mb-6 text-sm leading-relaxed`}>
        Switch Career from Electrical Engineer to Software Engineer in 2023,
        Teach me everything you have, glad to contribute more.
      </p>

      <div className="mb-8 space-y-3">
        <div
          className={`flex items-center justify-center gap-3 ${subTextColor} text-sm`}
        >
          <Github size={18} />
          <span>Kmassidik</span>
        </div>
        <div
          className={`flex items-center justify-center gap-3 ${subTextColor} text-sm`}
        >
          <MapPin size={18} />
          <span>Jakarta, Indonesia</span>
        </div>
        <div
          className={`flex items-center justify-center gap-3 ${subTextColor} text-sm`}
        >
          <Twitter size={18} />
          <span>@KMassidik</span>
        </div>
      </div>

      <div className="flex justify-center gap-6">
        {socials.map(({ href, label, icon: Icon }) => (
          <motion.a
            key={label}
            whileHover={{ scale: 1.2 }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`${subTextColor} ${
              darkMode ? "hover:text-white" : "hover:text-gray-900"
            } rounded transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c15f3c]`}
          >
            <Icon size={20} />
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default About;
