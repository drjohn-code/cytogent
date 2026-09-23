# -*- coding: utf-8 -*-
"""Check every built page: contrast, headings, meta, JSON-LD, links, mobile overflow, reduced motion."""
import os, json, re, sys
from playwright.sync_api import sync_playwright
from verify import CONTRAST, GL
ROOT = os.path.dirname(os.path.abspath(__file__)); DIST = os.path.join(ROOT, 'dist')
BASE = 'http://127.0.0.1:8765'
pages = [p['path'] for p in json.load(open(os.path.join(ROOT, '_og_pages.json')))]
built_all = set(pages)
if len(sys.argv) > 1: pages = sys.argv[1].split(',')
built = built_all
issues = []
META = """() => ({
  title: document.title, desc: (document.querySelector('meta[name=description]')||{}).content||'',
  canonical: (document.querySelector('link[rel=canonical]')||{}).href||'',
  og: (document.querySelector('meta[property="og:image"]')||{}).content||'',
  h1: document.querySelectorAll('h1').length,
  headings: [...document.querySelectorAll('main h1, main h2, main h3, main h4')].map(h=>+h.tagName[1]),
  ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>{try{return JSON.parse(s.textContent)['@type']}catch(e){return 'BAD'}}),
  links: [...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')),
  ids: [...document.querySelectorAll('[id]')].map(e=>e.id),
  canvasNoLabel: [...document.querySelectorAll('canvas')].filter(c=>!c.getAttribute('aria-label') && c.getAttribute('aria-hidden')!=='true').length,
  unlabelled: [...document.querySelectorAll('input,select,textarea')].filter(i=>i.type!=='hidden' && !(i.id && document.querySelector('label[for="'+i.id+'"]')) && !i.closest('label')).length,
})"""
with sync_playwright() as p:
    b = p.chromium.launch(args=GL)
    dctx = b.new_context(viewport={'width': 1440, 'height': 900}); d = dctx.new_page()
    mctx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True); m = mctx.new_page()
    rctx = b.new_context(viewport={'width': 1440, 'height': 900}, reduced_motion='reduce'); r = rctx.new_page()
    errs = []
    for pg in (d, m, r):
        pg.on('pageerror', lambda e: errs.append(str(e)))
    for path in pages:
        errs.clear()
        d.goto(BASE + path, wait_until='networkidle'); d.wait_for_timeout(600)
        # scroll so every reveal and diagram is live, then check contrast
        H = d.evaluate('document.body.scrollHeight'); y = 0
        while y < H:
            d.evaluate('window.scrollTo(0,%d)' % y); d.wait_for_timeout(60); y += 700
        d.wait_for_timeout(2400)
        meta = d.evaluate(META); con = d.evaluate(CONTRAST)
        if con: d.wait_for_timeout(1500); con = d.evaluate(CONTRAST)  # re-check once: a colour may be mid-transition
        def bad(msg): issues.append('%s: %s' % (path, msg))
        if con: bad('contrast %s' % con[:3])
        if meta['h1'] != 1: bad('h1 count %d' % meta['h1'])
        hs = meta['headings']
        for a_, b_ in zip(hs, hs[1:]):
            if b_ > a_ + 1: bad('heading skip %s' % hs); break
        if not (10 <= len(meta['title']) <= 60): bad('title length %d' % len(meta['title']))
        if not (70 <= len(meta['desc']) <= 160): bad('desc length %d' % len(meta['desc']))
        if not meta['canonical'].endswith(path): bad('canonical %s' % meta['canonical'])
        if 'BAD' in meta['ld']: bad('json-ld parse')
        if path != '/' and 'BreadcrumbList' not in meta['ld']: bad('no breadcrumb')
        if meta['canvasNoLabel']: bad('canvas without label')
        if meta['unlabelled']: bad('unlabelled inputs %d' % meta['unlabelled'])
        og = meta['og'].split('/')[-1]
        if not os.path.exists(os.path.join(DIST, og)): bad('missing og image %s' % og)
        for href in meta['links']:
            if href.startswith('#'):
                if href[1:] and href[1:] not in meta['ids']: bad('broken anchor %s' % href)
                continue
            if href.startswith('http') or href.startswith('mailto:'): continue
            pth = href.split('?')[0].split('#')[0]
            if pth not in built: bad('broken link %s' % href)
        # mobile
        m.goto(BASE + path, wait_until='networkidle'); m.wait_for_timeout(500)
        H = m.evaluate('document.body.scrollHeight'); y = 0
        while y < H:
            m.evaluate('window.scrollTo(0,%d)' % y); m.wait_for_timeout(40); y += 700
        m.wait_for_timeout(2400)
        ov = m.evaluate("() => ({sw: document.documentElement.scrollWidth, iw: innerWidth, bad: [...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && r.right > innerWidth+1 && !e.closest('.phero__stage,.hero__stage')}).slice(0,4).map(e=>e.className||e.tagName)})")
        if ov['sw'] > ov['iw'] or ov['bad']: bad('mobile overflow %s' % ov)
        mc = m.evaluate(CONTRAST)
        if mc: m.wait_for_timeout(1500); mc = m.evaluate(CONTRAST)
        if mc: bad('mobile contrast %s' % mc[:3])
        # reduced motion: nothing hidden
        r.goto(BASE + path, wait_until='networkidle'); r.wait_for_timeout(500)
        hid = r.evaluate("() => [...document.querySelectorAll('.rv,[data-rv-item]')].filter(e=>getComputedStyle(e).opacity<0.5).length")
        if hid: bad('reduced motion: %d hidden' % hid)
        if errs: bad('errors %s' % errs[:2])
        print('%-44s ok' % path if not [i for i in issues if i.startswith(path + ':')] else '%-44s CHECK' % path, flush=True)
    b.close()
print('\n'.join(issues) if issues else 'ALL CHECKS PASSED')
