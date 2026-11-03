# QA report (Phase 7)

Run on 3 November 2026 against the local production build (`next build` + `next start`), Chromium 156 (Playwright 1.64.1, headless, SwiftShader WebGL). **Not** run against a deployed URL yet: re-run with `BASE_URL=<preview url> npm test`.

## How to run

```bash
npm run build
npm test               # all checks (Playwright + axe-core), starts `next start` itself
npm run seo:check      # the @seo subset: pages, redirects, 410s, sitemap, robots, llms.txt, OG images
npm run check:code     # static checks: no framer-motion, no stray hex colours, no remote assets, no API key, logo SVG hygiene
npm run test:screens   # screenshot matrix → screenshots/ (gitignored)
```

## Results

| Suite | File | What it checks | Result |
| --- | --- | --- | --- |
| Pages | `tests/pages.spec.ts` | Per manifest route: 200, title, description, canonical, `lang="en-GB"`, one H1 equal to the manifest, status note in the footer, one valid JSON-LD block, no console errors, **no requests to other hosts**. 404 page: status 404 + noindex. | pass |
| Redirects | `tests/redirects.spec.ts` | Every §4 redirect (with and without trailing slash) is one 301 to the right path; every route's trailing-slash form is one 301; query string kept; retired sections and everything under them are 410 with `x-robots-tag: noindex`, never echo the slug; look-alikes are 404 | pass |
| Discovery | `tests/discovery.spec.ts` | Sitemap equals manifest + published posts, no `<lastmod>`; robots allows search, links the sitemap, does not block `/thank-you`; `llms.txt` lists every route and no pending credential; every OG image is a 1200×630 PNG | pass |
| Claims | `tests/claims.spec.ts` | Rendered text of every page: no hype, superiority, clinical or endorsement wording, no percentages, no large invented counts, no pending credentials | pass |
| Accessibility (axe) | `tests/a11y.spec.ts` | axe-core 4.14, tags wcag2a/aa, 2.1 a/aa, 2.2 aa; every route at 390 and 1440 px, the open mobile menu, the 404 | pass (after fix 1) |
| Interaction | `tests/interaction.spec.ts` | Skip link; focus outline colour/width; mobile menu (focus stays off the page behind, Escape closes, focus returns); FAQ with Enter/Space; hero pause from the keyboard; reduced motion and Save-Data → no canvas; motion → one canvas; every page's text visible with JavaScript off | pass (after fixes 2, 3) |
| Layout | `tests/layout.spec.ts` | Every route: no horizontal scroll at 320×640, 375×812 and 844×390 (landscape); none at 1280 px with the browser text size doubled (CDP `Page.setFontSizes`); focus never covered by sticky UI (`elementFromPoint`); no target under 24 px | pass (after fix 4) |
| Code | `scripts/code-check.mjs` | 69 source files, 701 files scanned for keys (src, public, docs, `.next`, `.mcp.json`) | pass |

**Total: 193 Playwright tests passing; code check passing; ESLint and `tsc` clean.** Re-verified at handover (Phase 8) from a clean install: `rm -rf node_modules .next && npm ci && npm run lint && npm run typecheck && npm run build && npm run check:code && npm test`, all green. `npm audit`: 0 runtime vulnerabilities; dev-only findings explained in `docs/THIRD_PARTY.md`.

### Failures found and fixed

1. **`/science` table not keyboard-scrollable on phones** (axe `scrollable-region-focusable`, WCAG 2.1.1, serious). The horizontally scrolling container is now a focusable, labelled region.
2. **Hero animation had no pause control** (WCAG 2.2.2: moving content > 5 s that starts by itself). Added a "Pause animation / Play animation" button; tested from the keyboard.
3. **No pressed state on buttons** (UI UX Pro Max checklist). `.btn:active` lowers opacity; no layout shift.
4. **Targets under 44 px** (brief: 24 px minimum, 44 px preferred). Breadcrumb links were 24 px tall and short footer links 27 px wide; both now at least 44×44. Remaining sub-44 px targets: the six inline source URLs on `/science` (43 px tall, inline text links, exempt under WCAG 2.5.8).

Test-side corrections (not site bugs): Next 16 sends a relative `Location` header (valid HTTP), so redirect tests resolve it against a base; the menu test now accepts focus moving to browser UI (which a modal `<dialog>` allows) while still failing if focus reaches page content; the sticky-focus test checks what is actually on top instead of comparing to the header box (the skip link is above the header by design); the text-size test emulates the browser setting instead of overriding page CSS.

## Lighthouse 13.6.0 (lab data, mobile, simulated throttling, median of 3)

