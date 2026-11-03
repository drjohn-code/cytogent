import { expect, test } from "@playwright/test";
import { gonePrefixes, redirects } from "../src/content/redirects";
import { routes } from "../src/content/routes";

// BRIEF §4: one hop, 301; retired sections are a real 410. Run with BASE_URL to test a deployment.

for (const [from, to] of Object.entries(redirects)) {
  for (const variant of [from, `${from}/`]) {
    test(`${variant} → ${to} (301, one hop) @seo`, async ({ request }) => {
      const res = await request.get(variant, { maxRedirects: 0 });
      expect(res.status()).toBe(301);
      expect(new URL(res.headers()["location"], "http://x").pathname).toBe(to);
    });
  }
}

test("trailing slash on any route redirects once to the canonical path @seo", async ({ request }) => {
  for (const r of routes.filter((x) => x.path !== "/")) {
    const res = await request.get(`${r.path}/`, { maxRedirects: 0 });
    expect(res.status(), r.path).toBe(301);
    expect(new URL(res.headers()["location"], "http://x").pathname).toBe(r.path);
  }
});

test("query string survives the slash redirect @seo", async ({ request }) => {
  const res = await request.get("/contact/?intent=pilot", { maxRedirects: 0 });
  expect(new URL(res.headers()["location"], "http://x").search).toBe("?intent=pilot");
});

for (const prefix of gonePrefixes) {
  test(`${prefix} and everything under it is 410 Gone @seo`, async ({ request }) => {
    for (const path of [prefix, `${prefix}/`, `${prefix}/any-old-page/`]) {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status(), path).toBe(410);
      expect(res.headers()["x-robots-tag"]).toBe("noindex");
      const body = await res.text();
      // The page must not echo the retired slug (no legacy or third-party names in the HTML).
      expect(body).not.toContain("any-old-page");
      expect(body).not.toContain(prefix.split("/").pop()!);
    }
    const lookalike = await request.get(`${prefix}x`, { maxRedirects: 0 });
    expect(lookalike.status()).toBe(404);
  });
}
