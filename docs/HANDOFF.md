# Cytogent website v2 — handoff

## Search and speed (October 2026, branch `feat/seo-search-console`)

What changed, and where:

| Area | Change | Where |
| --- | --- | --- |
| Descriptions | Rule: title up to 60 characters, description 70 to 155, both unique. `/privacy/` and `/customers/` were 159; both are shorter now, with no new facts. | `src/pages.py`; `verify_all.py` and `tools/v2_check.py` use the same rule and now exit with 1 on a problem |
| SEO check | `tools/seo_check.py` reads `dist/` and fails the build on a bad title, description, canonical, H1, image, link preview tag, JSON-LD block or sitemap. It also checks `site/404.html`. | `make.sh` runs it before the sync to `site/` |
| Sitemap dates | `<lastmod>` is the day a page's content last changed, not the build day. A hash of the title, description and `<main>` is kept per page in `source/lastmod.json`. `<changefreq>` and `<priority>` are gone (Google ignores them). | `build.py` (`content_hash`, `lastmod`, `seo_files`) |
| robots.txt | The `Disallow: /request-access/success/` line is gone: that page does not exist. | `build.py` |
| Link previews | `og:locale` (en_GB), `og:image:alt`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`. The alt text is the page's H1, which the OG image shows. No `twitter:site`: there is no X account. | `page()` in `build.py` |
| JSON-LD | Organization = WelloWork AB; its `brand` is Cytogent, with its URL, the new logo and the LinkedIn page. SoftwareApplication: category `BusinessApplication`, system `Web`, plus `url`, `image` and `sameAs`. No price, rating or reviews. `<` is escaped as `\u003c`. | `jsonld()` in `build.py` |
| LinkedIn | `SITE['linkedin']`. The footer's bottom row now links to it (it replaces the sentence "Cytogent is a research tool, not a medical device.", which still stands on home, `/security/`, `/solutions/clinical-trials/` and in `llms.txt`). | `src/content.py`, `footer()`, `site.css` |
| Icons | `favicon.ico` (48×48), `apple-touch-icon.png` (180×180) and `img/logo-512.png`, rendered from the mark on #05060E. Linked from every page and from `site/404.html`. | `icons.py` |
| Scripts | Minified with terser (156 KB → 87 KB) and named after a hash of their content (`/js/app.<hash>.js`). Vercel caches `/js/` for a year. The preview artifact still inlines the source files. | `publish_js()` in `build.py`, `package.json`, `vercel.json` |
| Hero poster | `poster.py` is removed, with `hero-poster.jpg` and `.webp`. Nothing used them, and as a picture behind the home hero the WebP made LCP worse (1.8 s → 2.55 s in Lighthouse, mobile), because it became the largest element. | — |
| Fonts | Both preloads stay. Geist Mono shows on the first screen only on the glossary, but every page uses it further down, so the browser downloads it at the first layout anyway. Without the preload it starts later, and Lighthouse's FCP got worse (0.8 s → 1.05–1.5 s on mobile). | `page()` in `build.py` |
| One host | `cytogent.vercel.app` redirects (308) to `cytogent.com`, path kept. The rule matches only that host, not preview URLs. Its source is `/(.*)`, not `/:path*`: with `trailingSlash: true`, `/:path*` does not match `/` or page URLs that end in `/`. | `vercel.json` |
| Search Console | `SITE['google_site_verification']` is empty. If it is set, the home page gets the meta tag. The steps to do by hand are in the README. | `src/content.py`, `page()` |

### Speed (Lighthouse 13.5, mobile)

Measured on 2 October 2026 with `npx serve` (gzip on) on this machine, 3 runs per page, median. The live site was measured too, before this change.

| Page | Live site now | Before (local) | After (local) |
| --- | --- | --- | --- |
| `/` | 100 · LCP 1.52 s · TBT 11 ms · CLS 0 | 100 · LCP 1.80 s · TBT 0 ms · CLS 0 · 152 KiB | 100 · LCP 1.80 s · TBT 0 ms · CLS 0 · 140 KiB |
| `/platform/` | 100 · LCP 1.72 s · TBT 7 ms · CLS 0 | 100 · LCP 1.80 s · TBT 0 ms · CLS 0 · 144 KiB | 99 · LCP 1.80 s · TBT 0 ms · CLS 0 · 131 KiB |
| `/compare/` | 100 · LCP 1.67 s · TBT 0 ms · CLS 0 | 100 · LCP 1.80 s · TBT 0 ms · CLS 0 · 140 KiB | 100 · LCP 1.80 s · TBT 0 ms · CLS 0 · 129 KiB |
| `/solutions/literature-and-evidence/` | 100 · LCP 1.73 s · TBT 2 ms · CLS 0 | 100 · LCP 1.80 s · TBT 0 ms · CLS 0 · 139 KiB | 100 · LCP 1.80 s · TBT 0 ms · CLS 0 · 128 KiB |
| `/request-access/` | 100 · LCP 1.69 s · TBT 0 ms · CLS 0 | 100 · LCP 1.80 s · TBT 0 ms · CLS 0 · 139 KiB | 100 · LCP 1.80 s · TBT 0 ms · CLS 0 · 128 KiB |

All pages were already inside the targets (performance 90+, LCP under 2.5 s, CLS under 0.1, TBT under 200 ms), so the scores cannot go up. What the change gives: 11 to 13 KiB less per page (the scripts go from 47–50 KiB to 36–37 KiB over the wire), no "minify JavaScript" warning, and scripts that a returning visitor does not download again. With real network throttling (`--throttling-method=devtools`) the numbers are the same before and after: performance 100, LCP 0.85–0.88 s, TBT up to 25 ms, CLS up to 0.055.

Lighthouse on the inlined CSS: it is not render-blocking (it is in the page). It reports about 10 to 12 KiB of unused CSS on inner pages and none on home. That is expected for one shared stylesheet, and it was left as it is.

The diagrams were already lazy: each canvas starts when it comes within 360 px of the screen and its animation stops while it is off screen (`cell.js` runs one animation loop, gated per canvas by an IntersectionObserver). Nothing changed there.

---


Built from [`docs/V2_BRIEF.md`](V2_BRIEF.md), in the seven phases it lists, one commit per phase.

## Problem

The site said what other agent workspaces also say. It did not show why a research team should choose Cytogent.

## Solution

- A live demo of a research brief sits right under the home hero.
- The site now explains the research brief, and that agents give tasks to people.
- A fair "if you have to choose" comparison: a table on home, a compare hub and three product pages.
- Pilots are on the site.
- Google Analytics 4 loads only after cookie consent.

## Outcome

27 pages (was 22). All of them pass the page checks and the diagram layout check. The design system is unchanged: every new component uses the existing tokens and patterns.

---

## Open items to confirm

Each item below is in the build as the brief wrote it, and is marked in the HTML with `<!-- CONFIRM: … -->`. Search the built pages for `CONFIRM` to find every place. The notes live in `CONFIRM` in `source/src/content.py`.

| # | Item | Where it shows | What to do if it is not true |
| --- | --- | --- | --- |
| 1 | **Planner** is the name of the agent that asks questions and plans. | Demo, how-it-works diagram, solution pages | Rename `Planner` in `content.DEMO_AGENTS`, `pages.PLANNER` and `diagrams.js`. |
| 2 | **Life-science models are live** (structure, docking, protein design, CRISPR checks). | Compare tables, compare cards, FAQ | Change "Built in" to "In progress" in `content.COMPARE` and `pages._vs_rows`. |
| 3 | **Trained models** status (variant effect, binding affinity, assay QC). | Home and Data pages show "In progress" | Remove the pill if they are live. |
| 4 | **Encryption at rest.** The old site said Done; the deck says in transit only. | Home and Security now say "In progress" for at rest | Set it back to `done` in `content.SECURITY` and `pages.SECURITY_PAGE` if it is live. |
| 5 | **"Anything that leaves the project waits for a yes."** | Home (people and agents), Platform (bench), FAQ | Remove the sentence. |
| 6 | **MCP connectors and browser access** are available to customers. | Platform ("Use the AI you already trust"), FAQ, Dust page | Remove or mark as planned. |
| 7 | **Reply within five working days, with a first research brief draft.** | Home access section, FAQ, request form, success message | Change the wording in `content.FAQ`, `build.home()` and `build.request_page()`. |
| 8 | **Written permission from Cervixel and Eipha Biosciences**, and the wording on `/customers/`. | Home "Pilots" section, `/customers/` | See "Pilots" below. |
| 9 | ~~Founders' full names, photos and LinkedIn URLs.~~ | The team section was removed from About on request (2 October 2026). | Nothing to do unless the section comes back. |
| 10 | **Lawyer review** of the privacy text and the compare pages. | `/privacy/`, `/compare/…` | — |
| 11 | **Competitor facts.** Checked on 2 October 2026 (see "Compare pages" below). | Compare tables and pages | Re-check before launch, then update `content.FACTS_CHECKED`. |
| 12 | **Health data standards**: which of openEHR, FHIR, OMOP and SNOMED CT are live. SNOMED CT needs a licence. | Home, Platform, Data, hospitals page, FAQ, glossary, compare hub | Mark the ones that are not live. |
| 13 | **ScienceDirect**: Elsevier licence, AI reading and citing allowed, and permission to name it. | Home, Platform, Data, literature page, FAQ | Remove the ScienceDirect sentences. |
| 14 | **"xAI" in our own copy.** The company behind Grok now signs its pages "SpaceXAI". The brief's copy says "Anthropic, OpenAI, Google and xAI". | Platform, FAQ, compare pages | Decide whether to rename it across the site. The Grok page already names the models, not the company. |
| 15 | **NVIDIA models are live**: OpenFold, DiffDock, ESM, RFdiffusion and ProteinMPNN through NVIDIA BioNeMo NIM microservices, and NVIDIA Parabricks. The NVIDIA cards carry no status yet. | Home ("Built on NVIDIA technology", FAQ), Data and models (`#nvidia`), About, Platform, protein design and in-silico pages | Add a status per card in `pages.NVIDIA['cards']` (the fifth value), or remove the model from `nvidia_inception.MODELS`. The badge and member line live in `source/src/nvidia_inception.py`. There is no trademark or non-endorsement line anywhere on the site (founder's call); `llms.txt` only states the membership. |
| 16 | **Reversed NVIDIA badge.** The site shows a transparent version made from NVIDIA's file (white box and frame removed, black made white, green kept). NVIDIA's kit has no such version: its own treatment for dark backgrounds is the white box. Chosen by the founder for the design. | Every badge placement: home hero and section, About, Data and models, footer | If NVIDIA asks, set `BADGE_SRC = BADGE_SRC_BOXED` in `source/src/nvidia_inception.py` and rebuild. |

