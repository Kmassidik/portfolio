// Post-build prerender: render each route to static HTML and inject per-route
// head tags, so crawlers and social scrapers get real content and correct
// metadata without running JS. Runs after `vite build` and `build:ssr`.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const ssrDir = join(root, "ssr-dist");

const { render, routes, meta, canonicalFor, posts } = await import(
  pathToFileURL(join(ssrDir, "entry-server.js")).href
);

const template = readFileSync(join(dist, "index.html"), "utf-8");

const escapeHtml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const setTitle = (html, title) =>
  html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);

const setMeta = (html, attr, key, content) => {
  const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[\\s\\S]*?(")`);
  return html.replace(re, (_m, p1, p2) => p1 + escapeHtml(content) + p2);
};

const setCanonical = (html, href) =>
  html.replace(
    /(<link\s+rel="canonical"\s+href=")[\s\S]*?(")/,
    (_m, p1, p2) => p1 + href + p2
  );

// Two things hide the prerendered body from a visitor whose browser has JS
// turned off:
//
//   1. framer-motion renders its `initial` state on the server, so the page
//      wrapper and every list row ship `style="opacity:0;transform:..."`.
//      The entrance animation only plays once JS hydrates.
//   2. React parks a resolved Suspense boundary in `<div hidden id="S:0">`
//      and reveals it with an inline script. Without JS that never runs, so
//      the whole body stays `display:none`.
//
// Together those mean every page but the home page renders as a blank screen
// without JS — the exact opposite of what this step exists for.
//
// A <noscript> stylesheet fixes both without touching the animated
// experience: browsers with JS disabled parse and apply the rule, browsers
// with JS enabled treat the contents as inert text and never apply it. So
// the static HTML stands on its own, and the fade-in still plays normally
// for real visitors.
const NOSCRIPT_STYLE = `<noscript><style>
      #root > [hidden] { display: block !important; }
      #root [style*="opacity:0"] { opacity: 1 !important; transform: none !important; }
      #root > .app-shell { min-height: 0 !important; }
      #root { min-height: 100vh; background-color: #ffffff; color: #1f2937; }
      [data-theme="dark"] #root { background-color: #262624; color: #ffffff; }
    </style></noscript>`;

for (const url of routes) {
  const { title, description } = meta(url);
  const canonical = canonicalFor(url);

  let html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${await render(url)}</div>`
  );
  html = html.replace("</head>", `    ${NOSCRIPT_STYLE}\n  </head>`);
  html = setTitle(html, title);
  html = setMeta(html, "name", "description", description);
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:description", description);
  html = setMeta(html, "property", "og:url", canonical);
  html = setMeta(html, "name", "twitter:title", title);
  html = setMeta(html, "name", "twitter:description", description);
  html = setCanonical(html, canonical);

  const out = url === "/" ? join(dist, "index.html") : join(dist, url, "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log("prerendered", url);
}

// Keep the sitemap in sync with the routes we actually ship.
const today = new Date().toISOString().slice(0, 10);
const entries = routes
  .map((url) => {
    const loc = canonicalFor(url);
    const priority = url === "/" ? "1.0" : url.startsWith("/blog/") ? "0.6" : "0.8";
    const changefreq = url.startsWith("/blog") ? "weekly" : "monthly";
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n");
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
);
console.log("wrote sitemap.xml");

// RSS feed for the blog, newest first (posts are already sorted by date).
const rssItems = posts
  .map((post) => {
    const url = canonicalFor(`/blog/${post.slug}`);
    const pubDate = post.date
      ? new Date(post.date).toUTCString()
      : new Date().toUTCString();
    return `  <item>\n    <title>${escapeHtml(post.title)}</title>\n    <link>${url}</link>\n    <guid isPermaLink="true">${url}</guid>\n    <pubDate>${pubDate}</pubDate>\n    <description>${escapeHtml(post.excerpt)}</description>\n  </item>`;
  })
  .join("\n");
writeFileSync(
  join(dist, "rss.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>Kurnia Massidik's Blog</title>\n  <link>${canonicalFor("/blog")}</link>\n  <description>Notes and lessons on software, systems, and hardware.</description>\n  <language>en</language>\n${rssItems}\n</channel>\n</rss>\n`
);
console.log("wrote rss.xml");

// The SSR bundle is a build artifact; it never ships.
rmSync(ssrDir, { recursive: true, force: true });
