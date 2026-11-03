import { expect, test } from "@playwright/test";
import { routes } from "../src/content/routes";

// Reflow, text resize, focus visibility under the sticky header, and target sizes (WCAG 2.2 AA, BRIEF §6).

const noHScroll = () => document.documentElement.scrollWidth <= document.documentElement.clientWidth;

for (const r of routes) {
  test(`${r.path}: reflows at 320px, 375px and in phone landscape`, async ({ page }) => {
    for (const [width, height] of [
      [320, 640],
      [375, 812],
      [844, 390],
    ]) {
      await page.setViewportSize({ width, height });
      await page.goto(r.path);
      expect(await page.evaluate(noHScroll), `${width}×${height}`).toBe(true);
    }
  });

  test(`${r.path}: 200% browser text size does not cause horizontal scrolling at 1280px`, async ({ page }) => {
    // Emulates the browser's own text-size setting (default 16px → 32px), which also scales rem-based
    // media queries, rather than overriding the page's CSS.
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Page.setFontSizes", { fontSizes: { standard: 32, fixed: 26 } });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(r.path);
    expect(await page.evaluate(noHScroll)).toBe(true);
  });

  test(`${r.path}: keyboard focus is never obscured by sticky UI (2.4.11)`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(r.path);
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      const check = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const b = el.getBoundingClientRect();
        const x = Math.min(Math.max(b.left + b.width / 2, 0), innerWidth - 1);
        const y = Math.min(Math.max(b.top + b.height / 2, 0), innerHeight - 1);
        const top = document.elementFromPoint(x, y);
        return { visible: !!top && (top === el || el.contains(top) || top.contains(el)), label: el.textContent?.trim().slice(0, 40) };
      });
      if (check) expect(check.visible, `focused "${check.label}" is covered by another element`).toBe(true);
    }
  });
}

test("interactive targets at 390px: none below 24px; list those below 44px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const small: string[] = [];
  for (const r of routes) {
    await page.goto(r.path);
    const found = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("a, button, summary, [tabindex='0']")]
        .filter((el) => el.offsetParent !== null && !el.closest("p, dd, li > p, figcaption, td"))
        .map((el) => ({ el, b: el.getBoundingClientRect() }))
        .filter(({ b }) => b.width > 0 && Math.min(b.width, b.height) < 44)
        .map(({ el, b }) => `${Math.round(b.width)}×${Math.round(b.height)} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}"`),
    );
    for (const f of found) {
      const [w, h] = f.split(" ")[0].split("×").map(Number);
      expect(Math.min(w, h), `${r.path} ${f}`).toBeGreaterThanOrEqual(24);
      small.push(`${r.path} ${f}`);
    }
  }
  test.info().annotations.push({ type: "targets under 44px (≥24px)", description: [...new Set(small)].join("\n") || "none" });
  console.log([...new Set(small)].join("\n"));
});
