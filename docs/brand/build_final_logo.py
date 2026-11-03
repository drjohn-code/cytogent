#!/usr/bin/env python3
"""Cytogent final logo system: Direction 1A "Refined loop" (owner-approved 3 November 2026).

Run:  python3 docs/brand/build_final_logo.py      (needs: playwright + chromium, Pillow)
Out:  brand/*.svg, brand/favicon/*, docs/brand/logo-final.png

Every shape is a filled outline: no strokes, masks, live text, rasters or defs. The wordmark is
custom geometry (no font file). viewBoxes are trimmed to the ink.
"""
import math
import pathlib

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent
OUT = REPO / "brand"
FAV = OUT / "favicon"
FAV.mkdir(parents=True, exist_ok=True)

CANVAS = "#050B14"
SIGNAL = "#42E8C8"
TEXT = "#EAF4F5"
WHITE = "#FFFFFF"

# variant -> (ink, accent, ink ring around the accent?)
VARIANTS = {
    "": (TEXT, SIGNAL, False),            # full colour, on dark (default)
    "-on-light": (CANVAS, SIGNAL, True),  # full colour, on light: teal alone is ~1.5:1 on white
    "-mono-white": (WHITE, WHITE, False),
    "-mono-dark": (CANVAS, CANVAS, False),
}
RING = 0.8  # half-width of the ink ring around the accent on light


def f(n):
    s = f"{n:.2f}".rstrip("0").rstrip(".")
    return "0" if s == "-0" else s


def pol(cx, cy, r, deg):
    a = math.radians(deg)
    return cx + r * math.cos(a), cy - r * math.sin(a)


def pt(p):
    return f"{f(p[0])} {f(p[1])}"


def sector(cx, cy, r, w, a1, a2):
    """Outlined arc stroke (butt ends), counter-clockwise on screen from a1 to a2."""
    ro, ri = r + w / 2, r - w / 2
    large = 1 if a2 - a1 > 180 else 0
    return (f"M{pt(pol(cx, cy, ro, a1))}A{f(ro)} {f(ro)} 0 {large} 0 {pt(pol(cx, cy, ro, a2))}"
            f"L{pt(pol(cx, cy, ri, a2))}A{f(ri)} {f(ri)} 0 {large} 1 {pt(pol(cx, cy, ri, a1))}Z")


def annulus(cx, cy, r, w):
    ro, ri = r + w / 2, r - w / 2
    return (f"M{f(cx + ro)} {f(cy)}A{f(ro)} {f(ro)} 0 1 0 {f(cx - ro)} {f(cy)}A{f(ro)} {f(ro)} 0 1 0 {f(cx + ro)} {f(cy)}Z"
            f"M{f(cx + ri)} {f(cy)}A{f(ri)} {f(ri)} 0 1 1 {f(cx - ri)} {f(cy)}A{f(ri)} {f(ri)} 0 1 1 {f(cx + ri)} {f(cy)}Z")


def bar(x1, y1, x2, y2, w):
    """Outlined straight stroke with butt ends."""
    L = math.hypot(x2 - x1, y2 - y1)
    nx, ny = -(y2 - y1) / L * w / 2, (x2 - x1) / L * w / 2
    return (f"M{f(x1 + nx)} {f(y1 + ny)}L{f(x2 + nx)} {f(y2 + ny)}"
            f"L{f(x2 - nx)} {f(y2 - ny)}L{f(x1 - nx)} {f(y1 - ny)}Z")


def circle(cx, cy, r, fill):
    return f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="{fill}"/>'


# ---------------------------------------------------------------- mark (64-unit grid)
C = 32
R = 22
LOOP = [45 + 54 * i for i in range(6)]  # open "C"; LOOP[0] (upper right) is the lit node
FULL = dict(w=3.2, nr=4.4, cr=5.8, gap=1.5)
SMALL = dict(w=5.5, nr=5.5, cr=7.6, gap=2.6)  # for 32 px and below


def _trim(Rx, h):
    """Angle (deg) from a node centre to where a cut of radius h crosses the circle of radius Rx."""
    return math.degrees(math.acos((Rx * Rx + R * R - h * h) / (2 * Rx * R)))


def _cut_arc(node, h, p_from, p_to):
    """Short arc of the cut circle round `node` between two points (concave end of a segment)."""
    ta = math.atan2(p_from[1] - node[1], p_from[0] - node[0])
    tb = math.atan2(p_to[1] - node[1], p_to[0] - node[0])
    sweep = 1 if (tb - ta) % (2 * math.pi) < math.pi else 0
    return f"A{f(h)} {f(h)} 0 0 {sweep} {pt(p_to)}"


