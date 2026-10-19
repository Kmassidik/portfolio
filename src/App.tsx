import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useDarkMode } from "./hooks/useDarkMode";
import FloatingNav from "./components/FloatingNav";
import RouteSeo from "./components/RouteSeo";
import { About, Experience, Projects, BlogList } from "./sections";

// react-markdown only loads when someone actually opens a post.
const Article = lazy(() => import("./sections/Blog/Article"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  // Block body on purpose: a concise arrow would return scrollTo's value,
  // which React would then treat as a cleanup function.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// The section was renamed /notes → /blog; keep old links working.
const NoteRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug}`} replace />;
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
    <div className="app-shell min-h-screen transition-colors duration-300">
      <ScrollToTop />
      <RouteSeo />

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
              <Route path="/blog" element={<BlogList darkMode={darkMode} />} />
              <Route
                path="/blog/:slug"
                element={<Article darkMode={darkMode} />}
              />
              {/* Redirects from the old /notes paths. */}
              <Route path="/notes" element={<Navigate to="/blog" replace />} />
              <Route path="/notes/:slug" element={<NoteRedirect />} />
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
