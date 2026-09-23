# Cytogent v3 — the full site (22 pages)

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
