# Content style guide

For anyone writing or editing copy on cytogent.com. The rules come from the V3.1 build prompt (§1–§3); this is the working version. Where this guide and the source documents disagree, the 2 Nov 2026 *Marketing & Investor Overview* and *Scientific Strategy Reference* win on substance.

## The story, in one breath

Cytogent **has built** the Experimental Intelligence Layer for oncology R&D: a closed-loop way to choose, run and learn from combination experiments in treatment-resistant cancer, delivered as **Decision-as-a-Service**, and is **ready to start pilots and partnerships**. The starting focus is a programme blueprint in EGFR-mutant lung adenocarcinoma after osimertinib resistance. It is **not intended** as a clinical diagnostic or for choosing anyone's treatment.

> Stage changed on 3 November 2026 at the owner's instruction: the platform is developed and Cytogent is ready for partnerships. Development-stage wording ("in development", "we are building", "intended", "proposed") was removed. What stays: the intended-use statement, "conceptual" labels on illustrations, and honesty about evidence that does not exist yet (no completed pilots or published client results, no signed partners, calibration still to validate, investor gates as aims).

Do not revive the old story: no agentic workspace, seven workflows, signed research briefs, named pilots, model marketplace, access tiers or AI model comparisons.

## Voice

- **British English**, `en-GB`: programme, tumour, prioritise, characterise, modelling, colour. One fixed exception: the loop label `PRIORITIZE`.
- **Short paragraphs**, plain words, precise science. Define a term once, or link `/glossary`.
- **Say what is true today.** The platform is built and ready for pilots and partners. No pilots have completed yet, so results are never implied.
- **Calm.** No exclamation marks, no urgency, no hype.

## Stage-accurate wording

| Say | Don't say |
| --- | --- |
| The platform is built; we are ready to start pilots | Our pilots have shown… / customers report… |
| Uncertainty estimates (calibration is a validation goal) | Calibrated uncertainty, guaranteed accuracy |
| The pilot shape; what every pilot includes | Results from our pilots |
| Qualified lab partners (we are looking for them) | Our partner network |
| Project-level isolation; not a certification | Fully isolated, certified, compliant |
| North-star **aim**: independently confirmed, decision-relevant findings per experimental budget | Proven to save X% |
| Not intended as a clinical diagnostic or tool for selecting treatment for individual patients | Cytogent is not a medical device (a legal determination we do not make) |

## Words and claims that are never used

Hype: revolutionary, game-changing, disruptive, breakthrough, cure, solve cancer, seamless, effortlessly, unlock the full potential, cutting-edge, world-class, best-in-class, AI-powered.

Superiority: better than, leader, first, only, best, outperforms, most trustworthy. (The plain words "first", "only" and "best" are fine in neutral use: "first wave", "sequence-only", "best serves it".)

Clinical and endorsement: clinically validated, FDA-approved (about Cytogent), backed by / powered by / endorsed by / certified by, "NVIDIA partner", any prediction of which drug will help a patient.

`tests/claims.spec.ts` scans every rendered page for these, plus percentages and large counts. If you add a page, it is scanned automatically.

## Numbers

- **No invented numbers.** No hit rates, reduction ratios ("10,000 → 20"), sample counts, TAM, pricing, time or cost savings, or fake instrument readouts.
- A number appears only with a source that supports it, from `src/content/references.ts`.
- Rendering parameters (point counts in the 3D hero) are not data and are never quoted.

## Visuals

- Every scientific visual that is not real data says so: "Conceptual illustration", "Illustrative layout, not a protocol", "Intended design".
- No axes values, probabilities, compounds or patient data in diagrams.
- The meaning of a diagram is always in the HTML text beside it; the drawing is a mirror (`aria-hidden`) or has a full `<title>` and `<desc>`.

## Sources

- Cite with `<Cite n={…} />` and list with `<Sources ids={[…]} />`; numbers follow the order of `ids`.
- The citation must support the sentence it follows. Do not call a review a primary study.
- Every list of sources carries the disclaimer: "These primary sources describe the scientific field, not Cytogent product performance."
- Before adding a source: open it, check it resolves, record how in `checked`.

## Other companies

- **Never name competitors** in copy, metadata, alt text, JSON-LD or file names.
- No comparison matrices and no copy that paints unnamed vendors as opaque, uncalibrated or careless with data. Describe Cytogent's own intended principles instead (`<DesignPrinciples />`).
- Scientific "versus" is fine when it compares methods or ideas and is sourced ("genomic profiling versus functional testing").
- Agencies and journals may be named in citations: WHO, FDA, NCI, PubMed/NCBI, Nature, EMBL-EBI/CancerModels.org, and paper authors.

## Company facts

Only facts marked `verified` in `src/content/credentials.ts` may appear. Never publish `pending` ones, and never show the verification notes. If a programme membership is shown, add: "Membership or selection does not mean clinical validation or commercial endorsement."

## Calls to action

Rotate by audience; do not repeat one slogan everywhere.

| Audience | CTAs |
| --- | --- |
| Drug teams | Discuss a pilot programme · Scope a pilot · Bring a resistance question |
| Partners, investors | Explore a collaboration · Qualify as a lab partner · Request the investor brief |
| Public, patients, talent | Read the plain-language explainer · Ask us a question |

Do not link to unpublished articles.

## Fixed text

- Loop labels, exactly: `DEFINE → CONNECT → PRIORITIZE → TEST → LEARN → CONFIRM`.
- Brand line: "One question. One experiment. Evidence for the next decision."
- Status note (every footer, from `site.ts`): "Initial focus: preclinical and translational experiment selection for oncology R&D. Not intended as a clinical diagnostic or as a tool for selecting treatment for individual patients."

## Contact and data

Every place that invites contact also says: please do not send patient-identifiable health data or confidential chemical structures.

## Page checklist

- One H1, a visible answer summary under it, 3–5 internal links, a unique title (≤ 60 characters) and description (~70–155).
- Word budgets in the brief are editorial targets: do not pad, do not cut legal or scientific substance.
- Run `npm test` before publishing.
