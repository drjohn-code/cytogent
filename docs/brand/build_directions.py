#!/usr/bin/env python3
"""Cytogent logo directions (BRIEF §6B): three hand-built SVG directions and a comparison board.

Run:  python3 -I docs/brand/build_directions.py     (needs: playwright + chromium)
Out:  docs/brand/directions/*.svg, docs/brand/directions/px/*.png, docs/brand/logo-directions.png

Colours are the §6 tokens only. The wordmark is custom monoline geometry drawn in code (no font
file is used, so there is no font licence to check). Strokes are NOT yet converted to outlined
fills: that is part of the final logo system after the owner picks a direction.
"""
import math
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / "directions"
PX = OUT / "px"
OUT.mkdir(exist_ok=True)
PX.mkdir(exist_ok=True)

CANVAS = "#050B14"
SIGNAL = "#42E8C8"
TEXT = "#EAF4F5"
WHITE = "#FFFFFF"

# theme -> (ink colour, accent colour, accent gets an ink outline?)
THEMES = {
    "dark": (TEXT, SIGNAL, False),
    "light": (CANVAS, SIGNAL, True),  # teal alone is weak on white, so the accent carries an ink ring
}


def f(n):
    return f"{n:.2f}".rstrip("0").rstrip(".")


def pol(cx, cy, r, deg):
    a = math.radians(deg)
    return cx + r * math.cos(a), cy - r * math.sin(a)


def arc(cx, cy, r, a1, a2):
    """Arc from a1 to a2 degrees, counter-clockwise on screen (a2 > a1)."""
    x1, y1 = pol(cx, cy, r, a1)
    x2, y2 = pol(cx, cy, r, a2)
    large = 1 if (a2 - a1) > 180 else 0
    return f"M{f(x1)} {f(y1)}A{f(r)} {f(r)} 0 {large} 0 {f(x2)} {f(y2)}"


def svg(viewbox, body, title="Cytogent"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img">'
            f"<title>{title}</title>{body}</svg>")


def accent(shape, theme, extra=""):
    ink, acc, ring = THEMES[theme]
    stroke = f' stroke="{ink}" stroke-width="1.6"' if ring else ""
    return shape.replace("/>", f' fill="{acc}"{stroke}{extra}/>')


# ---------------------------------------------------------------- Direction 1: six-node loop
D1_ANGLES = [45 + 54 * i for i in range(6)]  # open "C", gap centred on the right
D1_CHOSEN = 2  # PRIORITIZE


def d1_mark(theme, small=False):
    ink, acc, ring = THEMES[theme]
    R, sw, nr, cr = (22, 4, 5, 7.2) if small else (24, 1.6, 3.2, 4.6)
    parts = [f'<path d="{arc(32, 32, R, 45, 315)}" fill="none" stroke="{ink}" stroke-width="{sw}"/>']
    for i, a in enumerate(D1_ANGLES):
        x, y = pol(32, 32, R, a)
        if i == D1_CHOSEN:
            if not small:
                parts.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(cr + 3.4)}" fill="none" stroke="{acc if not ring else ink}" stroke-width="1"/>')
            parts.append(accent(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(cr)}"/>', theme))
        else:
            parts.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(nr)}" fill="{ink}"/>')
    return svg("0 0 64 64", "".join(parts))


# ---------------------------------------------------------------- Direction 2: aperture / well
def d2_mark(theme, small=False):
    ink, acc, ring = THEMES[theme]
    if small:
        rings = [(22, 7, 40)]  # radius, stroke, gap centre (deg)
        dot = 8
    else:
        rings = [(26, 2.4, 0), (18.5, 2.4, 120), (11, 2.4, 240)]
        dot = 4.2
    parts = []
    for r, sw, gc in rings:
        half = 55
        parts.append(f'<path d="{arc(32, 32, r, gc + half, gc + 360 - half)}" fill="none" stroke="{ink}" stroke-width="{sw}"/>')
    parts.append(accent(f'<circle cx="32" cy="32" r="{dot}"/>', theme))
    return svg("0 0 64 64", "".join(parts))


# ---------------------------------------------------------------- Direction 3: wordmark-led
def d3_monogram(theme):
    ink, acc, ring = THEMES[theme]
    R = 21
    parts = [f'<path d="{arc(32, 32, R, 48, 312)}" fill="none" stroke="{ink}" stroke-width="6"/>']
    x, y = pol(32, 32, R, 0)
    parts.append(accent(f'<circle cx="{f(x)}" cy="{f(y)}" r="5.6"/>', theme))
    return svg("0 0 64 64", "".join(parts))


# ---------------------------------------------------------------- shared custom wordmark
SW = 3.4  # wordmark stroke
GAP = 5.0