### Manual steps (not in the code)

- **Google Analytics admin:** set data retention to 14 months. The privacy text says 14 months.
- **Google Analytics admin:** check that Google signals is off for the property. The tag also turns it off.
- If a Content-Security-Policy is added to `vercel.json` later, allow `https://www.googletagmanager.com` and `https://*.google-analytics.com`.

---

## What changed, page by page

| Page | Change |
| --- | --- |
| `/` | Hero subtitle and buttons (animation unchanged; the model line under the buttons was removed and the subtitle shortened after review). New: demo, research brief, people and agents, pilots. How it works is four steps. The story has seven steps. "Why Cytogent" is the new comparison table. Data, security, access, FAQ and CTA follow the brief. |
| `/platform/` | New H1 and subtitle. New first section with the demo (one example). Five-step "request to result". Health data standards. "Use the AI you already trust". |
| `/compare/` | New. Hub page with the full table. |
| `/compare/chatgpt/`, `/compare/grok/`, `/compare/dust/` | New. Same template, with sources and a "Last checked" date. |
| `/customers/` | New. Built, but hidden until permission is confirmed (see below). |
| `/about/` | New definition and description. The team section was built, then removed on request. |
| `/request-access/` | New first field "What do you want to find out?" in all three forms. New success message. The API requires the field and puts it first in the email. |
| `/privacy/` | Section 7 is now "Cookies and analytics" (`#cookies`). |
| 7 solution pages | "Starts with a research brief" strip. The Planner joins the team (the heading is now "Four agents, one result"). Links to `/compare/` and one industry page. |
| 4 industry pages | "Why a specialised workspace?" before the CTA. |
| `/resources/faq/` | Three new answers; home answers follow the new home FAQ. |
| `/resources/glossary/` | Eight new terms (36 in total). |
| `/data-and-models/`, `/security/` | Statuses from the brief, health data standards, analytics with consent. |
| `llms.txt`, `sitemap.xml` | New sections and URLs. Every sitemap URL has `<lastmod>`. |

