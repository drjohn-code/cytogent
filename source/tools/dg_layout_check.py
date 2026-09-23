"""Diagram layout check.
Measures every diagram canvas on every page of the built site at four widths, then draws each diagram at those
sizes through a full animation cycle with the inspector hook on, and reports text that leaves the frame, text or
chips that overlap each other or an icon, titles wider than their card, and lines drawn over things they do not connect.
Usage: serve dist/ on :8765, then  python3 tools/dg_layout_check.py
"""
import os, sys, json, base64
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = 'http://127.0.0.1:8765'
def b64(p): return base64.b64encode(open(p, 'rb').read()).decode()
routes = [p['path'] for p in json.load(open(os.path.join(ROOT, '_og_pages.json')))]
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page()
    seen = {}
    for W in (1440, 1024, 768, 390):
        pg.set_viewport_size({'width': W, 'height': 900})
        for r in routes:
            pg.goto(BASE + r); pg.wait_for_timeout(120)
            for x in pg.evaluate("[...document.querySelectorAll('canvas.dg')].map(c=>{const r=c.getBoundingClientRect(); return {kind:c.dataset.kind, cfg:c.dataset.cfg||null, w:r.width, h:r.height}})"):
                k = min(1, x['w'] / 400); key = (x['kind'], x['cfg'] or '', round(x['w'] / k), round(x['h'] / k))
                seen.setdefault(key, set()).add(W)
    cases = [{'kind': k[0], 'cfg': json.loads(k[1]) if k[1] else None, 'W': k[2], 'H': k[3], 'id': '%s %dx%d @%s' % (k[0], k[2], k[3], '/'.join(map(str, sorted(v))))} for k, v in sorted(seen.items())]
    G = 'data:font/woff2;base64,' + b64(os.path.join(ROOT, 'static/fonts/Geist-Latin.woff2')); M = 'data:font/woff2;base64,' + b64(os.path.join(ROOT, 'static/fonts/GeistMono-Latin.woff2'))
    html = ('<!doctype html><meta charset="utf-8"><style>@font-face{font-family:"Geist";src:url(%s)}@font-face{font-family:"Geist Mono";src:url(%s)}</style>'
            '<span style="font-family:Geist">a</span><span style="font-family:\'Geist Mono\'">a</span><script>%s</script><script>%s</script><script>%s</script>'
            % (G, M, open(os.path.join(ROOT, 'src/js/cell.js')).read(), open(os.path.join(ROOT, 'src/js/diagrams.js')).read(), open(os.path.join(ROOT, 'tools/dg_check.js')).read()))
    tmp = os.path.join(ROOT, '_dgcheck.html'); open(tmp, 'w').write(html)
    pg.goto('file://' + tmp); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(300)
    res = pg.evaluate('(a)=>runChecks(a[0],a[1])', [cases, {'tmax': 20, 'dt': 0.35}])
    b.close(); os.remove(tmp)
print('%d diagram sizes checked, %d findings' % (len(cases), len(res)))
for r in sorted(res, key=lambda r: r['key']): print('%4d  %s   @t=%s' % (r['n'], r['key'], ','.join(str(t) for t in r['ts'][:3])))
