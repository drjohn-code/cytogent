"""Fast SEO check of the built site. Reads the HTML files in dist/ (no browser, no server) and exits 1 on any problem.
make.sh runs it after build.py and og.py and before the rsync, so a failing build never reaches site/.

Every page in dist/:
- title: present, up to 60 characters; description: present, 70 to 155 characters; both unique across the site
- canonical: ORIGIN + the page path
- exactly one <h1>
- every <img>: alt (alt="" is fine for decorative images), width and height, and a src that exists in dist/
- og:title, og:description, og:url, og:image (the file exists), og:image:alt, og:locale,
  twitter:card, twitter:title, twitter:description, twitter:image (the file exists), twitter:image:alt
- every JSON-LD block parses
sitemap.xml lists every indexable page, no noindex page and nothing else, each with a <lastmod> date.
robots.txt links to the sitemap.
site/404.html (written by hand): title, one <h1>, alt on images, noindex.
Usage, from source/:  python3 tools/seo_check.py
"""
import os, re, sys, json
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
PAGE_404 = os.path.join(os.path.dirname(ROOT), 'site', '404.html')
sys.path.insert(0, os.path.join(ROOT, 'src'))
from content import SITE  # noqa: E402
ORIGIN = SITE['origin']

TITLE_MAX, DESC_MIN, DESC_MAX = 60, 70, 155
NEEDED = ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'og:locale',
          'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']