## Analytics and consent

- `source/src/js/consent.js` is inlined into every page by the build. `site/404.html` carries a hand-pasted copy; the build prints a warning if the two differ.
- Before a choice: no request to Google, no cookie. "Accept analytics" loads the tag. "Decline" stores the choice. "Cookie settings" in the footer reopens the bar. Declining after an earlier yes stops Analytics and removes its cookies.
- Events go through `window.cgTrack(name, params)`, which does nothing without consent: `generate_lead`, `demo_select_example`, `demo_step`, `demo_complete`, `cta_click`.
- The preview artifact has no analytics.

## The demo

- Copy: `DEMO` in `source/src/content.py`. Markup: `demo()` in `source/build.py`. Script: `source/src/js/demo.js`. Styles: the `demo` block in `site.css`.
- Picking an example plays it once through to the File step and then stops. This is how `demo_complete` can fire after a tab click. Clicking a step stops everything at that step.
- On phones the feed is a short window on the newest messages, with "Show all" above it.

## Pilots: one switch

`PILOTS_PUBLIC` in `source/src/content.py` is `False`, because permission is not confirmed yet.

- While it is `False`: `/customers/` is built with `noindex`, and it is left out of the nav, the footer, the sitemap and `llms.txt`.
- The home "Pilots" section stays visible and names both companies, as the brief asks (rule 6). **If permission is not in writing, remove that section before the branch goes live**, or do not merge yet.
- Set it to `True` and rebuild to list the page everywhere.

