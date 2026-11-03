#!/usr/bin/env python3
"""Direction 1 (six-node loop) redesigns: four variants on one board.

Run:  python3 docs/brand/build_d1_variants.py      (needs: playwright + chromium)
Out:  docs/brand/d1-variants/*.svg, docs/brand/d1-variants/px/*.png, docs/brand/logo-d1-variants.png
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from build_directions import ROOT, THEMES, accent, arc, f, lockup_svg, pol, render, svg, write_all  # noqa: E402

OUT = ROOT / "d1-variants"
LOOP = [45, 99, 153, 207, 261, 315]  # open "C", gap centred on the right


def masked(uid, paths, holes):
    """Ring paths with a clear gap cut around each hole (x, y, r). Background-independent."""
    cut = "".join(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="#000"/>' for x, y, r in holes)
    return (f'<defs><mask id="{uid}" maskUnits="userSpaceOnUse" x="-8" y="-8" width="80" height="80">'
            f'<rect x="-8" y="-8" width="80" height="80" fill="#fff"/>{cut}</mask></defs>'
            f'<g mask="url(#{uid})">{paths}</g>')


def ring(R, a1, a2, sw, ink):
    return f'<path d="{arc(32, 32, R, a1, a2)}" fill="none" stroke="{ink}" stroke-width="{sw}"/>'


def node(x, y, r, ink):
    return f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{ink}"/>'


def lit(x, y, r, theme):
    return accent(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}"/>', theme)


# ---------------------------------------------------------------- 1A refined loop
def v1a(theme, small=False):
    ink, _, outline = THEMES[theme]
    R, sw, nr, cr, gap = (22, 5.5, 5.5, 7.6, 2.6) if small else (22, 3.2, 4.4, 5.8, 1.5)
    pts = [pol(32, 32, R, a) for a in LOOP]
    holes = [(x, y, (cr if i == 0 else nr) + gap + (0.8 if outline and i == 0 else 0))
             for i, (x, y) in enumerate(pts) if i == 0 or not small]
    body = masked(f"v1a-{theme}-{int(small)}", ring(R, 45, 315, sw, ink), holes)
    if not small:
        body += "".join(node(x, y, nr, ink) for x, y in pts[1:])
    body += lit(*pts[0], cr, theme)
    return svg("0 0 64 64", body)


# ---------------------------------------------------------------- 1B perforated strip
def v1b(theme, small=False):
    ink, _, outline = THEMES[theme]
    R, sw = 21, 10
    a1, a2 = 64, 330
    holes = [] if small else [(*pol(32, 32, R, a1 + (a2 - a1) * (k + 0.5) / 5), 2.7) for k in range(5)]
    body = masked(f"v1b-{theme}-{int(small)}", ring(R, a1, a2, sw, ink), holes)
    body += lit(*pol(32, 32, R, 36), 7 if small else 6.4, theme)
    return svg("0 0 64 64", body)


# ---------------------------------------------------------------- 1C tightening spiral
def v1c(theme, small=False):
    ink, _, outline = THEMES[theme]
    a0, a1, r0, r1 = 45, 400, 25, 6

    def at(t):  # t in 0..1 along the spiral, counter-clockwise, radius shrinking
        return pol(32, 32, r0 - (r0 - r1) * t, a0 + (a1 - a0) * t)

    pts = [at(i / 240) for i in range(241)]
    d = "M" + "L".join(f"{f(x)} {f(y)}" for x, y in pts)
    sw, nr, cr, gap = (5, 0, 6.6, 2.2) if small else (2.8, 3.8, 5.4, 1.6)
    # nodes evenly spaced by length along the curve
    seg = [((pts[i + 1][0] - pts[i][0]) ** 2 + (pts[i + 1][1] - pts[i][1]) ** 2) ** 0.5 for i in range(240)]
    total, run, nodes = sum(seg), 0, [pts[0]]
    for i, s in enumerate(seg):
        run += s
        if len(nodes) < 6 and run >= total * len(nodes) / 5 - 1e-6:
            nodes.append(pts[i + 1])
    nodes = nodes[:5] + [pts[-1]]
    path = f'<path d="{d}" fill="none" stroke="{ink}" stroke-width="{sw}" stroke-linejoin="round"/>'
    holes = [(x, y, (cr if k == 5 else nr) + gap + (0.8 if outline and k == 5 else 0))
             for k, (x, y) in enumerate(nodes) if k == 5 or not small]
    body = masked(f"v1c-{theme}-{int(small)}", path, holes)
    if not small:
        body += "".join(node(x, y, nr, ink) for x, y in nodes[:5])
    body += lit(*nodes[5], cr, theme)
    # the spiral is lopsided: centre it optically on its ink bounds
    pad = max(sw / 2, nr)
    xs, ys = [x for x, _ in pts], [y for _, y in pts]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    s = 54 / (max(max(xs) - min(xs), max(ys) - min(ys)) + 2 * pad)
    return svg("0 0 64 64", f'<g transform="translate(32 32) scale({f(s)}) translate({f(-cx)} {f(-cy)})">{body}</g>')


# ---------------------------------------------------------------- 1D focus
def v1d(theme, small=False):
    ink, _, _ = THEMES[theme]
    if small:
        return svg("0 0 64 64", ring(23, 45, 315, 6, ink) + lit(32, 32, 8.5, theme))
    R, sw, nr = 24, 2.6, 4
    pts = [pol(32, 32, R, 45 + 67.5 * k) for k in range(5)]
    body = masked(f"v1d-{theme}-0", ring(R, 45, 315, sw, ink), [(x, y, nr + 1.6) for x, y in pts])
    body += "".join(node(x, y, nr, ink) for x, y in pts)
    body += lit(32, 32, 7, theme)
    return svg("0 0 64 64", body)


def variant(key, name, fn, why, small_note):
    return dict(key=key, name=name, mark=fn, small=lambda t: fn(t, True),
                lockup=lambda t: lockup_svg(t, fn), why=why, small_note=small_note)


VARIANTS = [
    variant("v1a", "1A · Refined loop", v1a,
            "Closest to the original. Heavier ring; each node sits in a clean cut, like an instrument dial. "
            "The lit node moves to the top terminal, where the eye starts, so the mark balances without a halo.",
            "≤32px: ring and nodes merge into a solid “C”; the lit node keeps its cut."),
    variant("v1b", "1B · Perforated strip", v1b,
            "The loop as a strip of five wells bent into a “C”; the sixth well has left the strip and is lit. "
            "Bold enough to hold its own next to the wordmark.",
            "≤32px: perforations dropped; solid “C” plus lit well."),
    variant("v1c", "1C · Tightening spiral", v1c,
            "The loop does not return to where it started: each pass narrows. Five nodes ride a spiral that closes "
            "in on the sixth, lit node: uncertainty narrowing into one chosen experiment.",
            "≤32px: nodes merge into the spiral; the lit end keeps its cut."),
    variant("v1d", "1D · Focus", v1d,
            "Five nodes stay on the loop; the chosen experiment moves to the centre. The loop exists to put one thing in focus.",
            "≤32px: nodes merge into the ring; “C” around a lit centre."),
]

if __name__ == "__main__":
    files = write_all(VARIANTS, OUT)
    render(files, VARIANTS, OUT, png="logo-d1-variants.png",
           heading="Cytogent · Direction 1 redesigns (six-node loop)")
    print("ok")
