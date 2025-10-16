import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDarkMode } from "./hooks/useDarkMode";
import { Sidebar, Navigation } from "./components/Layout";
import { ProjectModal, BlogModal } from "./components/Modals";
import { About, Showcase, Blog } from "./components/Sections";
import { projects, blogPosts } from "./data";
import type { Project, BlogPost } from "./types";

function App() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [activeSection, setActiveSection] = useState("aboutme");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#1a1a1a]" : "bg-white"
      } transition-colors duration-300`}
    >
      <div className="flex flex-col md:flex-row md:container md:mx-auto">
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-1 flex flex-col md:h-screen overflow-hidden">
          <Navigation
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            darkMode={darkMode}
          />

          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div className="p-4 md:p-8 pb-8 md:pb-12">
              <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: ${
                    darkMode
                      ? "rgba(156, 163, 175, 0.3)"
                      : "rgba(203, 213, 225, 0.5)"
                  };
                  border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: ${
                    darkMode
                      ? "rgba(156, 163, 175, 0.5)"
                      : "rgba(203, 213, 225, 0.8)"
                  };
                }
                /* For Firefox */
                .custom-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: ${
                    darkMode
                      ? "rgba(156, 163, 175, 0.3)"
                      : "rgba(203, 213, 225, 0.5)"
                  } transparent;
                }
              `}</style>
              <AnimatePresence mode="wait">
                {activeSection === "aboutme" && <About darkMode={darkMode} />}

                {activeSection === "showcase" && (
                  <Showcase
                    darkMode={darkMode}
                    projects={projects}
                    setSelectedProject={setSelectedProject}
                  />
                )}

                {activeSection === "blog" && (
                  <Blog
                    darkMode={darkMode}
                    blogPosts={blogPosts}
                    setSelectedPost={setSelectedPost}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            darkMode={darkMode}
          />
        )}

        {selectedPost && (
          <BlogModal
            selectedPost={selectedPost}
            setSelectedPost={setSelectedPost}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
