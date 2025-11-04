import { motion } from "framer-motion";

interface HobbyProps {
  darkMode: boolean;
}

const Hobby = ({ darkMode }: HobbyProps) => {
  return (
    <motion.div
      key="hobby"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`max-w-5xl mx-auto ${
        darkMode ? "text-gray-200" : "text-gray-800"
      }`}
    >
      {/* Header */}
      <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8">
        Hobbies & Interests
      </h2>

      {/* Spotify Playlist Section */}
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
          <strong>Let's Sing My Playlist</strong>
        </p>

        <div className="w-full">
          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/1y2ZZk1Fn0bRzk017HfqBN?utm_source=generator"
            width="100%"
            height="352"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="border-0"
          ></iframe>
        </div>
      </div>
    </motion.div>
  );
};

export default Hobby;