| Page | Perf | LCP | CLS | TBT | A11y | Best pr. | SEO | Weight |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 99 | 0.91 s | 0 | 92 ms | 100 | 100 | 100 | 541 KiB (incl. three.js, loaded after first paint) |
| `/platform` | 100 | 0.90 s | 0 | 8 ms | 100 | 100 | 100 | 288 KiB |
| `/science` | 100 | 0.90 s | 0 | 7 ms | 100 | 100 | 100 | 278 KiB |
| `/faq` | 100 | 0.75 s | 0 | 8 ms | 100 | 100 | 100 | 273 KiB |

Localhost, no real network. INP cannot be measured in the lab (TBT is the proxy). These are **not** field Core Web Vitals; check Search Console / CrUX after launch.

## Screenshots

`npm run test:screens`: 114 full-page PNGs, every route at 390 / 834 / 1440 px, with and without `prefers-reduced-motion`, in `screenshots/<width>-<motion|reduced>/`. Reviewed by eye: desktop for every route during Phases 3–4; tablet (834, motion) and phone (390, reduced) as contact sheets in this phase. Nothing broken found beyond the fixes above.

## UI UX Pro Max pre-delivery checklist

The skill's canonical checklist (`references/pro-rules.md`) is written for native/mobile apps; web equivalents were applied. ✅ pass · ❌ fail (fixed) · ➖ not applicable · ⬜ not checked.

| Item | Status | Evidence / note |
| --- | --- | --- |
| Only relevant searches run | ✅ | design-system search; `mobile drawer navigation focus` (ux); `app router fonts metadata` (nextjs) |
| quick-reference §1–3 final pass | ✅ | Accessibility, touch, performance covered by the suites above and Lighthouse |
| Tested at 375 px and in landscape | ✅ | `layout.spec.ts` (375×812, 844×390, plus 320×640) |
| Reduced motion; largest text size | ✅ | interaction + layout suites; text size doubled via browser setting |
| Dark mode contrast checked independently | ✅ | Site is dark-only (`color-scheme: dark`); token contrast computed (see `tokens.css`) and axe `color-contrast` passes. Light theme ➖ (none) |
| Touch targets ≥ 44 px | ❌→✅ | Fixed (4); inline source links exempt |
| No emoji as icons | ✅ | Inline SVG icons only; "→" in arrow links is a text glyph, `aria-hidden` |
| Consistent icon family / stroke | ✅ | Hand-drawn inline SVG, 1.6 stroke throughout |
| Official brand assets, proportions, clear space | ✅ | Approved 1A logo from `brand/`; NVIDIA badge not used (unverified) |
| Pressed state without layout shift | ❌→✅ | Fixed (3) |
| Semantic tokens, no ad-hoc colours | ✅ | `check:code` enforces; allowed exceptions listed in the script |
| Screen-reader focus order = visual order | ✅ (automated) | Tab order follows DOM order; not checked with a real screen reader ⬜ |
| Disabled states | ➖ | No disabled controls |
| Gesture conflicts | ➖ | No custom gestures; no scroll-jacking |
| Scrim / modal legibility | ✅ | Mobile menu is an opaque full-screen dialog |
| Safe areas / fixed bars hide content | ✅ | Menu CTA uses `env(safe-area-inset-bottom)`; `scroll-padding-top` for the sticky header; focus-obscured test passes |
| Spacing rhythm | ✅ | Tailwind 4 px scale only |
| Long-form measure | ✅ | Legal, FAQ, glossary capped at 68ch |
| Decorative icons hidden; meaningful ones labelled | ✅ | All decorative SVG `aria-hidden`; meaningful diagrams have `role="img"` + title/desc or text equivalents beside them |
| Forms: labels, errors | ➖ | No forms (mailto only, by design) |
| Colour not the only indicator | ✅ | Active nav = colour + underline; plate legend = filled vs outline; map labels in text |
| Sticky UI does not obscure focus | ✅ | `layout.spec.ts` |
| Auto-moving content can be paused | ❌→✅ | Fixed (2) |
| Auth / password managers | ➖ | No authentication |

## Manual pass: what was actually done

- Looked at every page at 1440 px (Phases 3–4) and at the full tablet and phone contact sheets (this phase), with and without reduced motion.
- Checked the focus ring by pixel sampling (Phase 2) and by computed style (tests): 2 px, `#42E8C8`, from the first frame.
- Read every page's copy against the brief's claim rules while writing it; the automated claims scan backs this up.

**Not done:** VoiceOver / NVDA / JAWS testing; Safari and Firefox; real phones and low-power devices (WebGL performance on them is unmeasured); Windows High Contrast / forced colours; testing against the deployed host; field Core Web Vitals.