## Compare pages: what was checked

Facts about other products were checked against their own public pages on **2 October 2026**. Where the brief and the public pages differed, the text follows the public pages:

| Brief | Now | Why |
| --- | --- | --- |
| Dust: "100+ tools" | "70+ connectors" | Dust's home page says 70+ connectors. |
| Dust table: "Human steps in workflows" | "Approval per tool" | Dust describes approval set per tool. |
| Dust table: life-science models "Via plugins" | "Via connectors" | Dust's word is connectors. |
| Grok: "Team Bots let a whole team share bots…" | "A Team Bot lets a whole team share one Bot… It is in public beta." | The docs describe one shared Bot, in public beta. |
| Grok: "A plugin catalog" | "A plugin Marketplace" | The vendor's word. |
| Grok table: models "xAI" | "Grok models" | The vendor now signs as SpaceXAI. |
| Grok: "…several providers, including xAI, so…" | "…several providers, so…" | Same reason. |
| ChatGPT: "Custom rules decide…" | "Custom rules let you set…" | The rules are optional instructions set by the user. |
| ChatGPT: "…Slack or Teams" | "…Slack or Microsoft Teams" | Full product name. |
| Hub: "connect to thousands of apps" | "connect to many apps" | Only one of the three products states thousands. |

Not checked one by one: the short table cells that describe other products in general terms ("General plan step", "Per answer", "General writing", "Via plugins", "Always-on agents: Yes" for Dust). They are the brief's wording. A lawyer should look at them with item 10.

