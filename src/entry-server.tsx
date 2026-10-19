import { prerenderToNodeStream } from "react-dom/static";
import { StaticRouter } from "react-router";
import App from "./App";
import { posts } from "./lib/posts";
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  canonicalFor,
  routeMeta,
} from "./lib/seo";

/** Every path the prerenderer should emit static HTML for. */
export const routes: string[] = [
  ...Object.keys(routeMeta),
  ...posts.map((p) => `/blog/${p.slug}`),
];

/** Per-route title + description, from the same source the client uses. */
export function meta(url: string): { title: string; description: string } {
  const slug = url.match(/^\/blog\/(.+)$/)?.[1];
  if (slug) {
    const post = posts.find((p) => p.slug === slug);
    if (post) {
      return {
        title: `${post.title} — Kurnia Massidik`,
        description: post.excerpt || DEFAULT_DESCRIPTION,
      };
    }
  }
  return routeMeta[url] ?? { title: SITE_NAME, description: DEFAULT_DESCRIPTION };
}

// Minimal shape of the Node stream prerenderToNodeStream returns, so this
// file needs no @types/node in the app's tsconfig.
type NodeReadable = {
  on(event: string, cb: (chunk: unknown) => void): void;
};

const streamToString = (stream: NodeReadable): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    stream.on("data", (chunk) => (data += String(chunk)));
    stream.on("end", () => resolve(data));
    stream.on("error", (err) => reject(err));
  });

/**
 * Render the app at a URL to an HTML string. prerenderToNodeStream waits for
 * Suspense to settle, so the lazy-loaded article body is fully included.
 */
export async function render(url: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
  return streamToString(prelude as unknown as NodeReadable);
}

export { canonicalFor, posts };
