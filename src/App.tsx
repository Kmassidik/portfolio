import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDarkMode } from "./hooks/useDarkMode";
import { Sidebar, Navigation } from "./components/Layout";
import { ProjectModal, BlogModal } from "./components/Modals";
import {
  About,
  Showcase,
  Skills,
  Blog,
  Experience,
} from "./components/Sections";
import { projects, blogPosts, skills, experience } from "./data";
import type { Project, BlogPost } from "./types";

function App() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [activeSection, setActiveSection] = useState("aboutme");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#1a1a1a]" : "bg-white"
      } transition-colors duration-300`}
    >
      <div className="flex flex-col md:flex-row min-h-screen md:container md:mx-auto ">
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-auto overflow-y-auto">
          <Navigation
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            darkMode={darkMode}
          />

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeSection === "aboutme" && <About darkMode={darkMode} />}

              {activeSection === "showcase" && (
                <Showcase
                  darkMode={darkMode}
                  projects={projects}
                  setSelectedProject={setSelectedProject}
                  hoveredProject={hoveredProject}
                  setHoveredProject={setHoveredProject}
                />
              )}

              {activeSection === "skills" && (
                <Skills darkMode={darkMode} skills={skills} />
              )}

              {activeSection === "blog" && (
                <Blog
                  darkMode={darkMode}
                  blogPosts={blogPosts}
                  setSelectedPost={setSelectedPost}
                />
              )}

              {activeSection === "experience" && (
                <Experience darkMode={darkMode} experience={experience} />
              )}
            </AnimatePresence>
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
