export const SITE_URL = "https://kurniatech.my.id";

export const SITE_NAME = "Kurnia Massidik — Software Engineer Portfolio";

export const DEFAULT_DESCRIPTION =
  "Portfolio of Kurnia Massidik — Software Engineer & Application Architect based in Jakarta, Indonesia. Explore AI projects, full-stack apps, IoT systems, and more.";

export interface RouteMeta {
  title: string;
  description: string;
}

/** Meta for the static routes. Article pages derive their own from the post. */
export const routeMeta: Record<string, RouteMeta> = {
  "/": {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
  "/experience": {
    title: "Experience — Kurnia Massidik",
    description:
      "Kurnia Massidik's career — from electrical engineering to full-stack and AI systems engineering, 2018 to today.",
  },
  "/projects": {
    title: "Projects — Kurnia Massidik",
    description:
      "Selected work by Kurnia Massidik — production AI platforms (Glicc, Mirai, Palapa, Socai) and earlier full-stack and IoT projects.",
  },
  "/blog": {
    title: "Blog — Kurnia Massidik",
    description:
      "Ideas and lessons on software and systems, written by Kurnia Massidik.",
  },
};

/** Absolute canonical URL for a path. Root keeps its single trailing slash. */
export const canonicalFor = (path: string) =>
  path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path.replace(/\/$/, "")}`;
