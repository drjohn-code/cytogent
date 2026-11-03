# Cytogent design system: MASTER

Reconciled 3 November 2026 from the UI UX Pro Max `--design-system` search (query: "life science deep-tech B2B oncology R&D dark scientific instrumentation"). The build prompt's §6 wins on colour, type and style. **Tokens live in [`src/styles/tokens.css`](../../src/styles/tokens.css); this file does not repeat values.**

## Taken from the skill

- **Pattern: scroll-triggered storytelling**, with the skill's own guard rails: the narrative must read without scroll effects; keep DOM reading order complete; under reduced motion, disable parallax and scroll-scrub and render each chapter in its final readable state; pause animation off-screen; simplify on mobile. CTA at the end of chapters plus a final CTA.
- **Style: glassmorphism**, used only as §6 describes it (surface + 12 px blur + 1 px line), with the skill's conditions: text contrast ≥ 4.5:1, keyboard access, visible focus, reduced motion.
- **Pre-delivery checklist** (run in Phase 7): no emoji icons; pointer cursor on clickable elements; hover transitions 150–300 ms; contrast ≥ 4.5:1; visible focus; `prefers-reduced-motion` respected; check at 375, 768, 1024 and 1440 px.
- UX rules: keyboard order matches visual order; sticky header must not cover content (`scroll-padding-top`); focus indicator ≥ 2 px with 3:1 contrast.

## Rejected (conflicts with the brief)

| Skill suggestion | Why not | Used instead |
| --- | --- | --- |
| Palette: sky blue `#0EA5E9`, green `#059669`, light background ("DNA blue + life green") | §6 fixes the palette; §6B rules out DNA imagery | §6 tokens: canvas, signal, shift, alert |
| Fonts: Exo + Roboto Mono via the Google Fonts CDN | §6: Space Grotesk / JetBrains Mono, self-hosted | `next/font/local`, WOFF2 in `src/fonts/` |
| "Progressive reveal, each chapter a distinct colour" | One palette; colour is not decoration | Signal for the chosen/active item, shift sparingly |
