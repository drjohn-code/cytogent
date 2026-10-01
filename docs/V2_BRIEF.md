# Cytogent website v2: build brief for Claude Code

Put this file in the repo at `docs/V2_BRIEF.md`. Read all of it before you change any code.

---

## 0. Summary

**Problem.** The site says what ChatGPT dots, Grok Bots and Dust also say ("humans and agents in one workspace"). It does not show why a research team should choose Cytogent.

**Solution.**
- Keep those claims. They are true for us too.
- Add a live product demo right after the hero, like kilogent.com.
- Add the research brief idea and the idea that agents give tasks to people.
- Add a fair "if you have to choose" comparison, new compare pages, pilots and the team.
- Add Google Analytics, loaded only after cookie consent.

**Outcome.** A visitor understands in 10 seconds what Cytogent does better for research. The site also ranks for comparison searches.

---

## 1. Rules (read first)

1. **Do not change the design system.** Use the tokens in `source/src/css/site.css` as they are.
   - Colours, fonts (Geist, Geist Mono), radii (20 / 10 / pill), max width 1200, gutters, buttons, eyebrows, band alternation, motion ease and timings all stay.
   - New components are built only from existing tokens and existing patterns (cards, pills, icon tiles, `.cmpv` table, steps, `shead`).
   - No new colours or fonts. Status colours come from `--done`, `--progress`, `--planned`.
2. **Keep the home hero exactly.** Keep the `cell.js` canvas, the scroll-driven break-apart, the fixed stage, the scrim and the poster fallback. Keep every inner-page hero (each zooms into one part of the same cell).
3. **Keep the diagram language from `diagrams.js`.**
   - People are circles, agents are squircles, models are chips, documents are cards.
   - Every new or changed diagram needs a phone layout, an `aria-label`, and a still frame under reduced motion.
4. **The site is generated.**
   - Home copy lives in `source/src/content.py`. Inner-page copy lives in `source/src/pages.py`. Templates are in `source/build.py`.
   - Run `cd source && ./make.sh` to rebuild `site/`. Never hand-edit `site/*.html`.
   - The one exception is `site/404.html`, which is hand-written and excluded from rsync.
5. **Headline keyword pattern.** In this brief, `<kw>word</kw>` marks the one accent word. Convert it to the existing markup (`<span class="kw">…</span>`, with `nobr` where the current code uses it).
6. **Claims.**
   - Do not invent features.
   - Anything marked **[CONFIRM]** stays in the build, but add it to the list in section 14 and leave an HTML comment `<!-- CONFIRM: … -->` next to it.
   - Every made-up example number or name gets the visible label "Illustrative example".
7. **Work in phases (section 13).** After each phase, rebuild, run `source/verify_all.py` and `source/tools/dg_layout_check.py`, and commit.
8. **Writing style.** Use the copy in this brief word for word, unless it breaks a layout. If it does, shorten it and keep the meaning. Write in sentence case with plain words, like the current site.

---

## 2. Global changes

### 2.1 Google Analytics 4 with cookie consent (EU rules)

The company and the visitors are in the EU, so analytics may only run after the visitor says yes. Today the privacy page says "no third-party trackers", so the policy text must change too (section 11).

**Use this tag exactly.** Our snippet was cut off, so the `config` line and closing tag are added here:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-H7WJPJ2WSP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-H7WJPJ2WSP', { allow_google_signals: false, allow_ad_personalization_signals: false });
</script>
```

**How to load it:**
- Load the tag above only after consent ("basic" consent mode). Before consent, nothing from Google loads.
- Put a small inline script in `page()` in `build.py`, and also in `site/404.html`. It does three things:
  1. It reads `localStorage['cg-consent']`. Possible values are `granted` and `denied`; a missing key means not asked yet. Wrap every storage call in try/catch.
  2. If the value is `granted`, it injects the tag above: the `<script async src>` plus the inline config.
  3. If the key is missing, it shows the cookie banner.
- Add a tiny wrapper `window.cgTrack(name, params)` that calls `gtag('event', …)` only when consent is `granted`. Otherwise it does nothing.
- Do not add analytics to the preview `artifact.html`.

**Cookie banner:**
- A fixed bar at the bottom, max width 1200, `--ink-800` background, `--line-dark` border, radius `--r`. Keep it clear of `env(safe-area-inset-bottom)`.
- It must not cover the main CTA on phones: compact, at most 2 lines of text.
- Text: "We use Google Analytics to see which pages help visitors. It sets cookies only if you say yes. [Privacy policy](/privacy/#cookies)"
- Buttons: **"Accept analytics"** (primary) and **"Decline"** (outline). They have equal size and weight, and there is no pre-selected choice.
- Accept sets `granted` and loads the tag. Decline sets `denied`.
- Keyboard: focusable, Escape does not dismiss without a choice, and focus returns to the page after a choice.
- Add a footer link **"Cookie settings"** (Company column). It reopens the banner.

**Events.** Call them through `cgTrack`:

| Event | When | Params |
| --- | --- | --- |
| `generate_lead` | request form success | `form_type`: individual / institute / hospital |
| `demo_select_example` | user picks a demo example | `example`: resistance / trial / crispr |
| `demo_step` | user clicks a demo step | `example`, `step` |
| `demo_complete` | demo reaches the File step after a user action | `example` |
| `cta_click` | any "Request access" button | `location`: hero / nav / cta / compare / … |

`vercel.json` has no Content-Security-Policy today. If you add one later, allow `https://www.googletagmanager.com` and `https://*.google-analytics.com`.

### 2.2 New definition (word for word)

Use it in the home FAQ answer "What is Cytogent?", on `/about/`, in `llms.txt` and in JSON-LD `description`. Replace `DEFINITION` in `content.py`:

> Cytogent is an agentic workspace for life science research. Scientists write what they want to find out; Cytogent turns it into a research brief, and AI agents and people plan and do the work together across literature, in-silico studies, protein design, CRISPR, clinical trials, and regulatory and patent documents. Every result is cited and signed off.

Footer tagline (replaces the current one): "An agentic workspace for life science research. Scientists and AI agents work together, from research brief to cited, signed result."

### 2.3 Navigation and footer

**Desktop bar:** Platform · Solutions ▾ · Industries ▾ · Compare · Data & models · Security · About · [Request access]
- "Resources" moves to the footer and stays in the phone menu.
- Keep the rule that labels never wrap. Re-check spacing at 1080–1279 px.

**Phone menu:** same order, plus Customers and Resources before the button.

**Footer columns:**
- Product: Platform · Data & models · Security · Compare · Request access
- Solutions: unchanged
- Industries: unchanged
- Company: About · Customers · Resources · FAQ · Glossary · Terms · Privacy · Cookie settings

### 2.4 Calls to action

- One action name everywhere: **"Request access"**, linking to `/request-access/`. Do not add a second name for the same action.
- The home hero's secondary button is **"See an example"**, linking to `#demo`.

### 2.5 SEO rules for every page

- Title of 60 characters or less, ending in `| Cytogent` where it fits. Meta description of 140–160 characters. Both are unique.
- One H1, no heading skips, canonical URL, OG and Twitter tags.
- New OG images for new pages: add them to `hero_of()` so `og.py` renders them.
- Add every new URL to `seo_files()`, which feeds the sitemap and `llms.txt`. Add `<lastmod>` with the build date to every sitemap URL.
- Add BreadcrumbList JSON-LD to every new page, and FAQPage JSON-LD wherever a page has an FAQ.
- Internal links:
  - Each solution page links to `/compare/` and to one related industry page.
  - The home compare section links to `/compare/`.
  - Each compare page links to the 2 most relevant solution pages.
