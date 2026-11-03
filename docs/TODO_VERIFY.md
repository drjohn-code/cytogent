# To verify before launch

Started 3 November 2026 (Phase 1 / 1b of the V3.1 build prompt); summary updated at handover (Phase 8, same day). Nothing pending below is published on the new site until it is confirmed.

## Launch blockers

The site should not replace the legacy site until each of these is done.

| # | Blocker | Owner | Where to change |
| --- | --- | --- | --- |
| 1 | **Contact email verified** (`info@cytogent.com` exists, has MX records and is read). Until then `/contact` says the address is being set up, and no page offers a way to reach you. | Owner | `credentials.email.status` → `"verified"` |
| 2 | **Data controller and privacy contact named** on `/privacy`. | Owner + legal | `src/app/privacy/page.tsx` |
| 3 | **Legal review of `/privacy` and `/terms`** (governing law, contracting entity, liability, hosting provider and subprocessors). | Legal | same pages |
| 4 | **Scientific review** of `/science` and the 18 glossary entries. | Named scientist | `src/app/science`, `src/content/glossary.ts` |
| 5 | **`vercel.json` switched** to Next.js and the test suite run against the preview (`BASE_URL=… npm test`). | Developer | `vercel.json` |
| 6 | **Owner sign-off** on the copy as a whole, including the four "intended / proposed" pages (`/platform`, `/pilot-programme`, `/partners`, `/data-governance`). | Owner | — |

## Pending facts (omitted from the site until verified)

NVIDIA Inception membership **and** badge rights · WelloWork AB affiliation wording · LinkedIn URL · two Nordic–Baltic accelerator selections · data controller / retention · the two 2 Nov 2026 source documents (not provided) · Appendix A (not provided). Details in "Facts" below.

## Not tested (do not describe as passed)

- Anything on a deployed URL (redirects, 410s, `www` → apex, HTTPS, headers).
- Screen readers (VoiceOver, NVDA, JAWS), Safari, Firefox, forced colours / Windows High Contrast.
- Real phones and low-power devices (hero WebGL performance unmeasured on real hardware).
- Field Core Web Vitals (lab only: see `docs/QA_REPORT.md`).
- Google Rich Results Test / schema.org validator.
- Independent accessibility audit.
- Trademark clearance for the new logo.

## Not built (by design or deferred)

Contact form and `/thank-you` (no confirmed backend/controller) · article drafts (0 of 16; topics await approval) · MDX tooling and `/insights/[slug]` · RSS · IndexNow · `llms-full.txt` · NVIDIA badge component · logo load animation · cookie banner (no cookies exist).

---

## Facts (owner / legal)

| Item | Status | Note |
| --- | --- | --- |
| NVIDIA Inception membership **and** badge-use rights | pending | The legacy site shows the badge (`source/static/brand/`). Needs written confirmation of both before the new site shows it. |
| WelloWork AB relationship and exact wording | pending | Legacy README says "operated by WelloWork AB"; the brief allows only "affiliated with", and only once legal confirms it. |
| `info@cytogent.com` exists and is monitored | pending | Legacy README says `cytogent.com` had no MX records; the legacy form mails `request@cytogent.com`. |
| LinkedIn URL | pending | Legacy `SITE['linkedin']` has one; confirm it is the right page. |
| Two Nordic–Baltic accelerator selections | pending | |
| Data controller, retention, form backend | pending | Until confirmed, `/contact` is mailto only. |
| Source documents: 2 Nov 2026 *Marketing & Investor Overview*, *Scientific Strategy Reference* | not provided | |
| Appendix A (B01–B16 editorial table, REF-01…09 URLs) | not provided | Fallbacks in §8 and §9 apply. |

## Content review (Phase 3, 3 November 2026)

| Item | Status |
| --- | --- |
| Scientific review of `/science` (escape routes, C797S, MET/HER2, small-cell transformation, the three-signals table, "osimertinib is a standard treatment option") | **Needed.** Written from REF-01 and REF-02; not yet reviewed by a scientist. |
| REF-01…09 | Located by their descriptions in the brief (Appendix A was empty). All resolve; metadata confirmed on Crossref where a DOI exists. See `checked` in `src/content/references.ts`. |
| REF-06 | `cancermodels.org` now redirects to an EMBL-EBI BioStudies collection. The PDCM Finder paper (NAR 2023) is cited instead. |
| REF-09 | NCBI served a bot check to the script; editors not confirmed automatically. Recheck in a browser. |
| Home meta description | 163 characters, as written in the brief (§7). Google may cut it at around 155–160. Keep, or shorten with owner approval. |
| Word counts (main text, visible, excluding decorative SVG) | Home 430 (target ≤400); Platform 453 (280–450); Science 613 including about 150 words of source list (320–500); For drug teams 386; Pilot 325. Targets are editorial; nothing cut from legal or scientific substance. |
| Banned-word scan of rendered copy | No hype or superiority claims. "first", "only" and "best" appear only in neutral uses ("first wave", "sequence-only", "best serves it"). |

## Phase 4 detail: legal and contact (3 November 2026)

