export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  cover?: string;
  body: string;
  readingMinutes: number;
}

const WORDS_PER_MINUTE = 200;

/**
 * Minimal frontmatter reader. Handles `key: value` pairs only — no nested
 * objects, no multi-line values. Values may contain colons; the split is on
 * the first one.
 */
const parseFrontmatter = (raw: string) => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {} as Record<string, string>, body: raw.trim() };

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    data[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }

  return { data, body: raw.slice(match[0].length).trim() };
};

const readingMinutes = (body: string) =>
  Math.max(
    1,
    Math.ceil(body.split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE)
  );

const files = import.meta.glob("../content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw);
    return {
      slug: path.split("/").pop()!.replace(/\.md$/, ""),
      title: data.title ?? "Untitled",
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      cover: data.cover || undefined,
      body,
      readingMinutes: readingMinutes(body),
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug?: string) => posts.find((p) => p.slug === slug);

export const formatDate = (date: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
