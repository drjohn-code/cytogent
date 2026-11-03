import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Search crawlers are always allowed (BRIEF §10). AI *training* crawlers are controlled separately by
 * AI_TRAINING_CRAWLERS = "allow" (default, same as the legacy site) | "block".
 * Names checked against each operator's own documentation on 3 Nov 2026 (see README). They change; recheck.
 * Google-Extended is a robots.txt control token, not a separate crawler: it does not affect Google Search.
 */
export const TRAINING_CRAWLERS = ["GPTBot", "Google-Extended", "CCBot", "ClaudeBot", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  const block = process.env.AI_TRAINING_CRAWLERS === "block";
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...(block ? [{ userAgent: TRAINING_CRAWLERS, disallow: "/" }] : [])],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