| Item | Why it blocks | Where |
| --- | --- | --- |
| **Email address verified** | `/contact` shows "Our contact address is being set up" until `credentials.email` is `verified`. Several pages send people to `/contact`, and the accessibility statement's "report a barrier" route depends on it. | `src/content/credentials.ts` |
| **Data controller named** | `/privacy` says the responsible organisation "will be stated here before the site is launched". A privacy notice needs the controller and a privacy contact. | `src/app/privacy/page.tsx` |
| **Legal review of `/privacy` and `/terms`** | Drafted from what the site actually does (no cookies, analytics, forms or third-party scripts). Not reviewed. Governing law, contracting entity and liability wording deliberately left out. | `src/app/privacy`, `src/app/terms` |
| **Hosting provider confirmed** | `/privacy` says "our hosting provider" without naming it. Vercel is the current host of the legacy site; name it once the new site's hosting is confirmed, with any subprocessors. | `src/app/privacy/page.tsx` |
| **Accessibility audit** | *Updated in Phase 7:* `/accessibility` now states the automated testing that was done and that a screen-reader review and independent audit have not been. Update it when they happen. | `src/app/accessibility/page.tsx` |

## Phase 4 notes

| Item | Status |
| --- | --- |
| Contact form | **Not built**, by design: no destination, validation, abuse protection, retention or controller confirmed. mailto only, shown only once the email is verified. No `/thank-you` page, because there is no form. |
| Redirects and 410 | Handled in `src/proxy.ts` (Next 16 proxy) with `skipTrailingSlashRedirect`, so every legacy URL takes one hop. Status codes are **301** (not Next's default 308). Tested locally with curl against `next start` on 3 Nov 2026: all 13 legacy URLs in §4 → 301 in one hop to the right target; `/compare`, `/solutions`, `/customers`, `/industries/regulatory-and-ip-teams` and anything under them → **410** with `x-robots-tag: noindex`; look-alikes (`/comparex`) → 404; assets unaffected. **Not yet tested on the deployed host.** |
| 410 page | Self-contained HTML in the proxy (system font, token colours inline). It never echoes the requested path, so no retired slug or third-party name appears in it. |
| `www` → apex, HTTPS | Host-level (Vercel domain settings). Not configured or tested here. |
| Word counts (main text) | Under target, left unpadded: Partners 191 (240–360), Biobanks 169 (260–380), Investors 224 (260–400), About 191 (240–360), Data governance 201 (240–400), Insights 37 (empty state). In range: Labs 266, For people 300, Contact 123. FAQ 502 and Glossary 929 have no target. |
| Glossary | 18 terms, 40–60 words each, written without a scientific review. **Review needed.** |
| FAQ | 12 answers in native `<details>`/`<summary>`; keyboard open/close checked (Enter, Space). |

## Phase 5: editorial (3 November 2026)

| Item | Status |
| --- | --- |
| B01–B16 topics | **Proposed, needs owner approval** (`docs/EDITORIAL_PLAN_PROPOSAL.md`). Appendix A was not supplied, so no drafts were written (brief §9 fallback). |
| Article drafts | **None.** 0 of 16. |
| Post registry | `src/content/posts/index.ts`: typed frontmatter, empty list, `publishedPosts()` as the only public accessor. A draft cannot carry `datePublished` (type-level). |
| MDX tooling and `/insights/[slug]` | Not added; deferred until the first topic is approved. |
| Reviewer for each article | Owner to name. No article may claim expert review that did not happen. |

## Phase 6: search and discovery (3 November 2026)

| Item | Status |
| --- | --- |
| AI training crawler default | `allow` (continuity with the legacy `robots.txt`). **Owner decision**: keep, or set `AI_TRAINING_CRAWLERS=block` in Vercel. |
| Rich Results Test / Schema validator | Not run (needs deployed URLs). |
| Sitemap `<lastmod>` | Omitted on purpose. Add per-page dates only with a real change-tracking source. |
| IndexNow, RSS, `llms-full.txt` | Not built (all optional; RSS waits for published posts). |
| Search Console / Bing Webmaster | Not set up here. Legacy `SITE['google_site_verification']` was empty. |

## Phase 7: checks (3 November 2026)

| Item | Status |
| --- | --- |
| Automated tests | 193 Playwright + axe tests pass locally; `check:code` passes. Details: `docs/QA_REPORT.md`. |
| Same tests on the deployed preview | **Not run.** `BASE_URL=<preview> npm test` once deployed. |
| Screen readers, Safari, Firefox, real devices, forced colours | **Not tested.** |
| Field Core Web Vitals | Not measurable before launch. Lab (Lighthouse, local): LCP 0.75–0.91 s, CLS 0, TBT ≤ 92 ms. |
| Accessibility statement | Updated to say what was tested and what was not. Independent audit still open. |

## Brand

| Item | Status |
| --- | --- |
| Logo direction chosen by owner | **done**: 1A "Refined loop", chosen 3 November 2026. Files in `brand/`, notes in `docs/BRAND.md`. Not yet in the site. |
| Trademark clearance (EUIPO / national office) for the new mark | **not done** |

## Build and hosting

| Item | Status |
| --- | --- |
| Stack | **Decided 3 November 2026: rebuild in Next.js** (App Router, repo root). Legacy `source/`, `site/`, `api/` kept until cutover. |
| `vercel.json` still deploys the legacy `site/` folder (`framework: null`, `outputDirectory: site`) | **Open.** Pushing the Next.js work does not change production until `vercel.json` is switched to Next.js. Do that at cutover, deliberately. |
| Legacy files to remove at cutover | `source/`, `site/`, `api/request-access.js`, old logo files, legacy `README.md` sections. Owner approval needed. |
| Footer and nav links to routes not built yet | Expected during Phases 2–4. They return 404 until each route exists. |
| NVIDIA badge component | Not built. Build it only after membership and badge rights are verified. |
| Footer copyright year | Set when the page is rendered; pages are static, so that means build time. |
