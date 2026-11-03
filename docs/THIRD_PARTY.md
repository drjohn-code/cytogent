# Third-party code, fonts and tools

Checked 3 November 2026. Versions are pinned exactly in `package.json`.

## Runtime

| Package | Version | Licence | Why |
| --- | --- | --- | --- |
| next | 16.4.5 | MIT | Framework |
| react, react-dom | 19.3.1 | MIT | |
| motion | 14.9.0 | MIT | DOM/SVG animation (pulls in framer-motion 14.9.0 internally) |
| three | 0.187.0 | MIT | Hero point cloud (loaded only on `/`, client-side, when WebGL is used) |
| @react-three/fiber | 9.8.2 | MIT | React renderer for three (peer range React ≥19 <19.4) |

`@react-three/drei` (named in the brief) is **not installed**: nothing in the hero needs it, and the brief says to keep only dependencies that are used. `@types/three` 0.187.0 is a dev dependency.

## Build / dev

| Package | Version | Licence | Note |
| --- | --- | --- | --- |
| typescript | 6.0.3 | Apache-2.0 | 7.0.2 is `latest`, but typescript-eslint supports `<6.1.0` |
| tailwindcss, @tailwindcss/postcss | 4.3.4 | MIT | |
| eslint | 9.39.5 | MIT | 10.x is `latest`; 9.x kept for plugin compatibility |
| eslint-config-next | 16.4.5 | MIT | |
| @fontsource-variable/space-grotesk, @fontsource-variable/jetbrains-mono | 5.3.0 | OFL-1.1 (fonts), MIT (package) | Source of the WOFF2 files copied into `src/fonts/` |
| @fontsource/space-grotesk | 5.3.0 | OFL-1.1 (fonts), MIT (package) | Source of the static 500/700 WOFF files in `src/fonts/` used for OG images (the image renderer cannot read WOFF2) |

## Security audit

`npm audit` on 3 November 2026, after a clean `npm ci`:

- **Runtime dependencies (`--omit=dev`): 0 vulnerabilities.**
- Dev dependencies: 16 moderate findings, all one advisory: `minimatch` < 11.0.1 (GHSA-g3hv-75wg-m249, denial of service through crafted glob patterns), pulled in by the ESLint toolchain (`eslint-config-next` → `eslint-plugin-import`, `-jsx-a11y`, `-react`, `@eslint/config-array`). It runs only at lint time on our own files and is never shipped to the site. npm's suggested fix (`npm audit fix --force`, which downgrades ESLint to 4.0.0) is wrong and was not applied. Recheck when `eslint-config-next` updates.

## Testing

| Package / tool | Version | Licence | Note |
| --- | --- | --- | --- |
| @playwright/test | 1.64.1 | Apache-2.0 | Uses Chromium build 1248 (Chrome for Testing 156) from the local Playwright cache |
| @axe-core/playwright | 4.14.0 | MPL-2.0 | WCAG 2.0–2.2 A/AA rules |
| lighthouse | 13.6.0 | Apache-2.0 | Run once via `npx` for `docs/QA_REPORT.md`; **not** a project dependency |

## Fonts (self-hosted)

| File | Font | Licence |
| --- | --- | --- |
| `src/fonts/SpaceGrotesk-latin-wght.woff2` | Space Grotesk, variable 300–700, Latin subset | SIL OFL 1.1, `src/fonts/SpaceGrotesk-OFL.txt` |
| `src/fonts/JetBrainsMono-latin-wght.woff2` | JetBrains Mono, variable, Latin subset | SIL OFL 1.1, `src/fonts/JetBrainsMono-OFL.txt` |

The logo wordmark does not use either font: it is custom geometry (see `docs/BRAND.md`).

## Generated or community UI code

None so far. The 21st MCP connected at the start of the session on the free tier with AI generation turned off (search and retrieval only), and disconnected later. No 21st components were used. The header, mobile menu and footer were written by hand.

## Brief §6A toolchain: what was available and what was used

| Tool | Available? | Used for | Not used for |
| --- | --- | --- | --- |
| **21st MCP** (`.mcp.json`) | Connected at the start of the session (free tier, `aiGenerationEnabled: false`, 2 retrievals/day), later disconnected | Nothing. **No component on this site came from 21st.** `logo_search` / `search_logo` never called | All components were written by hand |
| **UI UX Pro Max** (`.claude/skills/ui-ux-pro-max`) | Yes | Design-system search (pattern, glass style, anti-patterns), two targeted searches (`mobile drawer navigation focus`, `app router fonts metadata`), the pre-delivery checklist in Phase 7 | Its palette and fonts (rejected; see `design-system/cytogent/MASTER.md`) |
| **Motion** (`motion` 14.9.0) | Yes | `MotionConfig reducedMotion="user"`, `LazyMotion` + `domAnimation` (strict), `useReducedMotion()` in the hero | No `m.*` animated components ship yet: every DOM animation is a short CSS transition (colour, opacity, transform) that the reduced-motion rule covers. The 3D hero animates with R3F `useFrame` as the brief requires |

Motion API questions were answered from the installed package and its types, not from motion.dev (not fetched).

## Design tooling

UI UX Pro Max skill (`.claude/skills/ui-ux-pro-max`): used for the design-system search; see `design-system/cytogent/MASTER.md` for what was taken and what was rejected.
