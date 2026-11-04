# Cytogent brand

Status (4 November 2026): **new mark and wordmark, chosen by the owner in chat.** The mark is a tumour drawn as a cluster of cells with a resistant clone budding out of it; the wordmark is "CYTOGENT" in Lexend 400 with wide tracking. Master files are in [`brand/`](../brand/) and copied to `public/brand/`.

- `public/brand/*.svg`: header and footer use `cytogent-logo.svg` as `<img alt="Cytogent">` inside the home link; the 410 page uses it too.
- `src/app/icon.svg`, `favicon.ico`, `apple-icon.png` (Next.js file conventions); `public/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (web manifest).
- OG images (`/og/<slug>`) embed `cytogent-logo.svg`.

Rebuild: `python3 scripts/build-mark.py` (mark in every file, plus `src/app/icon.svg`), then `node scripts/build-wordmark.mjs` (wordmark and lockup proportions). The PNG icons were rendered from `cytogent-mark.svg` with sharp. The 1A "Refined loop" files from 3 November are superseded; `docs/brand/build_final_logo.py` still draws them.

## The mark

About two dozen cells packed in a sunflower (phyllotaxis) spiral, so the cluster reads as a round tumour spheroid rather than a grid. A contiguous patch of edge cells, plus one cell budding outward at the upper right, is the resistant clone. It is drawn in the accent colour: azure `#7AA7FF` on dark, `#3F6FE0` on light. In one-colour files the clone cells are rings (an even-odd path, since logo files carry no strokes). The small mark (32 px and below) uses about ten larger cells.

### The wordmark

"CYTOGENT" in capitals, Lexend Regular (400), tracking 0.22 em, cap height 28 units, converted to outlines with opentype.js. Font file and licence: `docs/brand/fonts/Lexend-400.woff` and `Lexend-OFL.txt` (SIL Open Font License 1.1). In the horizontal lockup the caps sit at 0.78 scale, centred on the mark.

## Files

All in [`brand/`](../brand/). Each family has four variants: no suffix = full colour on dark (the site default), `-on-light`, `-mono-white`, `-mono-dark`.

| File | viewBox (trimmed to the ink) | Use |
| --- | --- | --- |
| `cytogent-logo*.svg` | 277.84 × 51.6 | Horizontal lockup. Header. |
| `cytogent-logo-stacked*.svg` | 252.8 × 114.2 | Stacked lockup. Square-ish spaces. |
| `cytogent-mark*.svg` | 45.5 × 52.4 | Mark alone, 33 px and up. |
| `cytogent-mark-small*.svg` | 48.4 × 54.6 | Mark alone, 32 px and below. |
| `cytogent-wordmark*.svg` | 279.6 × 29 | Wordmark alone. |
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