def _letters():
    """(name, width, [path d...]) on a baseline at y=0, x-height 20, circle centre (10,-10)."""
    c = (10, -10, 10)
    return [
        ("c", 20, [arc(*c, 40, 320)]),
        ("y", 20, ["M1 -20L12.2 -3", "M19 -20L7 10"]),
        ("t", 16, ["M7 -28V-8", f"M7 -8A8 8 0 0 0 15 0", "M0 -20H16"]),
        ("o", 20, ["O"]),
        ("g", 20, [f"M10 -20A10 10 0 1 0 10 0A10 10 0 1 0 10 -20Z", "M20 -10V2", "M20 2A8 8 0 0 1 4.5 4.7"]),
        ("e", 20, [arc(*c, 0, 320), "M0 -10H20"]),
        ("n", 20, ["M0 0V-20", "M0 -10A10 10 0 0 1 20 -10V0"]),
        ("t", 16, ["M7 -28V-8", f"M7 -8A8 8 0 0 0 15 0", "M0 -20H16"]),
    ]


def wordmark_body(theme, o_node=False):
    ink, acc, ring = THEMES[theme]
    x = SW / 2
    paths, dot = [], ""
    for name, w, ds in _letters():
        for d in ds:
            if d == "O":
                paths.append(f'<circle cx="{f(x + 10)}" cy="-10" r="10"/>')
                if o_node:
                    dot = accent(f'<circle cx="{f(x + 10)}" cy="-10" r="3.3"/>', theme)
                continue
            paths.append(f'<path transform="translate({f(x)} 0)" d="{d}"/>')
        x += w + SW + GAP
    width = x - GAP - SW / 2
    g = (f'<g fill="none" stroke="{ink}" stroke-width="{SW}" stroke-linecap="butt" stroke-linejoin="miter">'
         + "".join(paths) + "</g>" + dot)
    return g, width


def wordmark_svg(theme, o_node=False):
    g, w = wordmark_body(theme, o_node)
    return svg(f"-2 -34 {f(w + 4)} 50", g)


def lockup_svg(theme, mark_fn):
    """Mark left, wordmark right, centred on the x-height."""
    mark = mark_fn(theme)
    inner = mark[mark.index("</title>") + 8:-6]
    g, w = wordmark_body(theme)
    s = 1.15
    mark_size = 50
    mx = 0
    wx = mark_size + 15
    base = 44
    body = (f'<g transform="translate({mx} {f(base - 11.5 * s - mark_size / 2)}) scale({mark_size / 64})">{inner}</g>'
            f'<g transform="translate({wx} {base}) scale({s})">{g}</g>')
    total = wx + w * s
    return svg(f"-2 0 {f(total + 4)} 64", body)


def d3_lockup(theme):
    g, w = wordmark_body(theme, o_node=True)
    s = 1.15
    return svg(f"-2 0 {f(w * s + 4)} 64", f'<g transform="translate(0 44) scale({s})">{g}</g>')


DIRECTIONS = [
    dict(
        key="d1", name="1 · Six-node loop",
        mark=d1_mark, small=lambda t: d1_mark(t, True),
        lockup=lambda t: lockup_svg(t, d1_mark),
        why="Six nodes on an open ring make a “C”. The ring is the DEFINE → CONFIRM loop; the lit node is the one experiment chosen at PRIORITIZE.",
        small_note="≤32px: ring thickened, node halo dropped.",
    ),
    dict(
        key="d2", name="2 · Aperture / well",
        mark=d2_mark, small=lambda t: d2_mark(t, True),
        lockup=lambda t: lockup_svg(t, d2_mark),
        why="Concentric open arcs close in on a single point: many candidate experiments narrowing to one high-information well.",
        small_note="≤32px: three arcs reduced to one heavy arc around the point.",
    ),
    dict(
        key="d3", name="3 · Wordmark-led",
        mark=d3_monogram, small=d3_monogram,
        lockup=d3_lockup,
        why="A quiet monoline wordmark with one detail: the “o” is a well holding a single lit point. The monogram “c” is the same ring, closed by that point.",
        small_note="≤32px: the monogram carries the brand; the wordmark is for ≥96px wide.",
    ),
]


def write_all(directions=None, out=None):
    directions = directions or DIRECTIONS
    out = out or OUT
    (out / "px").mkdir(parents=True, exist_ok=True)
    files = {}
    for d in directions:
        for theme in ("dark", "light"):
            files[f"{d['key']}-mark-{theme}.svg"] = d["mark"](theme)
            files[f"{d['key']}-small-{theme}.svg"] = d["small"](theme)
            files[f"{d['key']}-lockup-{theme}.svg"] = d["lockup"](theme)
    for name, s in files.items():
        (out / name).write_text(s + "\n")
    return files


SUB = ("Hand-built SVG. Colours: canvas #050B14, signal #42E8C8, text #EAF4F5. Wordmark is custom monoline geometry "
       "(strokes, not yet outlined). On white, the lit node gets an ink ring because teal alone is weak there. "
       "Preview board only; not the final system.")


