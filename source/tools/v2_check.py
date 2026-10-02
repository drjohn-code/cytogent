"""v2 acceptance checks that verify_all.py does not cover.
- titles and descriptions: unique across the site; titles up to 60 characters; descriptions 70 to 155 characters
- JSON-LD: every block parses, and each page carries the types it should
- sitemap.xml and llms.txt list every public URL, and every sitemap URL has a <lastmod>
- no request to Google on any page before the visitor accepts analytics
Usage: serve dist/ on :8765, then  python3 tools/v2_check.py
"""
import os, re, json, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist'); BASE = 'http://127.0.0.1:8765'; ORIGIN = 'https://cytogent.com'
pages = [p['path'] for p in json.load(open(os.path.join(ROOT, '_og_pages.json')))]
issues = []
titles, descs, public = {}, {}, []
for path in pages:
    html = open(os.path.join(DIST, path.strip('/'), 'index.html'), encoding='utf-8').read()
    title = re.search(r'<title>(.*?)</title>', html).group(1)
    desc = re.search(r'<meta name="description" content="(.*?)">', html).group(1)
    noindex = '<meta name="robots" content="noindex">' in html
    if not noindex: public.append(path)
    if len(title) > 60: issues.append('%s: title is %d characters' % (path, len(title)))
    if not 70 <= len(desc) <= 155: issues.append('%s: description is %d characters' % (path, len(desc)))
    titles.setdefault(title, []).append(path); descs.setdefault(desc, []).append(path)
    types = []
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
        try: types.append(json.loads(block)['@type'])
        except Exception: issues.append('%s: JSON-LD does not parse' % path)
    want = ['Organization', 'WebSite', 'SoftwareApplication', 'FAQPage'] if path == '/' else ['BreadcrumbList']
    if path == '/resources/glossary/': want.append('DefinedTermSet')
    if path.startswith('/compare/') or path == '/resources/faq/' or path.startswith('/solutions/'): want.append('FAQPage')
    for w in want:
        if w not in types: issues.append('%s: JSON-LD %s is missing' % (path, w))
    if path == '/' and '"featureList"' not in html: issues.append('/: featureList is missing')
for k, v in titles.items():
    if len(v) > 1: issues.append('title used on %s' % ', '.join(v))
for k, v in descs.items():
    if len(v) > 1: issues.append('description used on %s' % ', '.join(v))
sm = open(os.path.join(DIST, 'sitemap.xml'), encoding='utf-8').read(); llms = open(os.path.join(DIST, 'llms.txt'), encoding='utf-8').read()
locs = re.findall(r'<loc>(.*?)</loc>', sm)
for path in public:
    if ORIGIN + path not in locs: issues.append('%s: not in sitemap.xml' % path)
    if ('%s%s\n' % (ORIGIN, path)) not in llms and ('%s%s)' % (ORIGIN, path)) not in llms: issues.append('%s: not in llms.txt' % path)
for loc in locs:
    if loc.replace(ORIGIN, '') not in public: issues.append('%s: in the sitemap but not a public page' % loc)
if sm.count('<lastmod>') != len(locs): issues.append('sitemap: %d URLs, %d lastmod' % (len(locs), sm.count('<lastmod>')))
with sync_playwright() as p:
    b = p.chromium.launch()
    for path in pages + ['/404.html']:
        ctx = b.new_context(viewport={'width': 1280, 'height': 800}); pg = ctx.new_page(); hits, errs = [], []
        pg.on('request', lambda r: hits.append(r.url) if re.search(r'google|gtag|doubleclick', r.url) else None)
        pg.on('pageerror', lambda e: errs.append(str(e)))
        if path == '/404.html' and not os.path.exists(os.path.join(DIST, '404.html')):
            pg.goto('file://' + os.path.join(os.path.dirname(ROOT), 'site', '404.html'))
        else:
            pg.goto(BASE + path, wait_until='networkidle')
        pg.wait_for_timeout(300)
        if hits: issues.append('%s: %d request(s) to Google before consent' % (path, len(hits)))
        if not pg.evaluate("!!document.getElementById('cookiebar') && !document.getElementById('cookiebar').hidden"): issues.append('%s: no cookie bar on a first visit' % path)
        if errs: issues.append('%s: %s' % (path, errs[0]))
        ctx.close()
    b.close()
print('%d pages, %d public, %d sitemap URLs' % (len(pages), len(public), len(locs)))
print('\n'.join(issues) if issues else 'ALL V2 CHECKS PASSED')
sys.exit(1 if issues else 0)
