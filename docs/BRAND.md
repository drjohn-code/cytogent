# Cytogent brand

Status (3 November 2026): **logo approved by the owner: Direction 1A "Refined loop", and in the new site.** Master files are in [`brand/`](../brand/); `npm run brand` rebuilds them and copies them into the app:

- `public/brand/*.svg`: header and footer use `cytogent-logo.svg` as `<img alt="Cytogent">` inside the home link; the 410 page uses it too.
- `src/app/icon.svg`, `favicon.ico`, `apple-icon.png` (Next.js file conventions); `public/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (web manifest).
- OG images (`/og/<slug>`) embed `cytogent-logo.svg`.
- Optional load animation: **not implemented** (the brief allows it; skipped to keep the header static).

Board: [`docs/brand/logo-final.png`](brand/logo-final.png). Regenerate everything with `python3 docs/brand/build_final_logo.py` (needs Playwright with Chromium, and Pillow).

## The mark

Six nodes on an open ring form a "C". The ring is the intended DEFINE → CONNECT → PRIORITIZE → TEST → LEARN → CONFIRM loop. The node at the upper terminal, in signal colour, is the one experiment the loop chooses. The opening on the right is deliberate: the loop feeds the next decision rather than closing on itself.

### Construction (64-unit grid, centre 32, 32)

| Part | Full mark | Small mark (≤32 px) |
| --- | --- | --- |
| Ring centre radius | 22 | 22 |
| Ring thickness | 3.2 | 5.5 |
| Node radius | 4.4 | 5.5 (nodes merge into the ring) |
| Lit node radius | 5.8 | 7.6 |
| Gap around each node | 1.5 | 2.6 (lit node only) |
| Node angles | 45°, 99°, 153°, 207°, 261°, 315° (54° apart; lit node at 45°, upper right) | same |

The ring is cut around each node by a circle of node radius + gap, so each ring segment has concave ends. In the light variant the lit node has a 1.6-unit ink ring (teal alone is about 1.5:1 against white), and its gap grows by 0.8 to match.

### The wordmark

Custom lowercase monoline geometry, drawn in code: 20-unit x-height, 3.4 stroke, circles of radius 10 for c, o, g, e, n; t ascends to 28; y and g descend to about 12. All strokes are outlined to filled paths. **No font file is used, so no font licence applies.**

## Files

All in [`brand/`](../brand/). Each family has four variants: no suffix = full colour on dark (the site default), `-on-light`, `-mono-white`, `-mono-dark`.

| File | viewBox (trimmed to the ink) | Use |
| --- | --- | --- |
| `cytogent-logo*.svg` | 302.9 × 51.6 | Horizontal lockup. Header. |
| `cytogent-logo-stacked*.svg` | 212.6 × 140.1 | Stacked lockup. Square-ish spaces, OG images. |
| `cytogent-mark*.svg` | 45.5 × 52.4 | Mark alone, 33 px and up. |
| `cytogent-mark-small*.svg` | 48.4 × 54.6 | Mark alone, 32 px and below. |
| `cytogent-wordmark*.svg` | 212.6 × 39.8 | Wordmark alone. |
| `favicon/icon.svg` | square | SVG favicon. Dark ink on light browser tabs, light ink on dark tabs (`prefers-color-scheme` inside the SVG). |
| `favicon/favicon.ico` | 16, 32, 48 | Light mark on a `#050B14` rounded tile. 16 and 32 use the small mark. |
| `favicon/apple-icon.png` | 180 | Full-bleed `#050B14`, mark at 60%. |
| `favicon/icon-192.png`, `icon-512.png` | 192, 512 | Web manifest icons. |
| `favicon/icon-maskable-512.png` | 512 | Maskable; mark inside the 80% safe circle. |

Every SVG has a `viewBox`, `role="img"` and `<title>Cytogent</title>`, and no strokes, masks, `<defs>`, `<text>` or embedded images (checked with grep on 3 November 2026). Coordinates are rounded to 0.01. **SVGO was not run**: it isn't installed, and I didn't download it. The files are already minimal; running SVGO later is optional.

In the page: use the SVG inline or as `<img src="…" alt="Cytogent">` inside the home link. When it is inline, keep `role="img"` and the `<title>`.

## Rules

- **Clear space:** one node diameter (8.8 units on the 64 grid, about ⅙ of the mark's height) on every side.
- **Minimum sizes:** mark 16 px (use `-small` up to 32 px); horizontal lockup 120 px wide (absolute minimum 96 px, where the x-height is about 7 px).
- **Colours:** signal `#42E8C8`, text `#EAF4F5`, canvas `#050B14`. Mono white is `#FFFFFF`. No other colours, no gradients.
- **Badges:** the mark stays larger than the NVIDIA Inception badge wherever both appear.

Do:
- Use full colour on dark (`#050B14` or similar) wherever possible: it is the main look.
- Use `-on-light` on white or pale grounds, and mono when there is only one colour (print, embossing, overlays).

Don't:
- Recolour the lit node, or move it to another position on the ring.
- Close the ring, add a halo or glow, or rotate the mark.
- Set the wordmark in a typeface; use the outlined file.
- Put the full-colour dark variant on white (the light ink disappears), or teal on white without its ink ring.
- Stretch, outline or add shadows.

## Retired brand files (not deleted)

| Where | What |
| --- | --- |
| `source/static/img/cytogent-{mark,wordmark,lockup}*.svg` (15 files) | The old mark: scattered dots in a violet → pink → amber → cyan gradient with orbit lines. Wordmark in outlined Geist. |
| `site/img/favicon.svg`, `site/favicon.ico`, `site/apple-touch-icon.png`, `site/img/logo-512.png` | Icons from the old mark (`source/icons.py`). |

These are still what the live site serves. They should be removed when the new logo goes into the site. `source/static/brand/nvidia-inception-program-badge*.svg` is a separate matter: see `docs/TODO_VERIFY.md`.

## How we got here

- `docs/brand/logo-directions.png` (`build_directions.py`): the first three directions (six-node loop, aperture/well, wordmark-led).
- `docs/brand/logo-d1-variants.png` (`build_d1_variants.py`): four redesigns of the six-node loop (1A refined loop, 1B perforated strip, 1C tightening spiral, 1D focus). The owner chose 1A.
- A graduated-dots version was dropped while drawing, because it reads as a loading spinner. 1A shares a little of that risk, since dots on a ring are common in loaders; the asymmetric lit node and the open ring are what set it apart.

## Not done

- **Trademark clearance (EUIPO / national office): not done.** I can't do it.
- SVGO not run (not installed; the files are already minimal).
- Old logo files in `source/static/img/` and `site/` still exist, because the legacy site still serves them. Remove at cutover.
