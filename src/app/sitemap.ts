import type { MetadataRoute } from "next";
import { publishedPosts } from "@/content/posts";
import { absoluteUrl, routes } from "@/content/routes";

/**
 * Canonical, indexable, 200 pages only (BRIEF §10): every manifest route plus published posts.
 * No 404/410, no drafts. No <lastmod>: there is no reliable per-page change date yet, and a build date would be false.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((r) => ({ url: absoluteUrl(r.path) })),
    ...publishedPosts().map((p) => ({
      url: absoluteUrl(`/insights/${p.slug}`),
      lastModified: p.dateModified ?? p.datePublished,
    })),
  ];
}
