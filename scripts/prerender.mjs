// Post-build prerender: render each route to static HTML and inject per-route
// head tags, so crawlers and social scrapers get real content and correct
// metadata without running JS. Runs after `vite build` and `build:ssr`.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const ssrDir = join(root, "ssr-dist");

const { render, routes, meta, canonicalFor } = await import(
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

for (const url of routes) {
  const { title, description } = meta(url);
  const canonical = canonicalFor(url);

  let html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${await render(url)}</div>`
  );
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

// The SSR bundle is a build artifact; it never ships.
rmSync(ssrDir, { recursive: true, force: true });
