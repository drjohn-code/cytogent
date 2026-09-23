# -*- coding: utf-8 -*-
"""Render the hero object once, headless, and save the static poster + the OG image."""
import os, base64
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, 'dist')
HERO = open(os.path.join(ROOT, 'src', 'js', 'cell.js'), encoding='utf-8').read()
TMP = os.path.join(ROOT, '_poster.html')

PAGE = """<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;background:#07060A}
canvas{display:block;width:{W}px;height:{H}px;background:#05060e}
</style></head><body><canvas id="c"></canvas>
<script>{JS}</script>
<script>
var h = window.CytogentCell.CellView(document.getElementById('c'), {view:'whole', anim:'breathe', static:true, fill:0.44});
window.__ok = !!h;
</script></body></html>"""


def shoot(w, h, out, scale=1):
    open(TMP, 'w', encoding='utf-8').write(PAGE.replace("{W}",str(w)).replace("{H}",str(h)).replace("{JS}",HERO))
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=scale).new_page()
        pg.goto('file://' + TMP)
        pg.wait_for_timeout(2500)
        ok = pg.evaluate('window.__ok')
        pg.locator('#c').screenshot(path=out)
        b.close()
    return ok


os.makedirs(os.path.join(DIST, 'img'), exist_ok=True)
png = os.path.join(ROOT, '_hero.png')
ok = shoot(560, 560, png, scale=2)
print('webgl ok:', ok)

im = Image.open(png).convert('RGB')
print('poster size', im.size)
im.resize((1120, 1120), Image.LANCZOS).save(os.path.join(DIST, 'img', 'hero-poster.jpg'),
                                            quality=88, optimize=True, progressive=True)
im.resize((1120, 1120), Image.LANCZOS).save(os.path.join(DIST, 'img', 'hero-poster.webp'),
                                            quality=82, method=6)
print('hero-poster.jpg', os.path.getsize(os.path.join(DIST, 'img', 'hero-poster.jpg')) // 1024, 'KB')