- In the home `SoftwareApplication` JSON-LD, add `featureList`: `["Research brief", "AI agents and human tasks on one board", "Literature and evidence with citations", "In-silico studies", "Protein studies and design", "CRISPR guide design and off-target review", "Clinical trial documents", "Regulatory documents (IND/CTA, IVDR)", "Patent prior art and claims", "Health data standards (openEHR, FHIR, OMOP, SNOMED CT)", "Audit log and scientist sign-off"]`.

**Keyword map.** Use these naturally in the H1, the first paragraph, one H2 and the meta description. Do not stuff them.

| Page | Primary keyword | Secondary |
| --- | --- | --- |
| `/` | AI agents for life science research | AI research assistant for scientists, agentic research workspace |
| `/platform/` | agentic research platform | AI research planning, research brief |
| `/compare/` | ChatGPT alternative for scientists | AI agent workspace comparison |
| `/compare/chatgpt/` | Cytogent vs ChatGPT | ChatGPT for life science research, ChatGPT dots |
| `/compare/grok/` | Cytogent vs Grok Bots | Grok Bot alternative for research |
| `/compare/dust/` | Cytogent vs Dust | Dust alternative for research teams |
| `/customers/` | AI pilot CRISPR diagnostics | AI clinical trial planning |
| solution pages | keep current targets | add "research brief" once on each page |

---

## 3. New component: the live brief demo (`#demo`)

This is the main new piece. It sits directly under the home hero, like the board demo right after the hero on kilogent.com. Build it as HTML + CSS + a small vanilla JS file, not canvas, so the text is real and readable.

### 3.1 Files

- Copy: add `DEMO` (list of 3 examples, content in 3.5) to `source/src/content.py`.
- Markup: a `demo(examples, mode)` function in `build.py`.
  - `mode="full"`: tabs plus autoplay. Used on Home.
  - `mode="single"`: one example, no tabs. Used on Platform.
- Script: `source/src/js/demo.js`. Copy it to `dist/js/` in `build()`, and load it only on pages that contain the demo. No libraries, no network.
- Styles: add to `site.css` under a `/* demo */` block, using tokens only.

### 3.2 Layout

**Desktop (1024 px and up).** One framed panel, `--ink-800`, radius `--r`, border `--line-dark`.

```
[ Drug resistance ] [ Clinical trial ] [ CRISPR diagnostic ]        ← example tabs (pills)
┌──────────── feed (40%) ─────────────┬──────────── stage (60%) ─────────────┐
│ (AB) Dr. Berg · 09:00               │  Research brief · RB-014   [Signed]  │
│ "Our lung cancer cell line…"        │  Question …                          │
│ [rna-seq_wk0_wk6.csv] [variants.vcf]│  Hypothesis …                        │
│ ◇ Planner · 09:01                   │  …                                   │
│ "Three questions before I plan."    │  — or the board (3 columns) —        │
│  1 What counts as a good answer?    │  — or the file card —                │
│    [Top 3 causes, each with a test] │                                      │
│ ✓ Brief signed by Dr. Berg · 09:04  │                                      │
└─────────────────────────────────────┴──────────────────────────────────────┘
 ● Write ─── ● Ask ─── ● Brief ─── ● Work ─── ○ File                    ← stepper
 Illustrative example. Names, data and numbers are made up.
```

- **Feed (left):** a chat-like timeline. People have circle avatars with initials. Agents have squircle tiles with their icon (Planner, Reader, Analyst, Writer), using the same icons as the solution-page team diagrams. Small meta (name · time) uses Geist Mono and `--on-dark-3`.
- **Stage (right)** changes with the step:
  - Write and Ask show a "brief taking shape" card, where fields appear as answers arrive.
  - Brief shows the full brief card with a "Signed" pill (`--done`).
  - Work shows the board.
  - File shows the file card.
- **Board:** columns To do / In progress / Done.
  - Each task card shows: task ID (mono), title, owner (circle for a person, squircle for an agent), and a model chip for agents.
  - A person task shows the pill "Person" and, where given, "Protocol attached".
  - A task waiting for sign-off shows the pill "Needs Dr. X" in `--progress`.
- **File card:** a document card with title, meta line, a section list, three citation markers [1] [2] [3], and export chips.

**Tablet (720–1023 px).** Feed above the stage, both full width.

**Phone (below 720 px).**
- Tabs scroll inside their own container, never the page.
- The feed shows the last 3 messages, with the earlier ones collapsed under a "Show all" link.
- The stage sits below. The board columns stack (To do, In progress, Done).
- No horizontal page scroll at 390 px.

### 3.3 Behaviour

- **Steps:** Write → Ask → Brief → Work → File.
- **Autoplay** starts when the panel is at least 40% visible (IntersectionObserver).
  - About 3.5 s per step. Hold on File for 6 s, then move to the next example.
  - Feed messages fade in (`--t-fast`). No typing effect.
- **Stopping autoplay:**
  - Pause on hover or focus inside the panel, or when the tab is hidden.
  - Stop for good after the first user click (on a tab or a step).
- **Reduced motion:** no autoplay. Show example 1 at the File step with the whole feed visible. Tabs and steps still work.
- **Accessibility:**
  - Tabs use `role="tablist"` / `tab` / `tabpanel` with arrow-key support.
  - Stepper items are buttons with `aria-current="step"`.
  - The feed has `aria-live="polite"` only after a user action (off during autoplay).
  - All content is in the DOM, so search engines and screen readers read it.
  - Add a `<noscript>` with example 1's brief.
- **Analytics:** `demo_select_example`, `demo_step` and `demo_complete` (section 2.1).

### 3.4 Section copy on Home (band: sunken, `band--cream`)

- Eyebrow: See it work
- H2: From a rough idea to a signed <kw>plan</kw>.
- Lede: Pick an example. Watch Cytogent ask the right questions, write the brief, split the work between agents and people, and build the file.
- [demo, `mode="full"`]
- Under the panel, left: "Illustrative example. Names, data and numbers are made up." (mono, small)
- Under the panel, right: text link "See how the platform works", linking to `/platform/`.

### 3.5 Demo content (exact)

Agent names: **Planner** (asks and plans) [CONFIRM name], **Reader**, **Analyst**, **Writer**.

Model chips:
- Planner, Reader: long-context LLM
- Analyst: code model, or structure model / design model where noted
- Writer: drafting LLM

#### Example 1. Tab label: "Drug resistance". `id: resistance`

**Feed**

1. **Dr. Berg** (AB) · 09:00: "Our lung cancer cell line stopped responding to a KRAS inhibitor after six weeks. Why, and what should we test next?" Attachments: `rna-seq_wk0_wk6.csv`, `variants.vcf`
2. **Planner** · 09:01: "Three questions before I plan."
   - "What counts as a good answer?" → answer chip: "Top 3 causes, each with one test"
   - "What can the lab do in the next four weeks?" → "Two CRISPR knockouts, no animal work"
   - "What do we compare with?" → "The parental line"
