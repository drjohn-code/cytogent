"""Full-page screenshots of every route, for docs/screenshots/: desktop (1440 wide, saved 1000 wide) and mobile (390).
The cookie bar is answered first, so it does not sit over the pages.
Usage: serve dist/ on :8765, then  python3 tools/shots_docs.py [desktop|mobile] [/path/,/path/]
"""
import os, sys, json, io
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(os.path.dirname(ROOT), 'docs', 'screenshots'); BASE = 'http://127.0.0.1:8765'
pages = [p['path'] for p in json.load(open(os.path.join(ROOT, '_og_pages.json')))]
modes = [sys.argv[1]] if len(sys.argv) > 1 and sys.argv[1] in ('desktop', 'mobile') else ['desktop', 'mobile']
only = sys.argv[2].split(',') if len(sys.argv) > 2 else None
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    for mode in modes:
        os.makedirs(os.path.join(OUT, mode), exist_ok=True)
        ctx = (b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=1, is_mobile=True, has_touch=True) if mode == 'mobile'
               else b.new_context(viewport={'width': 1440, 'height': 900}))
        ctx.add_init_script("try{localStorage.setItem('cg-consent','denied')}catch(e){}")
        pg = ctx.new_page()
        for path in pages:
            if only and path not in only: continue
            pg.goto(BASE + path, wait_until='networkidle'); pg.wait_for_timeout(900)
            H = pg.evaluate('document.body.scrollHeight'); y = 0
            while y < H:   # walk the page so every reveal and diagram is live
                pg.evaluate('window.scrollTo(0,%d)' % y); pg.wait_for_timeout(120); y += 500
            pg.wait_for_timeout(2000)
            # the pages are too tall for one capture, so they are taken a screen at a time and joined.
            # the sticky bar is pinned to the top of the page, so it appears once
            pg.add_style_tag(content='.nav{position:absolute!important;left:0;right:0;top:0!important}html{scroll-behavior:auto!important}')
            vw, vh = pg.viewport_size['width'], pg.viewport_size['height']
            H = pg.evaluate('document.documentElement.scrollHeight'); im = Image.new('RGB', (vw, H)); y = 0
            while True:
                y = min(y, max(0, H - vh)); pg.evaluate('window.scrollTo(0,%d)' % y); pg.wait_for_timeout(350)
                im.paste(Image.open(io.BytesIO(pg.screenshot())).convert('RGB').resize((vw, vh)), (0, y))
                if y + vh >= H: break
                y += vh
            if mode == 'desktop': im = im.resize((1000, int(im.height * 1000 / im.width)), Image.LANCZOS)
            name = path.strip('/').replace('/', '_') or 'home'
            im.save(os.path.join(OUT, mode, name + '.jpg'), quality=80, optimize=True)
            print(mode, name, im.size, flush=True)
        ctx.close()
    b.close()