## Decisions made while building

- **Eyebrows are not printed.** The current design prints section titles only, so the eyebrows in the brief stay in the source as before. **Ledes are printed** where the brief gives one for a new or changed section, because those sections need the text.
- **Meta descriptions.** Every new or changed page has a description of 140 to 155 characters (the limit was 160 until October 2026; see "Search and speed" at the top). Pages the brief said to keep (solutions, industries and a few others) still have their old, shorter descriptions.
- **Encryption at rest** is set to "In progress", following the deck. The security diagram caption says so too.
- **The privacy policy** also got one line each in sections 2 and 3 (analytics data, and consent as the legal basis), so it agrees with the new section 7.
- **Inactive story steps are less dim** (68% instead of 42%, and their number uses the lighter grey). At 42% their text missed AA contrast, which the acceptance checks ask for.
- **"Which AI models do the agents use?"** on the FAQ page is replaced by the brief's "Which AI models does Cytogent use?", which answers the same question.

## Checks

`make.sh` runs `python3 tools/seo_check.py` on every build (no browser, no server; see the README). The others run from `source/`, with `dist/` served on port 8765 (`python3 -m http.server 8765 --directory dist`):

- `python3 verify_all.py`: contrast, one H1, heading order, title and description length, canonical, JSON-LD, links and anchors, phone overflow, reduced motion, console errors.
- `python3 tools/dg_layout_check.py`: every diagram at four widths. The only findings left are tags in the "scattered files" diagram passing each other while they move, which is the animation itself.
- `python3 tools/v2_check.py`: v2 acceptance checks (unique titles and descriptions, sitemap and `llms.txt` coverage, JSON-LD types, no request to Google before consent on any page).
- `python3 tools/shots_docs.py`: renews `docs/screenshots/`.
- `source/verify.py` was missing from the repository (it is imported by `verify_all.py`). It is added again.

Results on the final build (2 October 2026):

| Check | Result |
| --- | --- |
| `verify_all.py`, 27 pages | All passed |
| `dg_layout_check.py`, 192 diagram sizes | Only the known "scattered files" animation findings (49). Two older findings on phones (flow, encrypt) are fixed. |
| `v2_check.py` | All passed. Four kept descriptions are 135 to 139 characters. |
| Lighthouse, Home, mobile | Performance 92, accessibility 100, best practices 100, SEO 100. Measured with gzip on, as the host serves it. Without compression (plain `http.server`) performance reads 78; the old site read 82 the same way and 92 with gzip. |
| Consent | No request to Google before "Accept analytics" on any page, including `404.html`. |
| `generate_lead` | Fires once, only when the request was sent. |

---

# Earlier handoff: v3, the full site (22 pages)

## Problem

The home page was approved, but the other 21 pages did not exist yet. They needed the same look: a title with a cell animation in the hero, then Kilogent-style icons and animated diagrams in the sections.

## Solution

Every inner page opens the same way as home: a short title, one or two buttons, and one part of the same Cytogent cell behind it, with the animation that part does. The text scrolls away at once, the cell stays on a fixed layer and fades, and the next section slides over it. The sections below use squircle icon tiles that draw themselves in, plus 12 new animated diagrams drawn in the Kilogent style: people are circles, agents are squircles, models are chips and documents are cards.

## Outcome

22 pages with real URLs, one HTML file per route, and a navigable preview where every link works. All checks pass on every page, on desktop, on a phone and with reduced motion: AA contrast, one H1, no heading skips, meta lengths, JSON-LD, no broken links or anchors, no horizontal scroll on a phone, no console errors. Each page also has its own Open Graph image.

---

## The pages

