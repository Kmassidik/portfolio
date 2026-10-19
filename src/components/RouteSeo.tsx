import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPost } from "../lib/posts";
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  canonicalFor,
  routeMeta,
} from "../lib/seo";

/**
 * Keeps the document head in sync with the current route during SPA
 * navigation: title, description, canonical, and the Open Graph / Twitter
 * title+description+url. The static markup for the *first* paint of each route
 * is written by the prerender step (scripts/prerender.ts) from the same
 * `routeMeta` source, so crawlers see the right tags without running JS.
 */
const upsertMeta = (selector: string, attr: string, key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const resolveMeta = (pathname: string) => {
  const slugMatch = pathname.match(/^\/blog\/(.+)$/);
  if (slugMatch) {
    const post = getPost(slugMatch[1]);
    if (post) {
      return {
        title: `${post.title} — Kurnia Massidik`,
        description: post.excerpt || DEFAULT_DESCRIPTION,
      };
    }
  }
  return (
    routeMeta[pathname] ?? { title: SITE_NAME, description: DEFAULT_DESCRIPTION }
  );
};

const RouteSeo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description } = resolveMeta(pathname);
    const canonical = canonicalFor(pathname);

    document.title = title;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description
    );
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description
    );
    upsertCanonical(canonical);
  }, [pathname]);

  return null;
};

export default RouteSeo;
