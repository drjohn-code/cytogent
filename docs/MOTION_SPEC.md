# Motion spec

Package: `motion` 14.9.0 (Motion for React), imported from `motion/react`. `framer-motion` 14.9.0 sits in `node_modules` only as an internal dependency of `motion`; no code imports it, and ESLint blocks the import (`no-restricted-imports`). Motion+ is not used.

App-wide setup: [`MotionProvider`](../src/components/motion/MotionProvider.tsx) wraps the app in `<MotionConfig reducedMotion="user">` and `<LazyMotion features={domAnimation} strict>`. Components use `m.*`. `domMax` is not loaded anywhere yet.

CSS: every CSS transition and animation is cut to 0.01 ms under `prefers-reduced-motion: reduce` (`globals.css`).

| Element | Trigger | What moves | Duration / easing | Reduced motion |
| --- | --- | --- | --- | --- |
| Mobile menu (`<dialog>`) | Open | Opacity 0 → 1 (CSS `@starting-style`) | 200 ms, default ease | Instant |
| Buttons | Hover | Background / border colour | 150 ms, `--ease-out` | Instant |
| Header nav links | Hover | Text colour only (not outline, so focus shows at once) | 150 ms | Instant |
| Hero canvas (`OrganoidScene`, R3F `useFrame`) | Page load, when WebGL is used | Point cloud spins slowly (0.18 rad/s); every 12.4 s cycle: organoid hold 3.2 s → regroup into plate 2.6 s (smoothstep, staggered left to right by column) → plate hold 4 s → back 2.6 s. The one infinite loop on the site. | as stated | Not mounted: static SVG (`ReducedMotionFallback`) instead |
| Hero canvas pause | Off-screen (IntersectionObserver, 120 px margin) or tab hidden (`visibilitychange`) | `frameloop` set to `never`; the clock clamps each step to 0.1 s so it does not jump on resume | — | — |
| Hero fallback → canvas | First WebGL frame ready | Cross-fade, opacity only | 500 ms | Canvas never mounts |
| Hero pause / play button (WCAG 2.2.2) | User presses it (mouse or keyboard) | Sets `frameloop` to `never` / `always`; label switches "Pause animation" ↔ "Play animation" | Instant | Button not shown (no animation) |
| LoopTimeline active step | Reader scrolls a step into the middle band of the viewport (IntersectionObserver, −45% top and bottom) | Node and label fill colour; mobile progress bar `scaleX` | 300 ms | Instant colour change; the bar jumps |
| UncertaintyMap, EscapeRoutes, PlatePlanHud, DeliverableRail, TrackArchitecture, SampleLineage, SiloedVaults, ResistanceStory | — | Static | — | — |
| FAQ disclosure icon | `<details>` opens or closes | Plus icon rotates 45° (transform) | 200 ms | Instant |
| Arrow links | Hover | Arrow moves 2 px right (transform) | 150 ms | Instant |

When the hero canvas is skipped (in addition to reduced motion): Save-Data on, `deviceMemory` ≤ 2 GB or `hardwareConcurrency` ≤ 2, or no WebGL. Text is never animated in, so nothing on a page depends on JavaScript to become visible.

Checked on 3 November 2026 with Playwright (Chromium, SwiftShader WebGL) at 390, 834 and 1440 px: with `reducedMotion: "reduce"` no `<canvas>` is created on `/`; without it, one `<canvas>` is created. Screenshots taken of both hero states and the fallback. Not checked: real low-power devices, Safari, Firefox.