def render(files, directions=None, out=None, png="logo-directions.png",
           heading="Cytogent · logo directions", sub=SUB):
    from playwright.sync_api import sync_playwright

    directions = directions or DIRECTIONS
    out = out or OUT
    PX = out / "px"
    with sync_playwright() as p:
        b = p.chromium.launch()
        # real-pixel favicon previews at 16 and 32 (device scale 1)
        ctx = b.new_context(device_scale_factor=1)
        pg = ctx.new_page()
        for d in directions:
            for theme, bg in (("dark", CANVAS), ("light", WHITE)):
                for size in (16, 32):
                    svg_txt = files[f"{d['key']}-small-{theme}.svg"]
                    pg.set_viewport_size({"width": size, "height": size})
                    pg.set_content(f'<body style="margin:0;background:{bg}"><div style="width:{size}px;height:{size}px">'
                                   f'{svg_txt.replace("<svg ", f"<svg width={size} height={size} ", 1)}</div></body>')
                    pg.screenshot(path=str(PX / f"{d['key']}-{theme}-{size}.png"))
        ctx.close()

        cards = []
        for d in directions:
            def tile(cls, inner, label):
                return f'<div class="tile {cls}"><div class="art">{inner}</div><span>{label}</span></div>'

            def sized(s, h):
                return s.replace("<svg ", f'<svg style="height:{h}px;width:auto" ', 1)

            tiles = [
                tile("dark", sized(d["mark"]("dark"), 150), "Mark on canvas"),
                tile("light", sized(d["mark"]("light"), 150), "Mark on white"),
                tile("dark", sized(d["lockup"]("dark"), 64), "Lockup on canvas"),
                tile("light", sized(d["lockup"]("light"), 64), "Lockup on white"),
            ]
            px = ""
            for theme, cls in (("dark", "dark"), ("light", "light")):
                px += (f'<div class="tile {cls} px"><div class="art">'
                       f'<img src="{out.name}/px/{d["key"]}-{theme}-16.png" width="16" height="16" alt="">'
                       f'<img src="{out.name}/px/{d["key"]}-{theme}-32.png" width="32" height="32" alt="">'
                       f'<img class="zoom" src="{out.name}/px/{d["key"]}-{theme}-16.png" width="96" height="96" alt="">'
                       f'<img class="zoom" src="{out.name}/px/{d["key"]}-{theme}-32.png" width="128" height="128" alt="">'
                       f'</div><span>16 px · 32 px · enlarged</span></div>')
            cards.append(f'<section><h2>{d["name"]}</h2><p class="why">{d["why"]}</p>'
                         f'<div class="grid">{"".join(tiles)}</div><div class="grid one">{px}</div>'
                         f'<p class="note">{d["small_note"]}</p></section>')

        html = f"""<!doctype html><meta charset="utf-8"><style>
*{{box-sizing:border-box}}
body{{margin:0;padding:40px;background:#0b1522;color:{TEXT};font:15px/1.5 -apple-system,Helvetica,Arial,sans-serif;width:{560 * len(directions)}px}}
h1{{font-size:26px;margin:0 0 4px}} .sub{{color:#9db3bf;margin:0 0 28px}}
.cols{{display:grid;grid-template-columns:repeat({len(directions)},1fr);gap:28px}}
h2{{font-size:19px;margin:0 0 6px}} .why{{color:#c3d3da;min-height:66px;margin:0 0 14px}}
.grid{{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}} .grid.one{{grid-template-columns:1fr}}
.tile{{border:1px solid #1b3448;border-radius:8px;padding:14px;display:flex;flex-direction:column;gap:10px;min-height:150px;justify-content:space-between}}
.tile.dark{{background:{CANVAS}}} .tile.light{{background:{WHITE};color:{CANVAS}}}
.tile span{{font:11px ui-monospace,Menlo,monospace;opacity:.6}}
.art{{display:flex;align-items:center;justify-content:center;flex:1;gap:18px}}
.px{{min-height:0}} .px .art{{justify-content:flex-start}} .zoom{{image-rendering:pixelated}}
.note{{color:#9db3bf;font-size:13px;margin:6px 0 0}}
.foot{{margin-top:26px;color:#9db3bf;font-size:13px}}
</style>
<h1>{heading}</h1>
<p class="sub">{sub}</p>
<div class="cols">{"".join(cards)}</div>
<p class="foot">Trademark clearance (EUIPO / national office) not done. Replaces the retired 7-dot translation-arc / gradient mark.</p>"""
        pg = b.new_page(viewport={"width": 560 * len(directions) + 80, "height": 900}, device_scale_factor=1.5)
        board = ROOT / f"_{pathlib.Path(png).stem}.html"
        board.write_text(html)
        pg.goto(board.as_uri())
        pg.screenshot(path=str(ROOT / png), full_page=True)
        b.close()


if __name__ == "__main__":
    render(write_all())
    print("ok")
