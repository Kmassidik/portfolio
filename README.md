# Portfolio

Personal site for **Kurnia Massidik** — About, Experience, Projects, and a Blog (a Medium-style reading section).

React 19, TypeScript, Vite (rolldown), Tailwind v4, React Router, framer-motion, react-markdown (with KaTeX math).

## Writing a blog post

**Drop one markdown file into `src/content/`. That's the whole process** — it's picked up automatically by `import.meta.glob`, sorted by date, and appears at `/blog`.

```markdown
---
title: Why Pingora beat Nginx for our workload
date: 2026-08-03
excerpt: One or two sentences. Shown on the post list, not in the article.
tags: infra, rust
cover: /blog/pingora.webp
---

Body starts here. Standard markdown — headings, **bold**, lists,
`code`, ```fenced blocks```, > quotes, tables, and links.

Math works too, via KaTeX: inline `$E = mc^2$` and block:

$$\int_0^1 x^2 \, dx = \frac{1}{3}$$
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | May contain colons |
| `date` | yes | `YYYY-MM-DD` — drives sort order, newest first |
| `excerpt` | no | Preview text on the list page |
| `tags` | no | Comma-separated |
| `cover` | no | Path or URL; shown as list thumbnail and article header |

The **filename becomes the URL**: `pingora-vs-nginx.md` → `/blog/pingora-vs-nginx`.
Reading time is calculated from word count (200 wpm), rounded up.

### Images

Put them in `public/blog/` and reference with a root-absolute path:

```markdown
![Benchmark results](/blog/benchmark.webp)
```

Anything under `public/` is served as-is, so `public/blog/foo.webp` is `/blog/foo.webp`.
Remote URLs work too.

## Updating experience and projects

Both are single data files — no component edits needed:

- `src/data/experience.ts` — roles, education, certifications
- `src/data/projects.ts` — `featured` (lead work) and `earlier`

## Structure

```
src/
├── App.tsx                     # routes + layout
├── main.tsx                    # BrowserRouter
├── index.css                   # tailwind + article typography
├── components/
│   ├── FloatingNav.tsx         # floating pill tab bar
│   └── ThemeToggle.tsx
├── sections/
│   ├── About.tsx
│   ├── Experience.tsx
│   ├── Projects.tsx
│   └── Blog/
│       ├── BlogList.tsx        # the feed
│       └── Article.tsx         # the reader (lazy-loaded, KaTeX math)
├── content/*.md                # ← articles live here
├── data/                       # experience + projects
├── lib/posts.ts                # markdown loader
└── hooks/useDarkMode.ts
```

## Running

Local dev (HMR):

```bash
bun install
bun run dev              # http://localhost:5173
```

Production build in Docker (builds the site, then serves the static `dist/`
with `vite preview` — not the dev server):

```bash
docker compose up --build   # http://localhost:5174
```

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Dev server with HMR |
| `bun run build` | Type-check, build to `dist/`, then prerender every route to static HTML |
| `bun run build:ssr` | (called by `build`) SSR bundle used only by the prerender step |
| `bun run prerender` | (called by `build`) renders each route + regenerates `sitemap.xml` |
| `bun run preview` | Serve the built `dist/` |
| `bun run lint` | ESLint |

## SEO / prerendering

The build renders every route — About, Experience, Projects, Blog, and each
post — to a static `dist/<route>/index.html` with its content and correct
per-route `<title>`, description, canonical, and Open Graph tags baked in, so
crawlers and social scrapers see real HTML without running JS. In the browser
the SPA takes over as before. The pieces:

- `src/lib/seo.ts` — one source of per-route metadata (title + description).
- `src/components/RouteSeo.tsx` — syncs the head during client-side navigation.
- `src/entry-server.tsx` + `scripts/prerender.mjs` — the build-time renderer.

Adding a post needs no extra steps: it's picked up, prerendered, and added to
`sitemap.xml` automatically. The social preview image is `public/og-image.png`
(1200×630).

## Deploying

Each route ships as its own `index.html`, so most paths resolve directly, and
`vite preview` (used by the Docker image) falls back to `index.html` for
anything else. On Netlify/Vercel, their SPA rewrite handles the same.
