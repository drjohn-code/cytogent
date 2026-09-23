# -*- coding: utf-8 -*-
"""Open Graph images (1200x630) for every page: the page's own title on the left, the part of the Cytogent
cell its hero shows on the right. One browser session renders them all."""
import os, re, json, base64
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, 'dist')
STATIC = os.path.join(ROOT, 'static')
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
GEIST = 'data:font/woff2;base64,' + b64(os.path.join(STATIC, 'fonts', 'Geist-Latin.woff2'))
MONO = 'data:font/woff2;base64,' + b64(os.path.join(STATIC, 'fonts', 'GeistMono-Latin.woff2'))
MARK = re.sub(r'<title id="t">.*?</title>', '', open(os.path.join(STATIC, 'img', 'cytogent-mark-on-dark.svg'), encoding='utf-8').read())
CELL = open(os.path.join(ROOT, 'src', 'js', 'cell.js'), encoding='utf-8').read()

TPL = """<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:G;src:url(%(g)s) format('woff2');font-weight:100 900}
@font-face{font-family:GM;src:url(%(m)s) format('woff2');font-weight:100 900}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#05060E;font-family:G,sans-serif;color:#ECF0FF;overflow:hidden;position:relative}
canvas{position:absolute;right:0;top:0;width:700px;height:630px;
  -webkit-mask-image:radial-gradient(closest-side at 55%% 50%%,#000 60%%,transparent 100%%)}
.s{position:absolute;inset:0;background:linear-gradient(90deg,#05060E 0%%,#05060Ee6 42%%,#05060E00 64%%)}
.l{position:absolute;left:72px;top:0;bottom:0;width:600px;display:flex;flex-direction:column;justify-content:center;gap:30px}
.lk{display:flex;align-items:center;gap:14px}.lk svg{height:40px;width:auto}.lk b{font-weight:500;font-size:30px;letter-spacing:-.02em}
h1{font-size:58px;line-height:1.04;font-weight:500;letter-spacing:-.032em}
.kw{color:#B3A6FF}
.f{position:absolute;left:72px;bottom:44px;font-family:GM;font-size:15px;letter-spacing:.06em;color:#8792B5}
</style></head><body><canvas id="c"></canvas><div class="s"></div>
<div class="l"><div class="lk">%(mark)s<b>Cytogent</b></div><h1>%(h1)s</h1></div>
<div class="f">cytogent.com</div>
<script>%(js)s</script>
<script>window.CytogentCell.CellView(document.getElementById('c'), {view:'%(view)s', anim:'%(anim)s', static:true, fill:%(fill)s});</script>
</body></html>"""


def kw(s):
    return re.sub(r'<kw>(.*?)</kw>', r'<span class="kw">\1</span>', s)


def main():
    pages = json.load(open(os.path.join(ROOT, '_og_pages.json')))
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        pg = b.new_context(viewport={'width': 1200, 'height': 630}, device_scale_factor=1).new_page()
        for it in pages:
            view, anim = it['hero']
            html = TPL % {'g': GEIST, 'm': MONO, 'mark': MARK, 'h1': kw(it['h1']), 'js': CELL, 'view': view, 'anim': anim,
                          'fill': '0.36' if view == 'whole' else '0.44'}
            tmp = os.path.join(ROOT, '_og.html'); open(tmp, 'w', encoding='utf-8').write(html)
            pg.goto('file://' + tmp); pg.wait_for_timeout(700)
            pg.screenshot(path=os.path.join(DIST, it['og']), type='jpeg', quality=86)
        b.close()
    print('og images', len(pages))


if __name__ == '__main__':
    main()
