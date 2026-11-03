import { expect, test } from "@playwright/test";
import { routes } from "../src/content/routes";

test.describe("keyboard", () => {
  test("first Tab reaches the skip link, which moves focus to main", async ({ page }) => {
    await page.goto("/platform");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveText("Skip to content");
    await page.keyboard.press("Enter");
    await expect(page.locator(":focus")).toHaveAttribute("id", "main");
  });

  test("focus outline is the signal colour from the first frame", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    for (let i = 0; i < 3; i++) await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outline);
    expect(outline).toContain("rgb(66, 232, 200)");
    expect(outline).toContain("2px");
  });

  test("mobile menu: opens, keeps focus off the page behind, closes on Escape, returns focus", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const button = page.getByRole("button", { name: "Menu" });
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    // A modal <dialog> makes the page inert. Tabbing past the last item may move focus to the browser's own UI
    // (activeElement is then <body>); it must never land on page content behind the dialog.
    let insideDialog = 0;
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const where = await page.evaluate(() =>
        document.activeElement === document.body ? "browser" : document.activeElement?.closest("dialog") ? "dialog" : "page",
      );
      expect(where).not.toBe("page");
      if (where === "dialog") insideDialog++;
    }
    expect(insideDialog).toBeGreaterThan(8);
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog")).not.toHaveAttribute("open", "");
    await expect(button).toBeFocused();
  });

  test("FAQ items open and close with Enter and Space", async ({ page }) => {
    await page.goto("/faq");
    const first = page.locator("details").first();
    await page.locator("summary").first().focus();
    await page.keyboard.press("Enter");
    await expect(first).toHaveAttribute("open", "");
    await page.keyboard.press("Space");
    await expect(first).not.toHaveAttribute("open", "");
  });
});

test.describe("motion", () => {
  test("reduced motion: no WebGL canvas, static SVG fallback shown", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.waitForTimeout(1000);
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator("#main figure svg").first()).toBeVisible();
    await ctx.close();
  });

  test("motion allowed: the hero mounts one WebGL canvas", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "no-preference" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.locator("canvas")).toHaveCount(1, { timeout: 5000 });
    await ctx.close();
  });

  test("hero animation can be paused from the keyboard (WCAG 2.2.2)", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "no-preference" });
    const page = await ctx.newPage();
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Pause animation" });
    await expect(toggle).toBeVisible({ timeout: 5000 });
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Play animation" })).toBeFocused();
    await ctx.close();
  });

  test("Save-Data: no WebGL canvas", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "no-preference" });
    await ctx.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true } }));
    const page = await ctx.newPage();
    await page.goto("/");
    await page.waitForTimeout(1000);
    await expect(page.locator("canvas")).toHaveCount(0);
    await ctx.close();
  });

  for (const r of routes) {
    test(`${r.path}: content is visible without JavaScript (animation never gates content)`, async ({ browser }) => {
      const ctx = await browser.newContext({ javaScriptEnabled: false });
      const page = await ctx.newPage();
      await page.goto(r.path);
      await expect(page.locator("h1")).toBeVisible();
      const hidden = await page.evaluate(
        () => [...document.querySelectorAll("main h1, main h2, main p")].filter((e) => getComputedStyle(e).opacity === "0").length,
      );
      expect(hidden).toBe(0);
      await ctx.close();
    });
  }
});
