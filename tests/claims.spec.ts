import { expect, test } from "@playwright/test";
import { credentials, isPublic } from "../src/content/credentials";
import { routes } from "../src/content/routes";

/**
 * BRIEF §12: scan public rendered copy (not the repo) for forbidden clinical, hype and superiority claims.
 * Scientific "versus", agency names in citations, and EGFR/osimertinib as biology are allowed.
 * Single words like "first", "only" and "best" are not banned on their own ("first wave", "sequence-only").
 */
const FORBIDDEN = [
  /\brevolutionar(y|ise|ize)\b/i,
  /\bgame[- ]chang/i,
  /\bdisruptive\b/i,
  /\bbreakthrough\b/i,
  /\bcure[sd]?\b/i,
  /\bsolve[sd]? cancer\b/i,
  /\bseamless(ly)?\b/i,
  /\beffortless(ly)?\b/i,
  /\bunlock the full potential\b/i,
  /\bcutting[- ]edge\b/i,
  /\bworld[- ]class\b/i,
  /\bbest[- ]in[- ]class\b/i,
  /\bAI[- ]powered\b/i,
  /\bbetter than\b/i,
  /\b(market |industry )?leader\b/i,
  /\boutperform/i,
  /\bmost trustworthy\b/i,
  /\bclinically validated\b/i,
  /\bFDA[- ]approved\b/i,
  /\b(backed|powered|endorsed|certified) by\b/i,
  /\bNVIDIA partner\b/i,
  /\bis not a medical device\b/i,
  /\bcalibrated uncertainty\b/i,
  /\d\s?%/, // no percentage claims
  /\b\d{1,3}(,\d{3})+\b/, // no large invented counts such as "10,000"
];

for (const r of routes) {
  test(`${r.path} has no forbidden claims`, async ({ page }) => {
    await page.goto(r.path);
    const text = await page.locator("body").innerText();
    for (const re of FORBIDDEN) expect(text, `${re}`).not.toMatch(re);
    for (const fact of Object.values(credentials)) {
      if (!isPublic(fact)) expect(text, "pending credential shown").not.toContain(fact.value);
    }
  });
}
