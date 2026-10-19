import { useState } from "react";

// No DOM during prerendering (scripts/prerender.ts renders in Node). The
// static markup is theme-neutral; the real theme is applied in the browser
// before first paint by the inline script in index.html.
const hasDOM = typeof window !== "undefined";

const readInitial = (): boolean => {
  if (!hasDOM) return false;
  try {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return JSON.parse(saved) as boolean;
  } catch {
    // Corrupt or unavailable storage — fall through to the OS preference.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const apply = (darkMode: boolean) => {
  if (!hasDOM) return;
  try {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  } catch {
    // Storage blocked (private mode) — the theme still applies for this session.
  }
  // Exposed for CSS that can't read React state (article typography).
  document.documentElement.dataset.theme = darkMode ? "dark" : "light";
};

// Runs once at import, before the first render — so the theme is on the
// document from the very first paint. No effect, and no flash of the wrong theme.
const initial = readInitial();
apply(initial);

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(initial);

  // The theme only ever changes from a click, so the write belongs in the
  // handler rather than an effect reacting to the state afterwards.
  const set = (next: boolean) => {
    apply(next);
    setDarkMode(next);
  };

  return { darkMode, setDarkMode: set };
};