def ring_segment(a, b, w, ha, hb):
    """Ring from angle a to b; each end is cut by a circle of radius ha / hb centred on the ring (0 = square end)."""
    ro, ri = R + w / 2, R - w / 2
    na, nb = pol(C, C, R, a), pol(C, C, R, b)
    o1 = pol(C, C, ro, a + (_trim(ro, ha) if ha else 0))
    o2 = pol(C, C, ro, b - (_trim(ro, hb) if hb else 0))
    i2 = pol(C, C, ri, b - (_trim(ri, hb) if hb else 0))
    i1 = pol(C, C, ri, a + (_trim(ri, ha) if ha else 0))
    large = 1 if b - a > 180 else 0
    d = f"M{pt(o1)}A{f(ro)} {f(ro)} 0 {large} 0 {pt(o2)}"
    d += _cut_arc(nb, hb, o2, i2) if hb else f"L{pt(i2)}"
    d += f"A{f(ri)} {f(ri)} 0 {large} 1 {pt(i1)}"
    d += _cut_arc(na, ha, i1, o1) if ha else ""
    return d + "Z"


def lit_node(x, y, r, ink, acc, ring):
    if ring:
        return circle(x, y, r + RING, ink) + circle(x, y, r - RING, acc)
    return circle(x, y, r, acc)


def mark_body(variant, small=False):
    ink, acc, ring = VARIANTS[variant]
    g = SMALL if small else FULL
    pts = [pol(C, C, R, a) for a in LOOP]
    lit_cut = g["cr"] + g["gap"] + (RING if ring else 0)
    if small:  # one ring from the lit node's cut to a square end hidden under the last node
        segs = [ring_segment(LOOP[0], LOOP[-1], g["w"], lit_cut, 0)]
    else:
        cuts = [lit_cut] + [g["nr"] + g["gap"]] * 5
        segs = [ring_segment(LOOP[i], LOOP[i + 1], g["w"], cuts[i], cuts[i + 1]) for i in range(5)]
    body = f'<path fill="{ink}" d="{"".join(segs)}"/>'
    body += "".join(circle(x, y, g["nr"], ink) for x, y in pts[1:])
    body += lit_node(*pts[0], g["cr"], ink, acc, ring)
    return body


# ---------------------------------------------------------------- wordmark (baseline y=0, x-height 20)
SW, GAP = 3.4, 5.0
GLYPHS = [
    ("c", 20, lambda o: [sector(o + 10, -10, 10, SW, 40, 320)]),
    ("y", 20, lambda o: [bar(o + 1, -20, o + 12.2, -3, SW), bar(o + 19, -20, o + 7, 10, SW)]),
    ("t", 16, lambda o: [bar(o + 7, -28, o + 7, -8, SW), bar(o, -20, o + 16, -20, SW), sector(o + 15, -8, 8, SW, 180, 270)]),
    ("o", 20, lambda o: [annulus(o + 10, -10, 10, SW)]),
    ("g", 20, lambda o: [annulus(o + 10, -10, 10, SW), bar(o + 20, -10, o + 20, 2, SW), sector(o + 12, 2, 8, SW, -160, 0)]),
    ("e", 20, lambda o: [sector(o + 10, -10, 10, SW, 0, 320), bar(o, -10, o + 20, -10, SW)]),
    ("n", 20, lambda o: [bar(o, 0, o, -20, SW), sector(o + 10, -10, 10, SW, 0, 180), bar(o + 20, -10, o + 20, 0, SW)]),
    ("t", 16, lambda o: [bar(o + 7, -28, o + 7, -8, SW), bar(o, -20, o + 16, -20, SW), sector(o + 15, -8, 8, SW, 180, 270)]),
]


def wordmark_body(variant):
    ink = VARIANTS[variant][0]
    x, paths = SW / 2, []
    for _, w, fn in GLYPHS:
        paths.append("".join(fn(x)))
        x += w + SW + GAP
    # one <path> per letter: overlapping parts inside a letter stay solid with nonzero fill
    return "".join(f'<path fill="{ink}" d="{d}"/>' for d in paths)


# ---------------------------------------------------------------- lockups
MARK_INK_TOP, MARK_INK_BOTTOM = 5.9, 58.1  # ink extent of the full mark on the 64 grid


