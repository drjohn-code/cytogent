import { credentials, isPublic } from "@/content/credentials";
import { publishedPosts } from "@/content/posts";
import { absoluteUrl, routes } from "@/content/routes";
import { notList, site } from "@/content/site";

/**
 * Optional discovery file (llmstxt.org format). Built only from approved public facts: verified credentials,
 * manifest pages and published posts. It is not a ranking mechanism and makes no claim to be one.
 */
export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.category}. ${site.mission}`,
    "",
    `${site.statusNote}`,
    "",
    `- Delivery model: ${site.model}, a managed scientific service workflow.`,
    `- Starting focus: ${site.beachhead}`,
    `- North-star aim (not a result): ${site.northStar}`,
    ...notList.map((n) => `- ${n}`),
    ...(isPublic(credentials.email) ? [`- Contact: ${credentials.email.value}`] : []),
    "",
    "## Pages",
    "",
    ...routes.map((r) => `- [${r.title}](${absoluteUrl(r.path)}): ${r.description}`),
  ];
  const posts = publishedPosts();
  if (posts.length) {
    lines.push("", "## Notes", "", ...posts.map((p) => `- [${p.title}](${absoluteUrl(`/insights/${p.slug}`)}): ${p.summary}`));
  }
  return new Response(lines.join("\n") + "\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