3. Event · 09:04: "✓ Brief signed by Dr. Berg"
4. **Planner** · 09:05: "I split the brief into 6 tasks: 4 for agents, 2 for people."
5. **Analyst** · 11:40: "The week-6 sample has a mutation at a known resistance site. Flagged for review."
6. **Writer** · 14:12: "Report v0.2 is ready: 3 causes, 3 tests, 18 citations."

**Brief card:** "Research brief · RB-014", pill "Signed"

| Field | Text |
| --- | --- |
| Question | What causes acquired resistance to the KRAS inhibitor in line LC-7R? |
| Hypothesis | A second mutation in KRAS, or a bypass pathway. |
| Data | RNA-seq at week 0 and week 6, variant list, dose–response curves. |
| Control | Parental line LC-7. |
| Success | Top 3 causes, each with evidence and one test. |
| Limits | Two CRISPR knockouts. No animal work. |
| Owner | Dr. A. Berg · signed 09:04 |

**Board**
- To do:
  - CG-105 "Order guides for the top 2 targets". Owner: Jonas, lab manager. Pill: Person.
- In progress:
  - CG-101 "Read 40 papers on KRAS inhibitor resistance". Reader, long-context LLM.
  - CG-102 "Compare variants with known resistance sites". Analyst, code model.
  - CG-104 "Approve the knockout plan". Dr. Berg. Pill: Needs Dr. Berg.
- Done:
  - CG-100 "Brief signed". Dr. Berg.
  - CG-103 "Dock the inhibitor into the mutant pocket". Analyst, structure model.

**File card:** "Resistance report v0.2"
- Meta: 3 causes · 3 tests · 18 citations
- Sections: 1 Summary · 2 Evidence table · 3 Docking results · 4 Proposed tests · 5 Bench protocol: CRISPR knockout
- Line: "Every claim links to its source. [1] [2] [3]"
- Export chips: ELN · Word · PDF

#### Example 2. Tab label: "Clinical trial". `id: trial`

**Feed**

1. **Dr. Lind** (ML) · 09:00: "We have a skin patch for vitiligo. Help us plan the first study in people." Attachments: `preclinical_safety.pdf`, `IB_draft_v2.docx`
2. **Planner** · 09:01: "Three questions before I plan."
   - "Which phase, and where?" → "Phase I/IIa, two sites in Sweden"
   - "What matters most?" → "Safety first, then repigmentation at week 24"
   - "Who can join?" → "Adults with stable non-segmental vitiligo"
3. Event · 09:06: "✓ Brief signed by Dr. Lind"
4. **Planner** · 09:07: "I split the brief into 7 tasks: 4 for agents, 3 for people."
5. **Analyst** · 13:20: "Sample size draft: 24 participants. Assumptions are listed for the statistician."
6. **Writer** · 16:05: "Protocol v0.3 is drafted against the SPIRIT checklist, with 31 citations."

**Brief card:** "Research brief · RB-022", pill "Signed"

| Field | Text |
| --- | --- |
| Question | Is the patch safe, and does it show early repigmentation in adults with non-segmental vitiligo? |
| Design | Phase I/IIa, randomised, double-blind, vehicle-controlled. |
| Population | Adults aged 18 to 65 with stable non-segmental vitiligo. |
| Primary endpoint | Adverse events up to week 24. |
| Secondary endpoint | Change in F-VASI at week 24. |
| Sites and rules | Two sites in Sweden · EU CTR · ICH GCP. |
| Owner | Dr. M. Lind · signed 09:06 |

**Board**
- To do:
  - CG-207 "Book the ethics review meeting". Owner: Elin, study coordinator. Pill: Person.
- In progress:
  - CG-202 "Draft the protocol". Writer, drafting LLM.
  - CG-203 "Sample size and SAP draft". Analyst, code model.
  - CG-205 "Confirm site feasibility". Owner: site lead. Pill: Person.
  - CG-206 "Approve protocol v0.3". Dr. Lind. Pill: Needs Dr. Lind.
- Done:
  - CG-200 "Brief signed". Dr. Lind.
  - CG-201 "Review 25 trials of topical vitiligo treatments". Reader, long-context LLM.

**File card:** "Clinical trial application draft"
- Meta: Protocol v0.3 · SAP draft · CRF set · 31 citations
- Sections: 1 Protocol · 2 Statistical analysis plan · 3 Case report forms · 4 Gaps in the investigator's brochure · 5 Cover letter draft
- Line: "Every claim links to its source. [1] [2] [3]"
- Export chips: Word · PDF

#### Example 3. Tab label: "CRISPR diagnostic". `id: crispr`

**Feed**

1. **Dr. Nyberg** (SN) · 09:00: "We want a CRISPR test that finds high-risk HPV in cervical samples. Where do we start?" Attachment: `sample_overview.xlsx`
2. **Planner** · 09:01: "Three questions before I plan."
   - "Which HPV types first?" → "HPV16 and HPV18"
   - "Where will the test run?" → "In the clinic, from a self-collected swab"
   - "Which market first?" → "The EU, under IVDR"
3. Event · 09:05: "✓ Brief signed by Dr. Nyberg"
4. **Planner** · 09:06: "I split the brief into 6 tasks: 4 for agents, 2 for people."
5. **Analyst** · 12:30: "12 candidate guides designed. 4 pass the cross-reactivity check against 14 other HPV types."
6. **Writer** · 15:45: "The assay design report and an IVDR technical file outline are ready."

**Brief card:** "Research brief · RB-031", pill "Signed"

| Field | Text |
| --- | --- |
| Question | Can a Cas12-based test detect HPV16 and HPV18 in self-collected swabs? |
| Targets | E6 and E7 regions of HPV16 and HPV18. |
| Compare with | A validated PCR test on the same samples. |
| Success | Sensitivity and specificity against PCR on banked samples. |
| Rules | Ethics approval for banked samples · IVDR. |
| Owner | Dr. S. Nyberg · signed 09:05 |

**Board**
- To do:
  - CG-306 "Run a limit-of-detection test on synthetic targets". Owner: lab technician. Pills: Person, Protocol attached.
- In progress:
  - CG-302 "Design guides for HPV16 and HPV18 E6/E7". Analyst, design model.
  - CG-304 "Outline the IVDR technical file". Writer, drafting LLM.
  - CG-305 "Approve the guide shortlist". Dr. Nyberg. Pill: Needs Dr. Nyberg.
- Done:
  - CG-300 "Brief signed". Dr. Nyberg.
  - CG-301 "Review 60 papers on CRISPR detection of HPV". Reader, long-context LLM.

**File card:** "Assay design report v0.1"
- Meta: 4 guides · 1 lab protocol · IVDR outline · 26 citations
- Sections: 1 Summary · 2 Guide shortlist and checks · 3 Lab protocol: limit of detection · 4 IVDR technical file outline · 5 Open questions
- Line: "Every claim links to its source. [1] [2] [3]"
- Export chips: ELN · Word · PDF

---

## 4. Home page `/` (full v2)

- **Title:** Cytogent — AI Agents for Life Science Research
- **Description:** Write your research goal in plain words. Cytogent turns it into a signed research brief, then AI agents and your team do the work, with every step cited.

Keep dark and sunken bands alternating in the order below. If a section moves, flip its band so the pattern stays.

### 4.1 Hero (keep the animation)

