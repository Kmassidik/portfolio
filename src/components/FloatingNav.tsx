import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Briefcase, LayoutGrid, PenLine, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const items: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "About", icon: User },
  { to: "/experience", label: "Experience", icon: Briefcase },
  { to: "/projects", label: "Projects", icon: LayoutGrid },
  { to: "/notes", label: "Notes", icon: PenLine },
];

const isActive = (pathname: string, to: string) =>
  to === "/" ? pathname === "/" : pathname.startsWith(to);

interface FloatingNavProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const FloatingNav = ({ darkMode, setDarkMode }: FloatingNavProps) => {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 32 };

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4"
    >
      <div
        className={`flex items-center gap-0.5 rounded-full border p-1.5 shadow-lg backdrop-blur-md transition-colors duration-300 sm:gap-1 ${
          darkMode
            ? "border-white/10 bg-[#1e1e1d]/85 shadow-black/40"
            : "border-black/5 bg-white/85 shadow-black/10"
        }`}
      >
        {items.map(({ to, label, icon: Icon }) => {
          const active = isActive(pathname, to);

          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className={`relative flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c15f3c] focus-visible:ring-offset-2 sm:px-3.5 ${
                darkMode
                  ? "focus-visible:ring-offset-[#1e1e1d]"
                  : "focus-visible:ring-offset-white"
              } ${
                active
                  ? "text-white"
                  : darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  transition={spring}
                  className="absolute inset-0 rounded-full bg-[#c15f3c]"
                />
              )}

              <Icon size={18} className="relative shrink-0" />

              <AnimatePresence initial={false}>
                {active && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={spring}
                    className="relative hidden overflow-hidden whitespace-nowrap sm:block"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        <span
          aria-hidden="true"
          className={`mx-1 h-6 w-px ${darkMode ? "bg-white/10" : "bg-black/10"}`}
        />

        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </nav>
  );
};

export default FloatingNav;
