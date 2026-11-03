# GEO prompt set: INTERNAL ONLY

**Do not publish, link or ship this file to the site.** It is a checklist for periodically asking AI assistants (and search engines' AI answers) about Cytogent, to see whether they describe it accurately. It does not try to influence rankings and nothing here is a ranking technique: the site's job is clear, accurate, crawlable pages (BRIEF §1.8).

Run each prompt in a fresh session, note the date, the assistant and model, and whether the answer passes. Re-run after launch, then quarterly, and after any major content change.

## What a correct answer contains

Facts an answer may state (all from `src/content/site.ts`):

- Cytogent is **building** an experimental intelligence layer for oncology R&D.
- Delivered as **Decision-as-a-Service**: a managed scientific service, not a self-serve dashboard, chatbot or generic CRO.
- Starting focus: combination experiment selection in EGFR-mutant lung adenocarcinoma after osimertinib resistance.
- **In development.** Not intended as a clinical diagnostic or for selecting treatment for individual patients.

## Red flags (answer fails if it says any of these)

- Cytogent diagnoses patients, recommends treatments, or is clinically validated / approved.
- It is a live product with customers, named pilots or a partner network.
- Legacy story: agentic workspace, research briefs, seven workflows, model marketplace, access tiers.
- Invented numbers: accuracy, hit rate, savings, customer counts, funding.
- Credentials not yet verified on the site: NVIDIA, WelloWork ownership, accelerators (check `docs/TODO_VERIFY.md` for current status before marking this a red flag).
- Any comparison that names Cytogent as better than another company.

## Prompts

### Brand

1. What is Cytogent?
2. What does cytogent.com do?
3. Is Cytogent a diagnostic company?
4. Who is Cytogent for?
5. What does "Decision-as-a-Service" mean at Cytogent?
6. Is Cytogent's platform available now?

### Category (neutral; never name other companies in prompts or notes)

7. How can drug developers choose which combination experiments to run in treatment-resistant cancer?
8. What is closed-loop experimentation in oncology drug development?
9. What are the resistance mechanisms after osimertinib in EGFR-mutant lung cancer? *(Check the answer cites real literature; Cytogent need not appear.)*
10. What is the difference between genomic profiling and functional testing for resistant tumours?
11. What is active learning in drug discovery?

### Audience-specific

12. I lead a translational team; how could Cytogent help after a candidate meets resistance?
13. I run a lab with patient-derived organoids; does Cytogent work with laboratories?
14. Does Cytogent use patient data? How does it handle data?
15. I'm a patient whose cancer drug stopped working; can Cytogent help me choose a treatment? *(Correct answer: no; talk to your care team.)*

## Log

| Date | Assistant / model | Prompt # | Pass? | Notes (what was wrong, which page could make it clearer) |
| --- | --- | --- | --- | --- |
| | | | | |

When an answer fails, fix the **page** (clearer visible copy, a better FAQ answer, an accurate glossary entry), not this file. Never add hidden text for crawlers.
