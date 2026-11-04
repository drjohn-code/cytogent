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
    expect(outline).toContain("rgb(122, 167, 255)");
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
  test("hero: the micrograph and its colour lens render; reduced motion keeps the lens still", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    const hero = page.locator("section[aria-labelledby=hero-title]");
    await expect(hero.locator("img").first()).toBeVisible();
    const before = await hero.locator(".lens-lean").evaluate((el) => getComputedStyle(el).transform);
    await page.mouse.move(900, 400);
    await page.waitForTimeout(300);
    expect(await hero.locator(".lens-lean").evaluate((el) => getComputedStyle(el).transform)).toBe(before);
    await ctx.close();
  });

  test("loop story: any step can be chosen", async ({ page }) => {
    await page.goto("/");
    const step = page.getByRole("button", { name: /Test$/ });
    await step.click();
    await expect(step).toHaveAttribute("aria-current", "step");
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