def logo_body(variant):
    """Horizontal: mark centred on the x-height, wordmark at 1.15."""
    s, base = 0.95, 44
    my = base - 11.5 * 1.15 - (MARK_INK_TOP + MARK_INK_BOTTOM) / 2 * s
    return (f'<g transform="translate(0 {f(my)}) scale({s})">{mark_body(variant)}</g>'
            f'<g transform="translate(66 {base}) scale(1.15)">{wordmark_body(variant)}</g>')


def stacked_body(variant):
    """Mark above, wordmark below, centred (x positions are corrected after measuring)."""
    return (f'<g id="m" transform="translate(0 0) scale(1.5)">{mark_body(variant)}</g>'
            f'<g id="w" transform="translate(0 {f(MARK_INK_BOTTOM * 1.5 + 22 + 28)})">{wordmark_body(variant)}</g>')


def svg(vb, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img">'
            f"<title>Cytogent</title>{body}</svg>")


def build():
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()

        def bbox(body, sel="svg"):
            pg.set_content(svg("0 0 10 10", body))
            return pg.evaluate(f"(() => {{ const r = document.querySelector('{sel}').getBBox(); return [r.x, r.y, r.width, r.height]; }})()")

        def tight(body):
            x, y, w, h = bbox(body)
            x0, y0 = math.floor(x * 10) / 10, math.floor(y * 10) / 10
            x1, y1 = math.ceil((x + w) * 10) / 10, math.ceil((y + h) * 10) / 10
            return svg(f"{f(x0)} {f(y0)} {f(x1 - x0)} {f(y1 - y0)}", body)

        def stacked(variant):
            body = stacked_body(variant)
            pg.set_content(svg("0 0 10 10", body))
            mx, _, mw, _ = pg.evaluate("(() => { const r = document.getElementById('m').getBBox(); return [r.x*1.5, r.y, r.width*1.5, r.height]; })()")
            wx, _, ww, _ = pg.evaluate("(() => { const r = document.getElementById('w').getBBox(); return [r.x, r.y, r.width, r.height]; })()")
            shift = (wx + ww / 2) - (mx + mw / 2)
            return tight(body.replace('id="m" transform="translate(0 0)', f'transform="translate({f(shift)} 0)', 1)
                             .replace('id="w" ', "", 1))

        files = {}
        for v in VARIANTS:
            files[f"cytogent-logo{v}.svg"] = tight(logo_body(v))
            files[f"cytogent-logo-stacked{v}.svg"] = stacked(v)
            files[f"cytogent-mark{v}.svg"] = tight(mark_body(v))
            files[f"cytogent-mark-small{v}.svg"] = tight(mark_body(v, small=True))
            files[f"cytogent-wordmark{v}.svg"] = tight(wordmark_body(v))
        for name, s in files.items():
            (OUT / name).write_text(s + "\n")

        # ---- favicons and app icons: light mark on a canvas tile, so they read on light and dark tabs
        def square(body, size, pad, bg, radius=0):
            """Centre `body` (64 grid) in a size×size tile."""
            x, y, w, h = bbox(body)
            s = (size * (1 - 2 * pad)) / max(w, h)
            tx, ty = size / 2 - (x + w / 2) * s, size / 2 - (y + h / 2) * s
            rect = f'<rect width="{size}" height="{size}" rx="{radius}" fill="{bg}"/>' if bg else ""
            return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">'
                    f'{rect}<g transform="translate({f(tx)} {f(ty)}) scale({f(s)})">{body}</g></svg>')

        def png(svg_txt, size, path):
            page = b.new_page(viewport={"width": size, "height": size}, device_scale_factor=1)
            page.set_content(f'<body style="margin:0">{svg_txt}</body>')
            page.screenshot(path=str(path), omit_background=True)
            page.close()

        small, full = mark_body("", small=True), mark_body("")
        for size in (16, 32):
            png(square(small, size, 0.1, CANVAS, size * 0.2), size, FAV / f"_ico-{size}.png")
        png(square(full, 48, 0.12, CANVAS, 48 * 0.2), 48, FAV / "_ico-48.png")
        ico = [Image.open(FAV / f"_ico-{s}.png").convert("RGBA") for s in (48, 32, 16)]
        ico[0].save(FAV / "favicon.ico", format="ICO", sizes=[(48, 48), (32, 32), (16, 16)], append_images=ico[1:])
        preview = HERE / "final-px"
        preview.mkdir(exist_ok=True)
        for s in (16, 32, 48):
            (FAV / f"_ico-{s}.png").replace(preview / f"favicon-{s}.png")
        png(square(full, 180, 0.2, CANVAS), 180, FAV / "apple-icon.png")
        png(square(full, 192, 0.18, CANVAS), 192, FAV / "icon-192.png")
        png(square(full, 512, 0.18, CANVAS), 512, FAV / "icon-512.png")
        png(square(full, 512, 0.27, CANVAS), 512, FAV / "icon-maskable-512.png")  # inside the 80% safe circle

        # SVG favicon follows the browser theme: dark ink on light tabs, light ink on dark tabs
        x, y, w, h = bbox(mark_body("-on-light", small=True))
        side = max(w, h) + 4
        icon = mark_body("-on-light", small=True).replace(f'fill="{CANVAS}"', 'class="i"')
        (FAV / "icon.svg").write_text(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{f(x + w / 2 - side / 2)} {f(y + h / 2 - side / 2)} {f(side)} {f(side)}">'
            f"<style>.i{{fill:{CANVAS}}}@media (prefers-color-scheme:dark){{.i{{fill:{TEXT}}}}}</style>{icon}</svg>\n")

        board(b, files)
        b.close()


