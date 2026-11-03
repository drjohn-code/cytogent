import { test } from "@playwright/test";
import { routes } from "../src/content/routes";

// Screenshot matrix (BRIEF §11 Phase 7): every route at 390 / 834 / 1440, with and without reduced motion.
// Output: screenshots/<width>-<motion>/<slug>.png (gitignored). Run: npm run test:screens
for (const width of [390, 834, 1440]) {
  for (const motion of ["no-preference", "reduce"] as const) {
    test(`screens ${width} ${motion}`, async ({ browser }) => {
      test.setTimeout(180_000);
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: motion });
      const page = await ctx.newPage();
      for (const r of routes) {
        await page.goto(r.path);
        await page.waitForTimeout(r.path === "/" ? 1500 : 300);
        await page.screenshot({ path: `screenshots/${width}-${motion === "reduce" ? "reduced" : "motion"}/${r.slug}.png`, fullPage: true });
      }
      await ctx.close();
    });
  }
}
