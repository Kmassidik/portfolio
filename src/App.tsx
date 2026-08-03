import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useDarkMode } from "./hooks/useDarkMode";
import FloatingNav from "./components/FloatingNav";
import { About, Experience, Projects, NotesList } from "./sections";

// react-markdown only loads when someone actually opens a note.
const Article = lazy(() => import("./sections/Notes/Article"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  // Block body on purpose: a concise arrow would return scrollTo's value,
  // which React would then treat as a cleanup function.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const { darkMode, setDarkMode } = useDarkMode();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
        transition: { duration: 0.25 },
      };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#262624] text-white" : "bg-white text-gray-800"
      } transition-colors duration-300`}
    >
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          {...fade}
          className="mx-auto flex w-full max-w-3xl justify-center px-6 pt-16 pb-32"
        >
          <Suspense fallback={null}>
            <Routes location={location}>
              <Route path="/" element={<About darkMode={darkMode} />} />
              <Route
                path="/experience"
                element={<Experience darkMode={darkMode} />}
              />
              <Route
                path="/projects"
                element={<Projects darkMode={darkMode} />}
              />
              <Route path="/notes" element={<NotesList darkMode={darkMode} />} />
              <Route
                path="/notes/:slug"
                element={<Article darkMode={darkMode} />}
              />
              <Route path="*" element={<About darkMode={darkMode} />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>

      <FloatingNav darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

export default App;