def board(b, files):
    def tile(bg, fg, inner, label, h):
        sized = inner.replace("<svg ", f'<svg style="height:{h}px;width:auto;max-width:100%" ', 1)
        return f'<div class="t" style="background:{bg};color:{fg}"><div class="a">{sized}</div><span>{label}</span></div>'

    rows = []
    looks = [("", CANVAS, TEXT, "Full colour · on dark"), ("-on-light", WHITE, CANVAS, "Full colour · on light"),
             ("-mono-white", "#2a3a4a", WHITE, "Mono white"), ("-mono-dark", "#dfe7ea", CANVAS, "Mono dark")]
    for name, h in (("cytogent-logo", 56), ("cytogent-logo-stacked", 120), ("cytogent-mark", 110), ("cytogent-wordmark", 40)):
        rows.append(f'<h2>{name}</h2><div class="r">' + "".join(
            tile(bg, fg, files[f"{name}{v}.svg"], label, h) for v, bg, fg, label in looks) + "</div>")
    fav = FAV.relative_to(HERE.parent.parent)
    icons = (f'<h2>Favicons and app icons</h2><div class="r f">'
             f'<div class="t" style="background:#fff;color:{CANVAS}"><div class="a"><img src="../../{fav}/icon.svg" width="16"><img src="../../{fav}/icon.svg" width="32"><img src="../../{fav}/icon.svg" width="64"></div><span>icon.svg · light tab · 16 / 32 / 64</span></div>'
             f'<div class="t" style="background:#202124;color:#fff"><div class="a"><img src="../../{fav}/apple-icon.png" width="60"><img src="../../{fav}/icon-maskable-512.png" width="60" style="border-radius:50%"></div><span>apple-icon · maskable (circle crop)</span></div>'
             f'<div class="t" style="background:#fff;color:{CANVAS}"><div class="a"><img src="final-px/favicon-16.png" width="16"><img src="final-px/favicon-32.png" width="32">'
             f'<img src="final-px/favicon-16.png" width="96" style="image-rendering:pixelated"><img src="final-px/favicon-32.png" width="96" style="image-rendering:pixelated"></div><span>favicon.ico frames · 16 / 32 · enlarged</span></div>'
             f'</div>')
    html = f"""<!doctype html><meta charset="utf-8"><style>
body{{margin:0;padding:36px;background:#0b1522;color:{TEXT};font:14px/1.5 -apple-system,Helvetica,Arial,sans-serif;width:1600px}}
h1{{font-size:24px;margin:0 0 4px}} p{{color:#9db3bf;margin:0 0 20px}} h2{{font:12px ui-monospace,Menlo,monospace;color:#9db3bf;margin:22px 0 8px}}
.r{{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}} .r.f{{grid-template-columns:repeat(3,1fr)}}
.t{{border:1px solid #1b3448;border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:10px;min-height:120px}}
.a{{flex:1;display:flex;align-items:center;justify-content:center;gap:20px}} .t span{{font:11px ui-monospace,Menlo,monospace;opacity:.65}}
</style><h1>Cytogent · final logo system · 1A Refined loop</h1>
<p>Outlined SVG (no strokes, masks, fonts or rasters). Signal #42E8C8 · text #EAF4F5 · canvas #050B14. Trademark clearance not done.</p>
{"".join(rows)}{icons}"""
    page = b.new_page(viewport={"width": 1672, "height": 900}, device_scale_factor=1.5)
    tmp = HERE / "_logo-final.html"
    tmp.write_text(html)
    page.goto(tmp.as_uri())
    page.screenshot(path=str(HERE / "logo-final.png"), full_page=True)
    page.close()


if __name__ == "__main__":
    build()
    print("ok")
