import { expect, test } from "@playwright/test";
import { credentials, isPublic } from "../src/content/credentials";
import { publishedPosts } from "../src/content/posts";
import { absoluteUrl, routes } from "../src/content/routes";

// BRIEF §10 and §12: discovery files list only published, indexable URLs and approved facts.

test("sitemap lists exactly the indexable routes and published posts @seo", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
  const expected = [
    ...routes.map((r) => absoluteUrl(r.path)),
    ...publishedPosts().map((p) => absoluteUrl(`/insights/${p.slug}`)),
  ].sort();
  expect(locs).toEqual(expected);
  if (publishedPosts().length === 0) expect(xml).not.toContain("<lastmod>");
});

test("robots.txt allows search and points to the sitemap @seo", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toMatch(/User-Agent: \*\nAllow: \//);
  expect(txt).toContain("Sitemap: https://cytogent.com/sitemap.xml");
  expect(txt).not.toMatch(/Disallow: \/thank-you/);
});

test("llms.txt carries only approved facts @seo", async ({ request }) => {
  const res = await request.get("/llms.txt");
  expect(res.headers()["content-type"]).toContain("text/plain");
  const txt = await res.text();
  for (const r of routes) expect(txt).toContain(absoluteUrl(r.path));
  for (const fact of Object.values(credentials)) {
    if (!isPublic(fact)) expect(txt).not.toContain(fact.value);
  }
});

test("every route has a 1200×630 OG image @seo", async ({ request }) => {
  for (const r of routes) {
    const res = await request.get(`/og/${r.slug}`);
    expect(res.status(), r.slug).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
    const png = await res.body();
    expect(png.readUInt32BE(16), `${r.slug} width`).toBe(1200);
    expect(png.readUInt32BE(20), `${r.slug} height`).toBe(630);
  }
});
