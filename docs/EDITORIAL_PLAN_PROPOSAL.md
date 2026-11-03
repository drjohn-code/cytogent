# Editorial plan: PROPOSAL

**Status: proposed, needs owner approval.** Written 3 November 2026 because Appendix A (the B01–B16 table) was not supplied. Per the brief (§9), no drafts have been written. If the original table exists, it replaces this one; only the four constraints the brief states directly (B02, B06, B07, B09) and the slug `cancer-drug-resistance-in-plain-words` are taken from the brief. Every other id-to-topic mapping below is a guess.

Nothing here is published, linked from the site, or listed in the sitemap, RSS or `llms.txt`.

## What the owner needs to decide

1. Approve, change or replace each topic below (or paste the original Appendix A table).
2. For each approved topic: who does the scientific/editorial review.
3. Whether `/for-people` keeps the plain-language explainer, or links to B14 once B14 is published (the brief says not to link unpublished articles; today `/for-people` carries the explainer itself).

## Proposed topics

Clusters: **R** resistance biology · **M** models and methods · **E** experiment selection and evidence · **G** governance · **P** plain language.
Sources are ids from `src/content/references.ts`; "+ new" means a source must be found, checked and added to the registry before drafting.

| Id | Proposed slug | Proposed title | Cluster | Audience | Sources | Visual (conceptual) | Do not claim |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B01 | `osimertinib-resistance-is-not-one-disease` | Why osimertinib resistance is not one disease | R | Translational leads | REF-01, REF-02 | Branching escape routes | Frequencies of each mechanism unless quoted with source |
| B02 | `genomic-profiling-versus-functional-testing` | Genomic profiling versus functional testing: what each tells you about a resistant tumour | M | Translational leads | REF-05, REF-06, REF-09 | Two panels: profile vs response | "Versus" in the scientific sense only (§9); no vendor comparison |
| B03 | `on-target-resistance-when-egfr-changes` | On-target resistance: when EGFR itself changes | R | Drug developers | REF-01 + new | Receptor with altered binding site | Any treatment recommendation |
| B04 | `bypass-signalling-when-another-pathway-takes-over` | Bypass signalling: when another pathway takes over | R | Drug developers | REF-01 + new | Blocked road with a detour | That a named combination works |
| B05 | `cell-state-shift-when-a-lung-tumour-changes-type` | Cell-state shift: when a lung tumour changes type | R | Translational leads | REF-01, REF-02 | Cell outline morphing | Clinical management advice |
| B06 | `too-many-pairs-choosing-a-small-batch` | Too many pairs: choosing a small, informative batch | E | Asset teams | REF-08 | **Large combinatorial space collapsing into a small high-information batch** (no 10,000 → 20 or other fake scale) | Any reduction ratio or hit rate |
| B07 | `learning-in-waves` | Learning in waves: how sequential batches narrow uncertainty | E | Asset teams, scientists | REF-08 | **Sequential waves narrowing uncertainty, conceptually** | Number of waves needed, time saved |
| B08 | `when-a-model-should-say-i-dont-know` | When a model should say "I don't know": uncertainty and abstention | E | Scientists | REF-08 + new | Uncertainty map with abstention zone | That Cytogent's uncertainty is calibrated |
| B09 | `count-confirmed-findings-not-predictions` | Count confirmed findings, not predictions | E | Asset teams, investors | REF-09 + new | **Confirmed findings vs raw predictions as a metric idea** (no fake economics) | Cost per finding, ROI, any number |
| B10 | `why-a-resistant-model-needs-its-parental-control` | Why a resistant model needs its matched parental control | M | Lab partners | REF-05 + new | Paired models side by side | Availability of specific models |
| B11 | `organoids-and-pdx-what-they-can-and-cannot-tell-you` | Organoids and PDX models: what they can and cannot tell you | M | Scientists, biobanks | REF-05, REF-06 + new | Model types on a fidelity/speed sketch (unlabelled axes) | Predictive accuracy figures |
| B12 | `orthogonal-confirmation` | Orthogonal confirmation: seeing a result twice, two ways | E | Lab partners | REF-09 | Two readouts converging | That confirmation is already run |
| B13 | `combination-benefit-is-not-a-therapeutic-window` | Combination benefit is not a therapeutic window | M | Drug developers | REF-02, REF-07 + new | Efficacy vs tolerability, conceptual | Safety of any combination |
| B14 | `cancer-drug-resistance-in-plain-words` | Cancer drug resistance in plain words | P | Public, patients | REF-03, REF-04 | Three-frame story | Medical advice; "cure" |
| B15 | `negative-results-are-data` | Negative results are data | E | Scientists, sponsors | REF-08, REF-09 | Loop with a "no effect" result feeding back | Any internal result |
| B16 | `keeping-sponsor-data-separate` | Keeping sponsor data separate in multi-party preclinical research | G | Sponsors, biobanks | + new (regulatory/primary texts only) | Siloed vaults | Certifications, assessed processors, compliance status |

## Frontmatter (as the brief specifies)

`id, slug, title, metaTitle, metaDescription, cluster, audience, published, datePublished (only if published), dateModified (only if modified), summary, answerBlock, keyTakeaways, plainWordsCallout, boundaryNote, visualType, faqs, references, relatedRoutes, ctaLabel, ctaHref`

The type is in `src/content/posts/index.ts`. Rules that the code enforces from day one:

- `published: false` until scientific/editorial review **and** owner approval. Unpublished posts are excluded from `/insights`, the sitemap, RSS, `llms.txt` and article schema (`publishedPosts()` is the only accessor those read).
- No `datePublished` without `published: true`; no backdating; build time is never used as a date.
- `dateModified` only when the content actually changed.
- No claim of expert review that did not happen.

## Body pattern for each draft (once approved)

Question-shaped H2s · short paragraphs · at least one table or list · a conceptual `<ArticleVisual />` labelled as such · a visible FAQ · numbered sources that actually support the sentence they follow. About 800–1,400 words where the topic supports it; quality over length.

## Tooling to add when the first topic is approved

MDX support (`@next/mdx` or equivalent, pinned), `src/content/posts/*.mdx`, the `/insights/[slug]` route with `generateStaticParams` over published posts only, and `<ArticleVisual />`. Not added yet: no posts means no use for the dependencies.
