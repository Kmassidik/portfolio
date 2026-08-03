# Portfolio

Personal site for **Kurnia Massidik** — About, Experience, Projects, and Notes (a Medium-style reading section).

React 19, TypeScript, Vite (rolldown), Tailwind v4, React Router, framer-motion, react-markdown.

## Writing a note

**Drop one markdown file into `src/content/`. That's the whole process** — it's picked up automatically by `import.meta.glob`, sorted by date, and appears at `/notes`.

```markdown
---
title: Why Pingora beat Nginx for our workload
date: 2026-08-03
excerpt: One or two sentences. Shown on the notes list, not in the article.
tags: infra, rust
cover: /notes/pingora.webp
---

Body starts here. Standard markdown — headings, **bold**, lists,
`code`, ```fenced blocks```, > quotes, tables, and links.
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | May contain colons |
| `date` | yes | `YYYY-MM-DD` — drives sort order, newest first |
| `excerpt` | no | Preview text on the list page |
| `tags` | no | Comma-separated |
| `cover` | no | Path or URL; shown as list thumbnail and article header |

The **filename becomes the URL**: `pingora-vs-nginx.md` → `/notes/pingora-vs-nginx`.
Reading time is calculated from word count (200 wpm), rounded up.

### Images

Put them in `public/notes/` and reference with a root-absolute path:

```markdown
![Benchmark results](/notes/benchmark.webp)
```

Anything under `public/` is served as-is, so `public/notes/foo.webp` is `/notes/foo.webp`.
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
│   └── Notes/
│       ├── NotesList.tsx       # the feed
│       └── Article.tsx         # the reader (lazy-loaded)
├── content/*.md                # ← articles live here
├── data/                       # experience + projects
├── lib/posts.ts                # markdown loader
└── hooks/useDarkMode.ts
```

## Running

```bash
docker compose up        # http://localhost:5174
```

Or locally:

```bash
bun install
bun run dev              # http://localhost:5173
```

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Dev server with HMR |
| `bun run build` | Type-check (`tsc -b`) and build to `dist/` |
| `bun run preview` | Serve the built `dist/` |
| `bun run lint` | ESLint |

## Deploying

This is a client-routed SPA, so the host must serve `index.html` for unknown
paths or `/notes/some-slug` will 404 on refresh. Netlify/Vercel handle this
with a rewrite; nginx needs `try_files $uri $uri/ /index.html;`.