- H1: Where scientists and AI agents do research <kw>together</kw>.
- Support text (`.hero__support`): Write what you want to find out, in your own words. Cytogent turns it into a research brief you can sign. Then AI agents and your team plan and do the work, with every step cited.
- Buttons:
  - "Request access" (primary), linking to `/request-access/`. Track `cta_click` with `location: hero`.
  - "See an example" (outline, no arrow), linking to `#demo`.
- Small line under the buttons (`--on-dark-3`, 14 px): Runs on models from Anthropic, OpenAI, Google and xAI, plus life-science models. [CONFIRM: life-science models live]

### 4.2 Demo

As in section 3.4.

### 4.3 The research brief (new)

- Eyebrow: The research brief
- H2: You don't need the perfect <kw>prompt</kw>.
- Lede: A research question is not a prompt. It hides choices about controls, endpoints, sample size, ethics and regulation. Cytogent asks about them first, so agents plan from a brief your PI would sign.
- Three icon cards. Use existing icons from `ICONS` in `build.py`; add a new 24 px line icon only if none fits.
  1. **Write it your way**: Type the goal the way you would tell a colleague. Attach data if you have it.
  2. **Answer a few questions**: Cytogent asks only what changes the plan: data, what counts as an answer, limits and rules.
  3. **Sign the brief**: One page with the question, hypothesis, data, controls, endpoints, rules and owner. Agents plan from it, and every result links back to it.

### 4.4 People and agents (new)

- Eyebrow: People and agents
- H2: Agents plan the work and give work back to <kw>people</kw>.
- Lede: After you sign the brief, agents split it into tasks. Some go to agents. Some go to people: a lab run, a review, an approval. Results come back into the same record.
- Ticks:
  - Agents take the reading, analysis and drafting.
  - People get lab work, reviews and sign-offs, with the protocol attached.
  - New tasks appear as results come in.
  - Anything that leaves the project waits for a yes. [CONFIRM]
- Media: reuse the `bench` diagram from `/platform/`. Extend its cfg so one card is a person task, "Run qPCR on clone 4 · protocol attached", with a circle owner "Lab tech". Show it moving to Done and a result chip returning to the record.

### 4.5 Who it is for

Keep the current section and its four cards (it moves down from position 2).

### 4.6 How it works (now four steps)

- Eyebrow: How it works
- H2: From question to signed result in four <kw>steps</kw>.
- Steps:
  1. **Write**: Your goal in plain language. Attach data or connect your sources.
  2. **Brief**: Cytogent asks a few questions. You confirm and sign the research brief.
  3. **Work**: Agents and people do the tasks. Each step goes to the best model and is logged.
  4. **Decide**: Review cited results, sign off, and export to your notebook, LIMS or report.
- Update `HOW` in `content.py` and the `dg-how` diagram so it shows 4 steps: You → Planner → Reader, Analyst, Writer and a person → signed result. Update its `aria-label`.

### 4.7 Workflows

Keep "Seven workflows. One evidence trail." as it is.

### 4.8 Story: "Follow a single question through the workspace."

Keep, with these changes to `STORY`:
- Insert a new step 2 and renumber to 7 steps:
  - **"The brief is signed"**: "Cytogent asks which data to use, what counts as an answer and what the limits are. The PI signs a one-page brief."
  - Label: "1 brief · signed"
  - New visual `st_brief` in `diagrams.js`, in the same style: a person circle, the Planner squircle, a brief card filling in, a check mark.
- Change step "An edit is designed" text to: "Guide RNAs are designed and checked for off-targets. An agent creates a lab task for the bench team, with the protocol attached."
  - Label: "4 guides · 1 lab task"
  - Add one person circle receiving a task card to `st_edit`.
- Add the label "Illustrative example" to the story frame.

### 4.9 Why Cytogent (replaces "Not another chat window")

- Eyebrow: Why Cytogent
- H2: Keep your AI tools. Choose Cytogent for <kw>research</kw>.
- Lede: ChatGPT, Claude, Copilot and agent workspaces are great for general work. Cytogent does the same agent work, and is built for how research moves from question to file.
- Table: reuse `.cmpv`, 3 columns. Keep cell text short.
  - Column heads: "AI assistants (e.g. ChatGPT, Claude, Copilot)" | "Agent workspaces (e.g. ChatGPT dots, Grok Bots, Dust)" | "Cytogent"

| Row | AI assistants | Agent workspaces | Cytogent |
| --- | --- | --- | --- |
| Agents that work in the background | Some | Yes | Yes |
| One workspace for people and agents | Some | Yes | Yes |
| Connects to your apps and the web | Yes | Yes | Yes |
| Starts from a signed research brief | General plan step | General plan step | Built for research |
| Agents create lab tasks for people | Not built in | Approval requests | With protocol and owner |
| Life-science models built in | Via plugins | Via plugins | Built in [CONFIRM] |
| One cited trail to the final file | Per answer | Per task | Across 7 workflows |
| Trial, regulatory and patent documents | General writing | General writing | Templates and checks |
| Scientist sign-off in the audit log | Varies | Approval rules | Every checkpoint |
| Models from many providers | Varies | Varies | Yes, logged |

- Footnote (small, `--on-dark-3`): Examples are for orientation, based on public product information checked on [BUILD DATE]. Product names are trademarks of their owners.
- Link under the table: "See the full comparison", linking to `/compare/`. Track `cta_click` with `location: compare`.

### 4.10 Pilots (new)

- Eyebrow: Pilots
- H2: Two pilot studies, running <kw>now</kw>.
- Lede: Both turn a science finding into industry-ready work.
- Two cards. Reuse the `crispr` and `trials` solution diagrams as the card media.
  - **Cervixel**: CRISPR research for cervical cancer diagnosis. Tags: CRISPR & genome editing · Literature & evidence
  - **Eipha Biosciences**: Clinical trial for a vitiligo skin patch. Tags: Clinical trials, full cycle · Regulatory documentation
- Link: "Read about the pilots", linking to `/customers/`.
- [CONFIRM: written permission from both companies to be named]

### 4.11 Data and models

