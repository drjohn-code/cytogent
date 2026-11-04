import { expect, test } from "@playwright/test";
import { absoluteUrl, routes } from "../src/content/routes";

// One test per manifest route (BRIEF §5: generate tests from the route manifest, do not hard-code a count).

test("titles and descriptions are unique across the manifest @seo", () => {
  expect(new Set(routes.map((r) => r.title)).size).toBe(routes.length);
  expect(new Set(routes.map((r) => r.description)).size).toBe(routes.length);
});

for (const r of routes) {
  test(`${r.path} renders correctly @seo`, async ({ page, baseURL }) => {
    const errors: string[] = [];
    const external: string[] = [];
    const host = new URL(baseURL!).host;
    // Vercel injects its feedback toolbar (vercel.live) into preview deployments only; it is not part of the site.
    const allowed = host.endsWith(".vercel.app") ? ["vercel.live"] : [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && !allowed.some((a) => m.location().url.includes(a)) && errors.push(m.text()));
    page.on("request", (req) => {
      const u = new URL(req.url());
      if (u.protocol.startsWith("http") && u.host !== host && !allowed.includes(u.host)) external.push(req.url());
    });

    const res = await page.goto(r.path);
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle(r.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", r.description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", absoluteUrl(r.path));
    await expect(page.locator("html")).toHaveAttribute("lang", "en-GB");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(r.heading);

    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld).toHaveLength(1);
    expect(() => JSON.parse(ld[0])).not.toThrow();

    await page.waitForTimeout(300);
    expect(errors, "console errors").toEqual([]);
    expect(external, "requests to other hosts (no remote fonts, images, scripts or analytics)").toEqual([]);
  });
}

test("404 uses the not-found page with noindex", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