class Page(HTMLParser):
    """Collects the parts of a page the check looks at."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title, self.meta, self.canonical = None, {}, None
        self.h1, self.imgs, self.ld = 0, [], []
        self._in = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'title':
            self._in, self.title = 'title', ''
        elif tag == 'meta':
            key = a.get('name') or a.get('property')
            if key: self.meta[key] = a.get('content')
        elif tag == 'link' and 'canonical' in (a.get('rel') or '').split():
            self.canonical = a.get('href')
        elif tag == 'h1':
            self.h1 += 1
        elif tag == 'img':
            self.imgs.append(a)
        elif tag == 'script' and a.get('type') == 'application/ld+json':
            self._in = 'ld'; self.ld.append('')

    def handle_endtag(self, tag):
        if tag in ('title', 'script'): self._in = None

    def handle_data(self, data):
        if self._in == 'title': self.title += data
        elif self._in == 'ld': self.ld[-1] += data


def parse(path):
    p = Page(); p.feed(open(path, encoding='utf-8').read()); return p


def local(url):
    """The file in dist/ that a site URL points to, or None for another host."""
    if url.startswith(ORIGIN): url = url[len(ORIGIN):]
    if not url.startswith('/'): return None
    return os.path.join(DIST, url.split('?')[0].split('#')[0].lstrip('/'))


def check_imgs(where, p, bad):
    for im in p.imgs:
        src = im.get('src') or ''
        if 'alt' not in im: bad('%s: <img src="%s"> has no alt' % (where, src))
        if not im.get('width') or not im.get('height'): bad('%s: <img src="%s"> has no width and height' % (where, src))
        f = local(src)
        if not src or (f is not None and not os.path.isfile(f)): bad('%s: <img src="%s"> points to a missing file' % (where, src))


def main():
    issues = []
    bad = issues.append
    if not os.path.isdir(DIST):
        print('dist/ is missing: run build.py first'); sys.exit(1)
    pages = {}
    for d, _, files in os.walk(DIST):
        if 'index.html' in files:
            rel = os.path.relpath(d, DIST)
            pages['/' if rel == '.' else '/%s/' % rel.replace(os.sep, '/')] = parse(os.path.join(d, 'index.html'))
    titles, descs, indexable = {}, {}, set()
    for path in sorted(pages):
        p = pages[path]
        t, d = (p.title or '').strip(), (p.meta.get('description') or '').strip()
        if not t: bad('%s: no <title>' % path)
        elif len(t) > TITLE_MAX: bad('%s: title is %d characters (max %d)' % (path, len(t), TITLE_MAX))
        if not d: bad('%s: no meta description' % path)
        elif not DESC_MIN <= len(d) <= DESC_MAX:
            bad('%s: description is %d characters (%d to %d)' % (path, len(d), DESC_MIN, DESC_MAX))
        if t: titles.setdefault(t, []).append(path)
        if d: descs.setdefault(d, []).append(path)
        if p.canonical != ORIGIN + path: bad('%s: canonical is %s, not %s' % (path, p.canonical, ORIGIN + path))
        if p.h1 != 1: bad('%s: %d <h1> elements' % (path, p.h1))
        check_imgs(path, p, bad)
        for k in NEEDED:
            if not (p.meta.get(k) or '').strip(): bad('%s: no %s' % (path, k))
        for k in ('og:image', 'twitter:image'):
            v = p.meta.get(k) or ''
            f = local(v)
            if v and (f is None or not os.path.isfile(f)): bad('%s: %s %s is not a file in dist/' % (path, k, v))
        if p.meta.get('og:url') and p.meta['og:url'] != ORIGIN + path: bad('%s: og:url is %s' % (path, p.meta['og:url']))
        for n, block in enumerate(p.ld, 1):
            try: json.loads(block)
            except ValueError as e: bad('%s: JSON-LD block %d does not parse (%s)' % (path, n, e))
        if 'noindex' not in (p.meta.get('robots') or ''): indexable.add(path)
    for k, v in titles.items():
        if len(v) > 1: bad('same title on %s' % ', '.join(v))
    for k, v in descs.items():
        if len(v) > 1: bad('same description on %s' % ', '.join(v))

    # sitemap: exactly the indexable pages
    sm_path = os.path.join(DIST, 'sitemap.xml')
    if not os.path.exists(sm_path):
        bad('sitemap.xml is missing')
    else:
        sm = open(sm_path, encoding='utf-8').read()
        urls = re.findall(r'<url>(.*?)</url>', sm, re.S)
        locs = []
        for u in urls:
            loc = re.search(r'<loc>(.*?)</loc>', u)
            if not loc: bad('sitemap: a <url> has no <loc>'); continue
            locs.append(loc.group(1))
            if not re.search(r'<lastmod>\d{4}-\d{2}-\d{2}</lastmod>', u): bad('sitemap: %s has no <lastmod> date' % loc.group(1))
        listed = set()
        for loc in locs:
            path = loc[len(ORIGIN):] if loc.startswith(ORIGIN) else loc
            if path in listed: bad('sitemap: %s is listed twice' % loc)
            listed.add(path)
            if path not in pages: bad('sitemap: %s is not a page in dist/' % loc)
            elif path not in indexable: bad('sitemap: %s is marked noindex' % loc)
        for path in sorted(indexable - listed): bad('sitemap: indexable page %s is missing' % path)
    robots = os.path.join(DIST, 'robots.txt')
    if not os.path.exists(robots) or 'Sitemap: %s/sitemap.xml' % ORIGIN not in open(robots, encoding='utf-8').read():
        bad('robots.txt does not link to %s/sitemap.xml' % ORIGIN)

    # the hand-written 404 page: no description or canonical needed
    if not os.path.exists(PAGE_404):
        bad('site/404.html is missing')
    else:
        p = parse(PAGE_404)
        if not (p.title or '').strip(): bad('404.html: no <title>')
        elif len(p.title.strip()) > TITLE_MAX: bad('404.html: title is %d characters' % len(p.title.strip()))
        if p.h1 != 1: bad('404.html: %d <h1> elements' % p.h1)
        if 'noindex' not in (p.meta.get('robots') or ''): bad('404.html: not marked noindex')
        check_imgs('404.html', p, bad)

    print('seo_check        %d pages, %d indexable, 404.html' % (len(pages), len(indexable)))
    if issues:
        print('\n'.join('  ' + i for i in issues))
        print('seo_check FAILED: %d problem(s)' % len(issues))
        sys.exit(1)
    print('seo_check        all passed')


if __name__ == '__main__':
    main()
