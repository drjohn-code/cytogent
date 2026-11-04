import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { routes } from "../src/content/routes";

// Axe is necessary but not sufficient (BRIEF §6); the manual pass is recorded in docs/QA_REPORT.md.
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

function summary(violations: { id: string; impact?: string | null; nodes: { target: unknown }[] }[]) {
  return violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => JSON.stringify(n.target)).join(", ")}`).join("\n");
}

// Reduced motion: cards fade in on scroll, and axe would otherwise measure them mid-fade.
test.use({ reducedMotion: "reduce" });

for (const width of [390, 1440]) {
  for (const r of routes) {
    test(`axe ${r.path} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(r.path);
      await page.waitForTimeout(400);
      const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      expect(violations, summary(violations)).toEqual([]);
    });
  }
}

test("axe on the open mobile menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await page.waitForTimeout(300);
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(violations, summary(violations)).toEqual([]);
});

test("axe on the 404 page", async ({ page }) => {
  await page.goto("/missing-page");
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(violations, summary(violations)).toEqual([]);
});