| Route | Hero: part of the cell · what it does | Sections |
| --- | --- | --- |
| `/` | whole cell · explodes as you scroll | unchanged |
| `/platform/` | receptor to nucleus · a signal travels | project board · model routing · request → result (scroll-driven) · data, models, protocols · connectors hub |
| `/data-and-models/` | vesicles · labelled cargo | 6 dataset collections · 3 trained models with validation charts · 5-step curation · your data |
| `/security/` | whole membrane · outside particles turned back, keyed one passes | data handling (encryption diagram) · access control (roles diagram) · compliance · statement · FAQ |
| `/about/` | whole cell · at rest | the definition, word for word · people and agents around one project · 4 principles · partnered with Kilogent (its animated mark, large, no box) · contact: info@cytogent.com |
| `/resources/` | nucleus · readers on the threads | 6 hub cards · 3 top questions |
| `/resources/faq/` | chromatin · readers | 17 questions in 4 groups, side navigation, FAQPage schema |
| `/resources/glossary/` | mitochondrion · at rest | 28 terms A–Z, letter index, DefinedTermSet schema |
| `/request-access/` | receptor · the keyed particle passes | 2-line subtitle (reply within 5 working days) · 3 type cards with Institute chosen and its form open · form per type (v1 fields), validation, success state |
| `/terms/`, `/privacy/` | Golgi / membrane · at rest | v1 draft text, marked as under legal review |
| 7 × `/solutions/…` | nucleus · mitochondrion · ribosomes · chromatin cut · division · Golgi packing · vesicle leaving | what it does + the workflow diagram · three agents (team diagram) · what you get · 3 FAQs · related workflows |
| 4 × `/industries/…` | molecules binding · division · vesicles · Golgi | today vs with Cytogent (scatter diagram) · workflows used · one example project (pipeline diagram) · data rules with statuses |

## Latest changes

- **Every diagram checked for fit, on every page, at four widths.** A new check (`source/tools/dg_layout_check.py`) finds each diagram on all 22 pages at 1440, 1024, 768 and 390 px (181 different sizes), draws it through a full animation cycle, and reports text that leaves the frame, text or chips that overlap each other or an icon, titles wider than their card, and lines drawn over things they do not connect. It started with 146 kinds of problems; now none are left except tags in the "scattered files" diagram brushing past each other while they fly into the project, which is the animation itself.
- **Fixes, among others:** lines no longer show through people, agents, chips or badges (they all have a solid base now); the clinical-trial phase labels sit on two short lines and never touch; "draft · support · review" sits beside or under the cohort, never on it; the protein candidate card is sized to its three chips and the fold scales to the room it has; "Claim 1 · independent" fits its card and the claim cards no longer touch; the patent result and the "novelty argued" line have their own rows; chips with a dot are measured with the dot; rows of chips wrap instead of running off the edge; the question card in the story fits its text; the team diagram's handoffs no longer cross the agent names; the example-project path on a phone goes round the side instead of through the names; the security roles move under the "no crossing" line when there is no room beside it; module and tag labels only show when they fit whole.
- **Story frame:** the white status pill in the corner of the "Follow a single question" frame is removed (it covered the diagram).
- **Request access: the form title is now a standard section heading** (an H2 in the same style as "About your organization"): "Select the option that fits you and fill out the request form". It sits on one line from tablet width up and wraps into two balanced lines on a phone. The three type cards are still grouped under it for screen readers.
- **Home: the "Every claim points back to its source" section is removed.** To keep the dark and sunken bands alternating, the "Follow a single question" story now sits on the sunken band and "Not another chat window" on the dark band. Its unused styles are removed too.
- **Fixed: empty diagram box in the preview.** The "three steps" diagram on the home page (and any diagram) stayed empty after you opened another page and came back. The page script marked each drawn canvas with an attribute, and the preview kept a copy of the home page that already had that mark. Drawn canvases are now tracked in memory, the preview keeps a clean copy of the home page, and a new page now opens at the top at once, with no long scroll animation. Checked by opening all 22 pages twice and making sure every diagram draws.
- **Phone menu** rebuilt as a standard full-height menu: 20 px side space, 56 px rows in the same order as the desktop bar, Solutions and Industries fold open with a chevron, the current page is marked in violet (its group opens by itself), and a full-width Request access button sits at the bottom. The burger turns into an X, the page behind is locked, Escape closes it and returns focus to the burger, Tab stays inside the menu, a link closes it, and it closes if the window grows to desktop width.
- **Desktop bar**: labels never wrap ("Data & models" stays on one line) and the spacing is a little tighter between 1080 and 1279 px. Solutions or Industries is marked when you are on one of its pages.
- **Request access**: the hero has a 2-line subtitle: "Tell us who you are and what you plan to do. / We process every request within 5 working days and send you feedback." The form title is "Select the option that fits you and fill out the request form." Institute is chosen when the page opens and its form is already open (this also works without JavaScript); `?type=` still picks another type. The Back button and the "What happens next" section are removed. The success message, the form note, the meta description and the FAQ answer now say 5 working days.
- **About**: the Kilogent mark stands on its own: no box around it and no "Kilogent" word under it. It still moves and still links to kilogent.com. The unused Bricolage font is removed.