- Keep the section.
- Change the "Trained models" card text to: "Domain models for prediction and screening (variant effect, binding affinity, assay QC). Each shows its validation on its own card." Add the status pill "In progress" unless confirmed. [CONFIRM]
- Add one card in the same style: **Health data standards**: "Patient data is modelled with openEHR, exchanged with FHIR, mapped to OMOP for multi-site studies, and coded with SNOMED CT." [CONFIRM: status of each]
- Where the section lists literature sources, add ScienceDirect (full-text papers through Elsevier's API). [CONFIRM: licence]

### 4.12 Security

Keep the rows. Changes:
- Make "Encryption in transit and at rest" match reality. The pitch deck says in transit only. [CONFIRM]
- Add a row: "Analytics only with consent": "Google Analytics runs only if you accept it in the cookie banner." Status: Done.

### 4.13 Access

Keep the three doors. Under them, add one line: "Tell us what you want to find out. We reply within five working days with a first draft of your research brief." [CONFIRM]

### 4.14 FAQ (replace `FAQ` in `content.py`, in this order; this drives the FAQPage JSON-LD)

1. **What is Cytogent?**
   Cytogent is an agentic workspace for life science research. Scientists write what they want to find out, Cytogent turns it into a signed research brief, and AI agents and people do the work together, from literature and in-silico studies to trials, regulatory files and patents. Every result is cited. Cytogent is operated by WelloWork AB in Sweden.
2. **How is Cytogent different from ChatGPT, Claude or Copilot?**
   Keep them for everyday work. Cytogent uses the same kind of frontier models, but it is built for research. It starts from a signed research brief, gives lab tasks to people, runs life-science models, and keeps one cited trail from the first question to the final protocol, regulatory or patent file.
3. **How is Cytogent different from agent workspaces like ChatGPT dots, Grok Bots or Dust?**
   Those tools run always-on agents for any kind of work, and Cytogent does too. The difference is focus. Cytogent plans from a research brief, knows trial, regulatory and patent formats, records scientist sign-off at each checkpoint, and keeps every claim linked to a source you can open.
4. **What is a research brief?**
   A one-page plan you sign before agents start. It holds the question, hypothesis, data, controls, endpoints, limits, rules and owner. You write the goal in your own words, and Cytogent asks only the questions that change the plan. Agents plan from the brief, and every result links back to it.
5. **Can agents give tasks to people?**
   Yes. When a step needs hands or judgment, an agent creates a task for a person: a lab run with the protocol attached, a review, or an approval. Each task has an owner and a due date. When the person adds the result, it goes back into the same record for everyone to see.
6. **Who is Cytogent for?** Keep the current answer.
7. **Is my data used to train models?** Keep the current answer.
8. **How do I get access?**
   By request. There is no self sign-up and no free trial. Choose Individual, Institute or Hospital, and tell us what you want to find out. We read every request, reply within five working days, and set up a workspace with your permissions, starting from a first draft of your research brief.
9. **Is Cytogent a medical device?** Keep the current answer.

Move "What can the agents do?" and "Where is data hosted?" to the FAQ page only (section 9).

### 4.15 Final CTA

- H2: Bring your next <kw>question</kw>.
- Lede: Tell us what you want to find out. We set up the workspace and send you a first research brief.
- Button: Request access. Track `cta_click` with `location: cta`.

---

## 5. Platform page `/platform/`

- **Title:** Agentic Research Platform for Life Science | Cytogent
- **Description:** Write a goal, sign a research brief, and let AI agents and your team do the work. Each step goes to the best model, and every step is logged and cited.
- **H1:** One workspace from research brief to signed <kw>result</kw>.
- Hero: keep the cell view (receptor to nucleus, a signal travels).
- Hero sub: Agents and people work from the same brief, the same data and the same record.

**Sections, in order:**

1. **New.**
   - Eyebrow: Research brief
   - H2: Every project starts with a <kw>brief</kw>.
   - Lede: Write the goal in your own words. Cytogent asks what changes the plan, then writes a one-page brief for you to sign. Agents plan from it, and every result links back to it.
   - Content: the demo, `mode="single"`, example `resistance`.
2. **Keep "A shared bench for people and agents."**
   - New lede: Agents and people take tasks from the same board. Agents read, analyse and draft. People run the lab work, review and sign. Nothing leaves the project without a yes. [CONFIRM last sentence]
   - Bench diagram: same change as home section 4.4.
3. **Keep "The right model for each step."**
   - New lede: Reading goes to a long-context model, code to a code model, structures to a structure model, drafts to a drafting model. Every choice is logged, so you can see which model did what.
4. **"How a request becomes a result."** Now 5 steps. Update the `cascade` diagram to match.
   1. **You write the goal**: In plain words, with your data attached.
   2. **The brief is signed**: Cytogent asks a few questions. You confirm and sign.
   3. **Access is checked**: The workspace checks who asked and what they may see.
   4. **Agents and people work**: Tasks run in order, each logged with its model, inputs and owner.
   5. **The result is written back**: A cited result lands in the project for you to review and sign.
5. **Keep "Data, models and protocols, built in."** Add the "Health data standards" card and ScienceDirect, the same as home 4.11.
6. **Keep "Connects to the tools you already use."** Add a paragraph under the hub diagram:
   - H3: Use the AI you already trust
   - Text: Cytogent runs on models from Anthropic, OpenAI, Google and xAI. Agents also work in real tools through MCP connectors and browser access, not only in chat.
7. **CTA:** keep.

---

## 6. Compare hub `/compare/` (new page)

- **Title:** Cytogent vs ChatGPT, Grok Bots and Dust for Research
- **Description:** How Cytogent compares with AI assistants and agent workspaces for life science research: signed research briefs, lab tasks, science models and cited files.
- **H1:** How Cytogent compares for life science <kw>research</kw>.
- Hero: whole cell at rest (reuse the about-page view).
- Hero sub: Keep the AI tools you use today. This page shows when Cytogent is the better choice.
- Breadcrumb: Home › Compare

**Sections:**

1. **What general tools do well**
   - Eyebrow: What they do well
   - H2: General tools are good at general <kw>work</kw>.
   - Lede: ChatGPT, Claude and Copilot answer questions, write and code. Agent workspaces such as ChatGPT dots, Grok Bots and Dust run agents in the background, connect to thousands of apps and let teams share agents. Cytogent does this too.
2. **Where Cytogent goes further** (6 icon cards)
   - Eyebrow: Where Cytogent goes further
   - H2: Built for how research <kw>moves</kw>.
   - Cards:
     1. **A signed research brief**: Cytogent turns a rough idea into a one-page brief with question, controls, endpoints and rules. Agents plan from it.
     2. **Tasks for people, not only agents**: Agents create lab work, reviews and approvals for people, with the protocol attached. Results return to the record.
     3. **Science models built in**: Structure prediction, docking, protein design and CRISPR guide checks run inside the project. [CONFIRM]
     4. **One evidence trail**: Every claim links to a source you can open, from the brief to the final file, across all seven workflows.
     5. **Documents reviewers expect**: Protocol, CRF, SAP, CSR, IND/CTA, IVDR and patent claims are built from the same cited results.
     6. **Scientist sign-off on record**: Each checkpoint waits for a named person. The sign-off is saved in the audit log.
3. **Comparison table**
   - Eyebrow: Comparison
   - H2: Side by <kw>side</kw>.
   - Content: the home table (4.9), plus four rows:

| Row | AI assistants | Agent workspaces | Cytogent |
| --- | --- | --- | --- |
| Each project isolated from others | Varies | Varies | Yes |
| Your data never trains shared models | Depends on plan | Depends on plan | Never |
| EU data residency | Varies | Varies | In progress [CONFIRM] |
| Health data standards (openEHR, FHIR, OMOP, SNOMED CT) | Varies | Varies | Built in |

   - Same footnote as 4.9.
4. **How to use both** (steps)
   - Eyebrow: Use both
   - H2: Use each tool for what it does <kw>best</kw>.
   - Steps:
     1. **Keep your general tools**: Use ChatGPT, Claude or Copilot for email, code and slides.
     2. **Bring research to Cytogent**: Questions that need data, evidence, lab work and sign-off start here.
     3. **Export where your team works**: Send results to your notebook, LIMS, Word or PDF.
5. **Detailed comparisons** (3 link cards)
   - Eyebrow: Detailed comparisons
   - H2: Compare one tool at a <kw>time</kw>.
   - Cards: "Cytogent vs ChatGPT" → `/compare/chatgpt/` · "Cytogent vs Grok Bots" → `/compare/grok/` · "Cytogent vs Dust" → `/compare/dust/`
6. **FAQ** (FAQPage JSON-LD)
   1. **Is Cytogent better than ChatGPT?**
      For general work, ChatGPT is excellent. For life science research, Cytogent is the better fit: it starts from a signed research brief, gives lab tasks to people, runs life-science models, and keeps one cited trail into protocol, regulatory and patent files. Many teams use both, and Cytogent can run OpenAI models inside.
   2. **Can I use Cytogent together with ChatGPT or Claude?**
      Yes. Keep your general assistant for email, code and slides. Bring research questions to Cytogent. Cytogent uses models from Anthropic, OpenAI, Google and xAI inside the project, and you can export results to Word, PDF, your notebook or LIMS whenever your team needs them elsewhere.
   3. **Does Cytogent use the same AI models?**
      Partly. Cytogent routes reading, coding and drafting to frontier models from Anthropic, OpenAI, Google and xAI, and adds life-science models for structure prediction, docking and design. The difference is not only the model, but the brief, the tasks for people, the evidence trail and the sign-off around it.
7. **CTA**
   - H2: See it with your own <kw>question</kw>.
   - Lede: Tell us what you want to find out. We send you a first research brief.
   - Button: Request access

### 6.1 Rules for all compare pages

- **Be fair and checkable** (EU comparative advertising rules).
  - Never write "No" about a named product.
  - Every fact about another product must come from its public pages.
  - Add a "Last checked: [BUILD DATE]" line and a small "Sources" list with links at the bottom of each page.
- Re-check these sources on build day. If a fact changed, update the text.
  - OpenAI dots: https://betanews.com/article/openai-dots-agents-chatgpt/
  - ChatGPT Space: https://venturebeat.com/technology/openai-launches-dots-always-on-ai-agent-coworkers-and-chatgpt-space-where-they-can-collaborate-with-human-teams
  - Grok Bot and Team Bots: https://releasebot.io/updates/xai and https://x.ai
  - Dust: https://dust.tt and https://dust.tt/blog/series-b-multiplayer-ai
- Prefer the vendors' own pages over news articles when you link.

---

## 7. Compare pages (new; same template)

**Template:**
1. H1 and hero (whole cell at rest).
2. "Short answer" (lede-sized paragraph).
3. "What [X] does well": ticks with facts.
4. "Where Cytogent goes further": 5 ticks.
5. A 2-column `.cmpv` table ([X] | Cytogent).
6. "Use them together": a paragraph.
7. FAQ (2 items, FAQPage JSON-LD).
8. Sources and last-checked line.
9. CTA.

Breadcrumb: Home › Compare › [X].

### 7.1 `/compare/chatgpt/`

- **Title:** Cytogent vs ChatGPT for Life Science Research
- **Description:** ChatGPT, dots and Space are strong general tools. See where Cytogent goes further for research: signed briefs, lab tasks, science models and cited files.
- **H1:** Cytogent vs ChatGPT for life science <kw>research</kw>.
- **Short answer:** ChatGPT is a strong general assistant, and with dots and ChatGPT Space it now runs always-on agents in a shared workspace. Choose Cytogent when the work is research. It starts from a signed research brief, gives lab tasks to people, and builds cited trial, regulatory and patent files.
- **What ChatGPT does well:**
  - Dots are always-on agents. Each works on its own cloud computer and keeps working between conversations.
  - Dots connect to more than 4,000 apps through plugins, and reply in ChatGPT, Slack or Teams.
  - ChatGPT Space is a shared workspace where teammates, ChatGPT and dots work on the same pages.
  - Custom rules decide what a dot may do alone and when it must ask first.
- **Where Cytogent goes further:**
  - A signed research brief before any agent starts.
  - Lab tasks for people, with the protocol attached and the result returned to the record.
  - Life-science models for structure, docking, design and CRISPR guide checks. [CONFIRM]
  - Templates and checks for protocol, CRF, SAP, CSR, IND/CTA, IVDR and patent claims.
  - One cited trail and a scientist sign-off at every checkpoint.
- **Table (ChatGPT | Cytogent):**

| Row | ChatGPT | Cytogent |
| --- | --- | --- |
| Always-on agents | Yes, dots | Yes |
| Shared workspace | Yes, Space | Yes |
| Starts from a research brief | General plan step | Signed, research-specific |
| Lab tasks for people | Approval rules | With protocol and owner |
| Life-science models | Via plugins | Built in [CONFIRM] |
| Cited trail to the final file | Per answer | Brief to final file |
| Trial, regulatory, patent documents | General writing | Templates and checks |
| Models | OpenAI | Anthropic, OpenAI, Google, xAI |

- **Use them together:** Many teams keep ChatGPT for daily work. Cytogent can run OpenAI models inside a research project, so you keep the model you like and add the brief, the lab tasks and the evidence trail around it.
- **FAQ:**
  1. **Can ChatGPT dots do life science research?**
     Dots can research, draft and use apps for many kinds of work, and they are getting better fast. Cytogent adds what research teams need around that: a signed research brief, life-science models, lab tasks for people, scientist sign-off on record, and one cited trail into trial, regulatory and patent files.
  2. **Do I need to stop using ChatGPT?**
     No. Keep ChatGPT for everyday work. Use Cytogent for research projects that need data, evidence, lab work and sign-off. Cytogent can run OpenAI models inside the project, and results export to Word, PDF, your notebook or LIMS, so the two tools sit side by side.

### 7.2 `/compare/grok/`

- **Title:** Cytogent vs Grok Bots for Life Science Research
- **Description:** Grok Bots run always-on AI teammates on a cloud computer. See where Cytogent goes further for research: signed briefs, lab tasks and cited files.
- **H1:** Cytogent vs Grok Bots for life science <kw>research</kw>.
- **Short answer:** Grok Bots are persistent AI teammates that work on a cloud computer and hand work to each other. Choose Cytogent when the work is research. It starts from a signed research brief, gives lab tasks to people, and builds cited trial, regulatory and patent files.
- **What Grok Bots do well:**
  - Bots keep working on a cloud computer after you close your laptop.
  - Team Bots let a whole team share bots with the same context, tools and memory.
  - Bots can hand work to each other, with one bot leading specialists.
  - A plugin catalog connects bots to common work apps.
- **Where Cytogent goes further:** same 5 ticks as 7.1.
- **Table (Grok Bots | Cytogent):** same rows as 7.1, with these changes:
  - Always-on agents: "Yes"
  - Shared workspace: "Yes, Team Bots"
  - Lab tasks for people: "Asks when a decision is needed"
  - Models: "xAI"
- **Use them together:** Keep Grok for the work it does well. Cytogent routes steps to models from several providers, including xAI, so a research project can still use Grok models where they fit.
- **FAQ:**
  1. **Can Grok Bots do life science research?**
     Grok Bots can run long tasks on a cloud computer, use apps and hand work to each other, which helps with many kinds of research. Cytogent adds the research layer: a signed brief, life-science models, lab tasks for people, scientist sign-off on record and one cited trail to the final file.
  2. **Can I keep using Grok?**
     Yes. Keep Grok for the work it does well. Cytogent routes steps to models from several providers, including xAI, so a research project can still use Grok models where they fit. Results export to Word, PDF, your notebook or LIMS for the rest of your team.

### 7.3 `/compare/dust/`

- **Title:** Cytogent vs Dust for Life Science Research
- **Description:** Dust is a multiplayer AI platform for company-wide agents. See where Cytogent goes further for research: signed briefs, lab tasks and cited files.
- **H1:** Cytogent vs Dust for life science <kw>research</kw>.
- **Short answer:** Dust is a strong platform for company-wide agents that share knowledge and tools. Choose Cytogent when the work is research. It starts from a signed research brief, gives lab tasks to people, and builds cited trial, regulatory and patent files.
- **What Dust does well:**
  - Dust calls its approach multiplayer AI: humans and agents share context, tools and goals.
  - Teams build and share agents across 100+ tools, such as Slack, Notion, GitHub and Google Drive.
  - Agents can use MCP servers and call other agents as tools.
  - Dust works with models from several providers.
- **Where Cytogent goes further:** same 5 ticks as 7.1.
- **Table (Dust | Cytogent):** same rows as 7.1, with these changes:
  - Always-on agents: "Yes"
  - Shared workspace: "Yes"
  - Lab tasks for people: "Human steps in workflows"
  - Models: "Several providers" | "Several providers, plus science models"
- **Use them together:** Many teams use a company-wide agent platform for internal knowledge and a specialised workspace for research. Cytogent results export to Word, PDF, notebooks and LIMS, and its MCP connectors let agents work in other tools.
- **FAQ:**
  1. **Can Dust agents do life science research?**
     Dust lets teams build agents on company knowledge and run them across many tools, which suits research operations. Cytogent is built for the science itself: a signed research brief, life-science models, lab tasks for people, scientist sign-off on record and one cited trail into trial, regulatory and patent files.
  2. **Can Cytogent and Dust work together?**
     Yes. Many teams use a company-wide agent platform for internal knowledge and a specialised workspace for research. Cytogent results export to Word, PDF, notebooks and LIMS, and its MCP connectors let agents work in other tools. Tell us about your setup and we will check the fit together. [CONFIRM]

---

## 8. Customers page `/customers/` (new)

[CONFIRM all wording with both companies before publishing. If permission is missing, build the page but keep it out of the nav, footer and sitemap and add `noindex`.]

- **Title:** Cytogent Pilots: CRISPR Diagnostics and Clinical Trials
- **Description:** Two active Cytogent pilots: CRISPR research for cervical cancer diagnosis with Cervixel, and a clinical trial for a vitiligo skin patch with Eipha Biosciences.
- **H1:** Two pilots, from finding to industry-ready <kw>work</kw>.
- Hero: cell division view (reuse the clinical-trials hero view).
- Hero sub: Cytogent is bootstrapped and built with real research teams.

**Section 1: Cervixel** (split layout, `crispr` diagram on the right)
- H2: Cervixel: CRISPR research for cervical cancer <kw>diagnosis</kw>.
- Body: Cervixel works on CRISPR-based diagnosis of cervical cancer. In the pilot, agents review the literature on CRISPR detection of high-risk HPV, design and check guide candidates, and keep every result in one cited record for the team to review and sign.
- Ticks: Workflows: CRISPR & genome editing, Literature & evidence · Status: active pilot
- Links: /solutions/crispr-genome-editing/ · /solutions/literature-and-evidence/

**Section 2: Eipha Biosciences** (split, flipped, `trials` diagram)
- H2: Eipha Biosciences: a clinical trial for a vitiligo skin <kw>patch</kw>.
- Body: Eipha Biosciences develops a skin patch for vitiligo. In the pilot, agents draft and organise trial documents from planning to close: protocol and endpoints, CRFs and site documents, monitoring and safety summaries, with regulatory documents built from the same sources.
- Ticks: Workflows: Clinical trials full cycle, Regulatory documentation · Status: active pilot
- Links: /solutions/clinical-trials/ · /solutions/regulatory-documentation/

**CTA**
- H2: Want to be our next <kw>pilot</kw>?
- Lede: We take on a small number of pilot teams each quarter. Tell us your question.
- Button: Request access

---

## 9. About `/about/`

- Keep the current sections.
- Update the definition to section 2.2.
- Add the team section after the definition.

**Team section:**
- Eyebrow: Team
- H2: Built by a doctor and an AI <kw>engineer</kw>.
- Lede: We started Cytogent to close the gap between what labs find and what industry can use.
- Three person cards (circle photo, the people pattern):
  - **John** [CONFIRM full name], Co-founder: Medical doctor and three-time health-tech founder. Leads the life-science and research side.
  - **Navid** [CONFIRM full name], Co-founder: AI engineer with 10 years at large companies in Europe and Asia. Builds the platform.
  - **Mumshad Mannambeth**, Advisor: Founder and CEO of KodeKloud.
- Photos go in `source/static/img/team/` as WebP, 320×320, with alt text "Portrait of [name]". [CONFIRM: photos]
- Add `Person` JSON-LD for each person, with `worksFor` set to the Organization @id. Add `sameAs` LinkedIn URLs. [CONFIRM: URLs]
- **Description** (update): Cytogent is an agentic workspace for life science research, built by a medical doctor and an AI engineer and operated by WelloWork AB in Sweden.

---

## 10. Request access `/request-access/`

- Keep the H1, the hero and the 3 type cards.
- Add a new first field to every form (Individual, Institute, Hospital):
  - Label: What do you want to find out?
  - Control: textarea, required, 4 rows.
  - Placeholder: Example: Why does our cell line stop responding to the inhibitor after six weeks?
  - Hint: Plain words are fine. We use this to prepare a first research brief for your call.
  - IDs: `ind-question`, `org-question`, `hos-question`
- In `api/request-access.js`, add these fields to each type's field list as required, labelled "Research question". Put them first in the email.
- New success message: Thanks. We read every request and reply within five working days, with a first draft of your research brief. [CONFIRM]
- Fire `generate_lead` with `form_type` on success only.
- Update the meta description to: No self sign-up. Tell us who you are and what you want to find out. We reply within five working days with a first draft of your research brief.

---

## 11. Privacy `/privacy/`

Replace section "7. Cookies" with the text below (anchor `id="cookies"`) [CONFIRM with a lawyer]:

> **7. Cookies and analytics**
> We use one kind of optional cookie: Google Analytics 4, which helps us understand which pages are useful to visitors. It runs only if you choose "Accept analytics" in the cookie banner. If you decline, no analytics cookies are set and no analytics data is sent. You can change your choice at any time with "Cookie settings" in the footer. We have turned off Google signals and ad personalisation, and we keep analytics data for 14 months. Google acts as our processor; see Google's privacy policy for how it handles data. We store your cookie choice in your browser (key `cg-consent`) so we do not ask again. This storage is necessary and contains no personal data.

Also do these:
- In GA admin, set data retention to 14 months. (This is a manual step: list it in section 14.)
- Update the privacy meta description to mention analytics with consent.

---

## 12. Other pages

### 12.1 Solution pages (all 7)

Keep the titles, descriptions, H1s, sections and FAQs. Add one strip right after the intro section:
- Eyebrow: Starts with a research brief
- Line: the example question below, in quotes.
- Small text: Cytogent asks about data, success criteria and limits, then agents plan from the signed brief. [See an example](/#demo)

| Slug | Example question |
| --- | --- |
| literature-and-evidence | What is known about resistance to KRAS inhibitors in lung cancer, and where do studies disagree? |
| in-silico-studies | Which of our 200 compounds are most likely to bind the pocket and pass basic ADMET filters? |
| protein-design | Can we make this enzyme stable at 50 °C without losing activity? |
| crispr-genome-editing | Which guides knock out our target gene in this cell line with the lowest off-target risk? |
| clinical-trials | Plan a phase I/IIa study for our topical patch in adults with vitiligo. |
| regulatory-documentation | Which documents does our clinical trial application still need, and what can we draft from our results? |
| patent-documentation | Is our new assay format novel, and what could our first claim cover? |

Also:
- Add the text link "How Cytogent compares" (to `/compare/`) to each solution page's related section.
- On `literature-and-evidence` only: add ScienceDirect to the sources the agents read (full text through Elsevier's API). [CONFIRM: licence]
- In each solution's `team` block, add a fourth figure before the agents: **Planner** (squircle, long-context LLM), "Turns your question into a brief and splits it into tasks for agents and people." Update the `team` diagram so a person circle also receives one task. [CONFIRM Planner name]

### 12.2 Industry pages (all 4)

Add one short block before the CTA:
- H2: Why a specialised <kw>workspace</kw>?
- Text per page, plus the link "See how Cytogent compares" (to `/compare/`):

| Page | Text |
| --- | --- |
| Pharma & biotech | General agent tools can search and summarise. Here, target triage and candidate ranking run on life-science models, and every decision keeps its sources. |
| CROs & clinical teams | General tools write text. Cytogent drafts protocols, CRFs, SAPs and CSRs from your study data, in the structure reviewers expect, with every number traced. |
| Hospitals & academic labs | Patient-related research needs strict control and shared standards. Cytogent works with openEHR, FHIR, OMOP and SNOMED CT, keeps each project isolated, logs every agent action and records who signed off. |
| Regulatory & IP teams | General tools draft text. Cytogent builds submissions and claims from one cited record, so each section points to the result behind it. |

### 12.3 FAQ page `/resources/faq/`

Add the new home FAQ items to the right groups. Keep "What can the agents do?" and "Where is data hosted?". Add three new items:

- **Which AI models does Cytogent use?**
  Cytogent routes each step to the model that does it best: models from Anthropic, OpenAI, Google and xAI for reading, coding and drafting, plus life-science models for structure, docking and design. Every routing choice is logged, so you can see which model produced which part of a result.
- **Can I connect my own tools and agents?**
  Yes. Agents work in real tools through MCP connectors and browser access, and the workspace connects to electronic lab notebooks, LIMS, storage, Git, team chat, single sign-on, reference managers, hospital systems through FHIR, and ScienceDirect for full-text papers. Anything that sends, posts or changes data outside the project waits for a person to approve it. [CONFIRM]
- **Which health data standards does Cytogent use?**
  Cytogent uses openEHR to model and store patient records, FHIR to exchange data with hospital systems, the OMOP common data model to run the same study on data from many sites, and SNOMED CT to code diseases, symptoms and procedures. This keeps clinical data consistent, comparable and easy to move between systems.

### 12.4 Glossary `/resources/glossary/`

Add these terms, keep the list A–Z, and update the DefinedTermSet JSON-LD:

| Term | Definition |
| --- | --- |
| Research brief | A one-page plan signed before agents start: question, hypothesis, data, controls, endpoints, limits, rules and owner. |
| Human task | A task an agent creates for a person, such as a lab run, a review or an approval, with an owner and the protocol attached. |
| MCP | Model Context Protocol, an open standard that lets AI agents use tools and data sources in a consistent way. |
| Agent workspace | Software where AI agents run in the background, use apps and share work with a team. |
| FHIR | Fast Healthcare Interoperability Resources, an HL7 standard for sending health data between systems through APIs. |
| OMOP | The OMOP Common Data Model, a shared format for research data, so the same study can run on data from many hospitals. |
| openEHR | An open standard for designing and storing patient records, where clinicians define the medical content separately from the software. |
| SNOMED CT | A large clinical terminology that gives each disease, symptom and procedure a code, so different words for the same thing match. |

### 12.5 Data & models and Security pages

- Apply the [CONFIRM] status changes from 4.11 and 4.12.
- Add the "Analytics only with consent" row to the security page controls.
- On the Data & models page, add a section "Health data standards" with openEHR, FHIR, OMOP and SNOMED CT, one line each (the glossary text), and add ScienceDirect to the literature sources.

### 12.6 `llms.txt`

Use the new definition. Add sections:
- "How it works" (the 4 steps)
- "Why teams choose Cytogent" (the 6 cards from section 6)
- "Compare" (the 4 compare URLs)
- "Pilots" (`/customers/`, only if permission is confirmed)

---

## 13. Build order (one commit per phase)

1. **Phase 1: analytics and consent.** Cookie banner, `cgTrack`, the privacy section, the footer link. Add the 404 page tag by hand.
2. **Phase 2: the demo.** Build the component and its 3 examples, then add it to Home (4.2).
   - Check it at 1440, 1024, 768 and 390 px, with reduced motion, with keyboard only, and with JS off.
3. **Phase 3: the rest of Home.** Sections 4.1 to 4.15, plus the diagram changes (`bench`, `dg-how`, `st_brief`, `st_edit`).
4. **Phase 4: Platform.** Section 5 and the `cascade` change.
5. **Phase 5: compare pages.** `/compare/` and the three vs pages, with nav, footer, sitemap and OG images.
6. **Phase 6: other pages.** `/customers/`, About, Request access (with the API), solution and industry strips, FAQ, glossary, `llms.txt`.
7. **Phase 7: full checks** (below). Then take new screenshots into `docs/screenshots/`.

**Acceptance checks (every page):**
- AA contrast, one H1, no heading skips.
- Title of 60 characters or less, description of 140–160 characters, both unique across the site.
- Valid JSON-LD (Organization, WebSite, SoftwareApplication with featureList, BreadcrumbList, FAQPage, Person, DefinedTermSet).
- No broken links or anchors, no console errors, no horizontal scroll at 390 px.
- Reduced motion shows still frames.
- Every diagram passes `dg_layout_check.py` at 4 widths.
- No request to Google before consent: check the Network tab in a fresh profile.
- `generate_lead` fires once per successful form.
- Lighthouse on Home: performance 90 or more on mobile, accessibility 100, SEO 100.
- Sitemap and `llms.txt` list every public URL.

---

## 14. Open items to confirm (keep this list updated in `docs/HANDOFF.md`)

1. Planner is the name of the agent that asks questions and plans.
2. Life-science models are live in the product (structure, docking, protein design, CRISPR checks). If not, change "Built in" to "In progress".
3. "Trained models" status (variant effect, binding affinity, assay QC).
4. Encryption at rest: the site says Done, the deck says in transit only.
5. "Anything that leaves the project waits for a yes" (approval for outbound actions).
6. MCP connectors and browser access are available to customers.
7. Reply within five working days, with a first research brief draft.
8. Written permission from Cervixel and Eipha Biosciences, plus the wording on `/customers/`.
9. Founders' full names, photos and LinkedIn URLs.
10. Lawyer review of the new privacy text and the compare pages. Set GA retention to 14 months.
11. Re-check all competitor facts on build day, and fill in [BUILD DATE].
12. Health data standards: which of openEHR, FHIR, OMOP and SNOMED CT are live for customers. SNOMED CT needs an affiliate licence (SNOMED International or the national release centre).
13. ScienceDirect: Elsevier's commercial API licence and subscription are in place, the licence allows AI agents to read and cite the content (Elsevier reserves text and data mining and AI rights), and we may name ScienceDirect on the site. Our entitlements decide full text or abstracts only.
