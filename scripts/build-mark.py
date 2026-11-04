"""
Builds Cytogent's mark: a tumour drawn as a cluster of cells, with a small resistant clone budding out of it
in the accent colour (in one-colour versions the clone is drawn as rings, since logo files use no strokes).
Rewrites the mark inside every logo file in public/brand/ and brand/, and src/app/icon.svg, keeping each
file's viewBox, wordmark and colours.

    python3 scripts/build-mark.py
"""
from __future__ import annotations

import math
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CX, CY = 30.65, 32.0  # centre of the mark in the logo files' coordinate space


def spheroid(n: int, c: float, radius: float, seed: int):
    """Sunflower (phyllotaxis) packing: a round, organic cluster like a tumour spheroid seen in section."""
    rnd = random.Random(seed)
    golden = math.radians(137.508)
    out = []
    for i in range(n):
        rr = c * math.sqrt(i + 0.5)
        a = i * golden
        out.append([rr * math.cos(a), rr * math.sin(a), radius * rnd.uniform(0.88, 1.05)])
    return out


def split_clone(cs, count: int, centre_deg: float, bud_gap: float):
    """A contiguous patch of `count` edge cells becomes the resistant clone; one more buds outward from it."""
    far = max(math.hypot(c[0], c[1]) for c in cs)
    a = math.radians(centre_deg)
    seed = (math.cos(a) * far, math.sin(a) * far)
    clone = sorted(cs, key=lambda c: math.hypot(c[0] - seed[0], c[1] - seed[1]))[:count]
    rest = [c for c in cs if c not in clone]
    bud = [math.cos(a) * (far + bud_gap), math.sin(a) * (far + bud_gap), clone[0][2] * 0.95]
    return rest, clone + [bud]


def full_mark():
    return split_clone(spheroid(24, 3.75, 3.55, 7), 4, -42, 6.0)


def small_mark():
    return split_clone(spheroid(10, 5.6, 5.1, 3), 2, -42, 8.6)


def circle(c, fill, scale=1.0, cls=False):
    x, y, r = CX + c[0] * scale, CY + c[1] * scale, c[2] * scale
    attr = 'class="a"' if cls == "a" else 'class="i"' if cls else f'fill="{fill}"'
    return f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r:.2f}" {attr}/>'


def ring(c, fill, scale=1.0):
    x, y, r = CX + c[0] * scale, CY + c[1] * scale, c[2] * scale
    ri = r * 0.55

    def arc(rr):
        return f"M{x - rr:.2f} {y:.2f}a{rr:.2f} {rr:.2f} 0 1 0 {2 * rr:.2f} 0a{rr:.2f} {rr:.2f} 0 1 0 {-2 * rr:.2f} 0Z"

    return f'<path fill="{fill}" fill-rule="evenodd" d="{arc(r)}{arc(ri)}"/>'


def mark_svg(body: str, accent: str | None, small=False, scale=1.0):
    cs, clone = small_mark() if small else full_mark()
    parts = [circle(c, body, scale) for c in cs]
    parts += [circle(c, accent, scale) if accent else ring(c, body, scale) for c in clone]
    return "".join(parts)


def colours(svg: str):
    fills = re.findall(r'fill="(#[0-9A-Fa-f]{6})"', svg)
    body = max(set(fills), key=fills.count)
    others = [f for f in set(fills) if f != body]
    return body, (others[0] if others else None)


def rewrite(path: Path):
    s = path.read_text()
    body, accent = colours(s)
    small = "mark-small" in path.name
    groups = list(re.finditer(r'<g transform="[^"]*">(.*?)</g>', s, re.S))
    mark_group = next((g for g in groups if "<circle" in g.group(1)), None)
    if mark_group:  # lockups: replace the inside of the mark's group
        new = mark_svg(body, accent, small)
        s = s[: mark_group.start(1)] + new + s[mark_group.end(1) :]
    elif "<circle" in s:  # mark-only files
        head = s[: s.index("</title>") + len("</title>")]
        s = head + mark_svg(body, accent, small) + "</svg>"
    else:
        return
    if "on-light" in path.name:  # the azure accent is too pale on white; use the deeper blue
        s = s.replace("#7AA7FF", "#3F6FE0")
    path.write_text(s)
    print("mark ->", path.relative_to(ROOT), "accent" if accent else "mono")


for folder in (ROOT / "public" / "brand", ROOT / "brand"):
    for p in sorted(folder.glob("cytogent-*.svg")):
        if "wordmark" not in p.name:
            rewrite(p)

# favicon: small mark, light/dark aware
icon = ROOT / "src" / "app" / "icon.svg"
cs, clone = small_mark()
body = "".join(circle(c, None, 1.0, cls=True) for c in cs) + "".join(circle(c, None, 1.0, cls="a") for c in clone)
icon.write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="2.2 2.77 58.46 58.46"><style>.i{fill:#070C1A}.a{fill:#4F7FE8}'
    "@media (prefers-color-scheme:dark){.i{fill:#EEF2FB}.a{fill:#7AA7FF}}</style>" + body + "</svg>"
)
print("mark -> src/app/icon.svg")