## New diagrams (`source/src/js/diagrams.js`)

`team` (solutions: you ask → Reader, Analyst and Writer take turns → cited outputs → you sign off), `scatter` (industries: scattered files pulled into one project), `pipeline` (industries: stages with owners, the record fills in), `bench` (platform: project board), `routing` (each task to its model, with a log), `cascade` (request → access check → agents → cited result, driven by the steps as you scroll), `hub` (connectors), `models` (validation drawn as charts, with no numbers), `curation` (a dataset gains its tags), `encrypt` (TLS tunnel and managed keys), `roles` (owner, editor and viewer), `circle` (people and agents around one project). `team`, `scatter` and `pipeline` read their labels from `data-cfg`, so each page draws its own version.

Each one has a square layout for phones and a text description (`aria-label`), and shows a still frame under reduced motion.

## Icons

42 line icons on a 24 px grid, shown in squircle tiles (the Kilogent agent shape) in the six brand hues. Every stroke draws itself in when its card appears.

## Preview

The published artifact holds all 22 pages in one file. Links switch pages inside the preview, and the back button works. The deployable site in `site/` uses real paths instead.

---

## Please check before launch

1. **Security statuses** come from v1 as written (for example: audit log in progress, MFA in progress, SOC 2 planned). Nobody at WelloWork AB has confirmed them yet.
2. **Request form**: nothing is sent yet. It validates and shows the success state, then logs the answers to the browser console. It must POST to an endpoint owned by WelloWork AB.
3. **Terms and Privacy** are v1 drafts and need a lawyer.
4. **Product claims carried over from v1**: the connectors (ELN, LIMS, storage, Git, chat, SSO, reference manager), the dataset categories and the three trained models. Confirm they match what exists.
5. **Illustrative numbers**: the platform project board shows "42 sources" and "1,204 samples" (from v1), and the home diagrams show example metrics. These are examples, not results.
6. **Domain**: set in `source/src/content.py` (`origin`). The sitemap, canonicals and OG images use it.

## Files

| Folder | What it is |
| --- | --- |
| `site/` | The deployable site: 22 `index.html` files, `js/`, `fonts/`, `img/`, 22 `og-*.jpg`, `sitemap.xml`, `robots.txt`, `llms.txt`. Push to any static host. |
| `source/` | The build. Home copy is in `src/content.py`, inner-page copy in `src/pages.py`, styles in `src/css/site.css`, the cell in `src/js/cell.js`, the diagrams in `src/js/diagrams.js` and behaviour in `src/js/app.js`. Run `./make.sh`, then `verify_all.py` and `tools/dg_layout_check.py` against a local server. |
| `screenshots/` | `desktop/` and `mobile/` full pages for all 22 routes, plus contact sheets of the heroes and diagrams. |
