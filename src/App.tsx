import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDarkMode } from "./hooks/useDarkMode";
import { Sidebar, Navigation } from "./components/Layout";
import { ShowCaseModal, BlogModal } from "./components/Modals";
import { About, Showcase, Blog, Hobby } from "./components/Sections";
import { projects, blogPosts } from "./data";
import type { Project, BlogPost } from "./types";

function App() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [activeSection, setActiveSection] = useState("aboutme");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div
      className={`md:min-h-screen ${
        darkMode ? "bg-[#262624]" : "bg-white"
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

                {activeSection === "hobby" && <Hobby darkMode={darkMode} />}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ShowCaseModal
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
