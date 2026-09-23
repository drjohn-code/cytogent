# -*- coding: utf-8 -*-
"""Cytogent v2 — static site build.

Outputs:
  dist/               deployable static site (real paths, sitemap, robots, llms.txt)
  dist-artifact/      one self-contained HTML file for the Claude artifact preview
"""
import os, re, json, shutil, base64, sys, html

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
STATIC = os.path.join(ROOT, 'static')
DIST = os.path.join(ROOT, 'dist')
sys.path.insert(0, SRC)
from content import (SITE, DEFINITION, SOLUTIONS, INDUSTRIES, HOW, STORY,
                     COMPARE, SECURITY, DOORS, FAQ, FOOTER)          # noqa: E402
from pages import (SOLUTION_PAGES, INDUSTRY_PAGES, PLATFORM, DATA, SECURITY_PAGE, ABOUT, RESOURCES,  # noqa: E402
                   FAQ_PAGE, FAQ_MORE, GLOSSARY_PAGE, GLOSSARY, REQUEST, LEGAL)

read = lambda p: open(p, encoding='utf-8').read()
ORIGIN = SITE['origin']

# ---------------------------------------------------------------- assets ---
CSS = read(os.path.join(SRC, 'css', 'site.css'))
CELL_JS = read(os.path.join(SRC, 'js', 'cell.js'))
DG_JS = read(os.path.join(SRC, 'js', 'diagrams.js'))
APP_JS = read(os.path.join(SRC, 'js', 'app.js'))
MARK = read(os.path.join(STATIC, 'img', 'cytogent-mark-on-dark.svg'))   # the v1 mark, iridescent


def logo_mark(uid):
    """The Cytogent mark, with its gradient id made unique per placement."""
    s = MARK.strip()
    s = re.sub(r'<title id="t">.*?</title>', '', s)
    s = s.replace('aria-labelledby="t"', 'aria-hidden="true"')
    s = s.replace('id="cg"', 'id="cg-%s"' % uid).replace('url(#cg)', 'url(#cg-%s)' % uid)
    return s


ARROW = ('<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" '
         'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
         '<path d="M3 8h9M8.5 4.5L12 8l-3.5 3.5"/></svg>')

ICONS = {
    # Kilogent-style line icons: 24px grid, 1.5 stroke, round joins. Drawn in on reveal.
    'molecule': '<circle cx="7" cy="8" r="2.4"/><circle cx="17" cy="6.5" r="1.8"/><circle cx="15.5" cy="17" r="2.8"/>'
                '<path d="M9.2 7.2l6-.5M8.6 10l5.3 4.6"/>',
    'sheets': '<path d="M7.5 3.5h7L18 7v13.5H7.5z"/><path d="M14 3.5V7h4"/><path d="M10.5 12h5M10.5 15.5h5M10.5 19h3"/>',
    'dish': '<circle cx="12" cy="12" r="8.2"/><circle cx="9.6" cy="10.4" r="1.5"/><circle cx="14.4" cy="13" r="1.9"/>'
            '<circle cx="10.6" cy="15.4" r="1"/>',
    'seal': '<circle cx="12" cy="9.6" r="6.1"/><circle cx="12" cy="9.6" r="2.6"/>'
            '<path d="M8.6 14.6L7.4 21l4.6-2.4 4.6 2.4-1.2-6.4"/>',
    'search': '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    'compare': '<rect x="3.5" y="5" width="7" height="14" rx="1.5"/><rect x="13.5" y="5" width="7" height="14" rx="1.5"/><path d="M6 9h2M6 12h2M16 9h2M16 12h2"/>',
    'pen': '<path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 013 3L8 18.5z"/><path d="M13.5 7l3.5 3.5"/>',
    'table': '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 10h17M3.5 14.5h17M9.5 10v9"/>',
    'doc': '<path d="M7 3.5h7.5L19 8v12.5H7z"/><path d="M14.5 3.5V8H19"/><path d="M10 12h6M10 15.5h6"/>',
    'flag': '<path d="M5.5 21V4"/><path d="M5.5 4.5h11l-2.2 4 2.2 4h-11"/>',
    'export': '<path d="M14 4h6v6M20 4l-8.5 8.5"/><path d="M18 14v5.5H4.5V6H10"/>',
    'cpu': '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/>'
           '<path d="M9.5 3.5v3M14.5 3.5v3M9.5 17.5v3M14.5 17.5v3M3.5 9.5h3M3.5 14.5h3M17.5 9.5h3M17.5 14.5h3"/>',
    'rank': '<path d="M6 19.5V13M12 19.5V6M18 19.5V10"/><path d="M3.5 20.5h17"/>',
    'gauge': '<path d="M4.5 16a7.5 7.5 0 1115 0"/><path d="M12 16l3.5-4.5"/><circle cx="12" cy="16" r="1.2"/>',
    'layers': '<path d="M12 4l8.5 4.5L12 13 3.5 8.5z"/><path d="M3.5 12.5L12 17l8.5-4.5"/><path d="M3.5 16.5L12 21l8.5-4.5"/>',
    'target': '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2"/>',
    'check': '<circle cx="12" cy="12" r="8.5"/><path d="M8.2 12.3l2.6 2.6 5-5.4"/>',
    'dna': '<path d="M8 3.5c0 5 8 6 8 8.5s-8 3.5-8 8.5"/><path d="M16 3.5c0 5-8 6-8 8.5s8 3.5 8 8.5"/><path d="M9.2 7h5.6M9.2 17h5.6"/>',
    'shield': '<path d="M12 3.5l7 2.6v5.4c0 4.4-3 7.9-7 9-4-1.1-7-4.6-7-9V6.1z"/><path d="M9 12l2.2 2.2L15.2 10"/>',
    'chart': '<path d="M4 4.5v15.5h16"/><path d="M7.5 15l3.5-4 3 2.5 5-6"/>',
    'clipboard': '<rect x="5.5" y="5" width="13" height="16" rx="2"/><path d="M9 5V3.8h6V5"/><path d="M8.5 11h7M8.5 14.5h7M8.5 18h4"/>',
    'users': '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5c.6-3.3 2.7-5 5.5-5s4.9 1.7 5.5 5"/><circle cx="16.5" cy="9.5" r="2.5"/><path d="M16 14.6c2.3.1 4 1.5 4.5 4.4"/>',
    'eye': '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    'message': '<path d="M4 5.5h16v10.5H10l-4.5 3.5V16H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    'branch': '<circle cx="6.5" cy="5.5" r="2"/><circle cx="6.5" cy="18.5" r="2"/><circle cx="17.5" cy="8.5" r="2"/><path d="M6.5 7.5v9M17.5 10.5c0 4-11 2-11 6"/>',
    'folder': '<path d="M3.5 7v11.5h17V8.5h-9l-2-2.5h-6z"/>',
    'lock': '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5v-3a4 4 0 018 0v3"/><circle cx="12" cy="15.5" r="1.3"/>',
    'globe': '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.4 3.6 8.5s-1.1 5.9-3.6 8.5M12 3.5C9.5 6.1 8.4 8.9 8.4 12s1.1 5.9 3.6 8.5"/>',
    'key': '<circle cx="8" cy="12" r="3.8"/><path d="M11.8 12H21M18 12v3M15 12v2.5"/>',
    'info': '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.4"/>',
    'scale': '<path d="M12 4v16M7.5 20h9M5 7h14"/><path d="M5 7l-2.6 6.2a3 3 0 005.2 0zM19 7l-2.6 6.2a3 3 0 005.2 0z"/>',
    'book': '<path d="M4 5.5c2.8-1 5.5-1 8 .8 2.5-1.8 5.2-1.8 8-.8V19c-2.8-1-5.5-1-8 .8-2.5-1.8-5.2-1.8-8-.8z"/><path d="M12 6.3v13.5"/>',
    'code': '<path d="M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5l-3 14"/>',
    'database': '<ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6"/><path d="M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6"/>',
    'grid': '<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="9" r="1.3"/><circle cx="15" cy="9" r="1.3"/><circle cx="9" cy="15" r="1.3"/><circle cx="15" cy="15" r="1.3"/>',
    'flask': '<path d="M9.5 3.5h5M10.5 3.5V9L5 18.5a1.5 1.5 0 001.3 2.2h11.4a1.5 1.5 0 001.3-2.2L13.5 9V3.5"/><path d="M7.5 14.5h9"/>',
    'upload': '<path d="M12 16V5M8 9l4-4 4 4"/><path d="M4.5 16.5v3h15v-3"/>',
    'badge': '<circle cx="12" cy="9.5" r="5.5"/><path d="M9 14.2L8 21l4-2 4 2-1-6.8"/>',
    'list': '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="5" cy="6.5" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="5" cy="17.5" r="1"/>',
    'quote': '<path d="M9.5 7C6.5 8 5 10.5 5 14v3h4.5v-4.5H7M19 7c-3 1-4.5 3.5-4.5 7v3H19v-4.5h-2.5"/>',
    'agent': '<rect x="4" y="4" width="16" height="16" rx="5.5"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
    'arrow': '<path d="M4 12h15M14 7l5 5-5 5"/>',
}
KILOGENT_MARK = ('<svg class="kg__mark" viewBox="0 0 64 64" fill="none" aria-hidden="true" style="overflow:visible">'
                 '<circle class="kg__person" cx="21" cy="33" r="14.5" stroke="#fff" stroke-width="4.5"/>'
                 '<g class="kg__agent"><rect x="27" y="17" width="31" height="31" rx="10.5" fill="#fff"/>'
                 '<g class="kg__eyes"><rect x="36" y="28" width="3.6" height="7" rx="1.8" fill="#191723"/>'
                 '<rect x="45.4" y="28" width="3.6" height="7" rx="1.8" fill="#191723"/></g></g></svg>')
ICON_COLS = ['#B3A6FF', '#35C9F2', '#FF4D9D', '#FFB020', '#2EE6C5', '#7B61FF']


def _svgdraw(paths):
    """Give every shape pathLength=1 so CSS can draw it in."""
    return re.sub(r'<(path|circle|rect|ellipse)\b', r'<\1 pathLength="1"', paths)


def icon(name):
    return ('<svg class="card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>' % ICONS[name])


def ico(name, n=0):
    """An icon in a squircle tile, the way Kilogent draws its agents. n picks the tile colour."""
    return ('<span class="ico" style="--ic:%s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg></span>'
            % (ICON_COLS[n % len(ICON_COLS)], _svgdraw(ICONS[name])))


# ------------------------------------------------------------ components ---
def slate(img, extra=''):
    """A labelled placeholder for a real microscopy image we do not have yet."""
    fname, caption, desc = img
    return (
        '<div class="slate"%s>'
        '<span class="slate__tag">Real image</span>'
        '<span class="slate__file">%s</span>'
        '<span class="slate__desc">%s</span>'
        '</div>' % (extra, fname, desc)
    ), caption


def dg(kind, alt, phase=0, cfg=None, cid=None):
    """A diagram the page draws itself: people as circles, agents as squircles, models as chips, documents as cards."""
    extra = ''
    if cfg is not None:
        extra += ' data-cfg="%s"' % html.escape(json.dumps(cfg, ensure_ascii=False, separators=(',', ':')), quote=True)
    if cid:
        extra += ' id="%s"' % cid
    return ('<canvas class="dg" data-kind="%s" data-phase="%d"%s role="img" aria-label="%s"></canvas>' % (kind, phase, extra, alt))


def frame(img, cls='', extra_html='', cap_in_frame=True, vis=None):
    """A media frame. vis = a tem() canvas; without it the frame shows the labelled placeholder slate."""
    fname, caption, desc = img
    body = vis if vis else slate(img)[0]
    cap = '<p class="frame__cap">%s</p>' % caption if cap_in_frame else ''
    return '<figure class="frame %s">%s%s%s</figure>' % (cls, body, extra_html, cap)


def pill(state):
    words = {'done': 'Done', 'progress': 'In progress', 'planned': 'Planned'}
    return '<span class="pill pill--%s"><i></i>%s</span>' % (state, words[state])


def btn(label, href, kind='primary', arrow=True, cls=''):
    return '<a class="btn btn--%s %s" href="%s">%s%s</a>' % (kind, cls, href, label, ARROW if arrow else '')


def tlink(label, href):
    return '<a class="tlink" href="%s">%s%s</a>' % (href, label, ARROW)


def tfake(label):
    """The same arrow affordance, as a span: used inside a card that is itself a link."""
    return '<span class="tlink">%s%s</span>' % (label, ARROW)


def shead(eyebrow, h2, lede, split=True, level=2):
    # eyebrow and lede are kept for the call sites but no longer printed: titles stand on their own
    return ('<div class="shead rv"><div class="shead__top"><h%d>%s</h%d></div></div>' % (level, h2, level))


# -------------------------------------------------------------------- nav ---
def nav(current=''):
    CHEV = ('<svg class="chev" width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" '
            'stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3 4.5L6 7.5 9 4.5"/></svg>')

    def cur(h):
        return ' aria-current="page"' if current == h else ''

    def menu(items, label):
        here = any(current == h for _, h, _ in items)
        rows = ''.join('<a href="%s"%s><span>%s</span><small>%s</small></a>' % (h, cur(h), t, s) for t, h, s in items)
        return ('<li class="nav__item" data-menu data-group%s><button class="nav__link" type="button" aria-expanded="false">%s%s'
                '</button><div class="nav__menu" hidden>%s</div></li>' % (' data-current="true"' if here else '', label, CHEV, rows))

    def group(items, label):
        # the phone menu: Solutions and Industries fold open, like the desktop dropdowns
        here = any(current == h for _, h, _ in items)
        rows = ''.join('<a class="sheet__sub" href="%s"%s>%s</a>' % (h, cur(h), t) for t, h, _ in items)
        return ('<details class="sheet__group" data-group%s%s><summary class="sheet__row">%s%s</summary>'
                '<div class="sheet__list">%s</div></details>'
                % (' data-current="true"' if here else '', ' open' if here else '', label, CHEV, rows))

    sol = [(s['nav'], '/solutions/%s/' % s['slug'], s['menu']) for s in SOLUTIONS]
    ind = [(i['nav'], '/industries/%s/' % i['slug'], i['menu']) for i in INDUSTRIES]
    plain = [('Platform', '/platform/'), ('Data &amp; models', '/data-and-models/'),
             ('Security', '/security/'), ('Resources', '/resources/'), ('About', '/about/')]

    links = '<li class="nav__item"><a class="nav__link" href="/platform/"%s>Platform</a></li>' % cur('/platform/')
    links += menu(sol, 'Solutions') + menu(ind, 'Industries')
    for t, h in plain[1:]:
        links += '<li class="nav__item"><a class="nav__link" href="%s"%s>%s</a></li>' % (h, cur(h), t)

    row = lambda t, h: '<a class="sheet__row" href="%s"%s>%s</a>' % (h, cur(h), t)
    sheet_rows = row(*plain[0]) + group(sol, 'Solutions') + group(ind, 'Industries') + ''.join(row(t, h) for t, h in plain[1:])

    return (
        '<a class="skip" href="#main">Skip to content</a>'
        '<header class="nav"><div class="wrap nav__in">'
        '<a class="nav__logo" href="/">%s<b>Cytogent</b></a>'
        '<nav aria-label="Main"><ul class="nav__links">%s</ul></nav>'
        '%s'
        '<button class="nav__burger" id="burger" type="button" aria-expanded="false" aria-controls="sheet" '
        'aria-label="Open menu"><span class="burger" aria-hidden="true"><i></i><i></i><i></i></span></button>'
        '</div><div class="sheet" id="sheet" hidden><nav class="wrap sheet__in" aria-label="Menu">%s'
        '<div class="sheet__foot">%s</div></nav></div></header>'
        % (logo_mark('nav'), links,
           btn('Request access', '/request-access/', 'primary', True, 'btn--sm nav__cta'),
           sheet_rows, btn('Request access', '/request-access/', 'primary', True, 'btn--block'))
    )


def footer():
    cols = ''
    for title, items in FOOTER:
        rows = ''.join('<li><a href="%s">%s</a></li>' % (h, t) for t, h in items)
        cols += '<div><h3>%s</h3><ul>%s</ul></div>' % (title, rows)
    return (
        '<footer class="foot"><div class="wrap">'
        '<div class="foot__grid">'
        '<div class="foot__brand"><a class="foot__logo" href="/">%s<b>Cytogent</b></a><p>%s</p></div>%s</div>'
        '<div class="foot__legal"><span>&copy; 2026 WelloWork AB</span><span>Cytogent is a research tool, not a medical device.</span></div>'
        '</div></footer>'
        % (logo_mark('foot'),
           'An agentic workspace for life science research. Scientists and AI agents work together, '
           'from question to cited evidence.',
           cols)
    )


# ------------------------------------------------------------------- head ---
def font_face(inline):
    if inline:
        def b64(p):
            return base64.b64encode(open(p, 'rb').read()).decode()
        g = 'data:font/woff2;base64,' + b64(os.path.join(STATIC, 'fonts', 'Geist-Latin.woff2'))
        m = 'data:font/woff2;base64,' + b64(os.path.join(STATIC, 'fonts', 'GeistMono-Latin.woff2'))
    else:
        g, m = '/fonts/Geist-Latin.woff2', '/fonts/GeistMono-Latin.woff2'
    return (
        '@font-face{font-family:"Geist";src:url(%s) format("woff2");font-weight:100 900;font-display:swap}'
        '@font-face{font-family:"Geist Mono";src:url(%s) format("woff2");font-weight:100 900;font-display:swap}'
        '@font-face{font-family:"Geist Fallback";src:local("Helvetica Neue"),local("Arial");'
        'ascent-override:95%%;descent-override:24%%;line-gap-override:0%%}'
        % (g, m)
    )


def jsonld(path, title, desc, faq=None, crumbs=None, extra=None):
    blocks = []
    if path == '/':
        blocks.append({
            "@context": "https://schema.org", "@type": "Organization",
            "@id": ORIGIN + "/#organization", "name": "WelloWork AB",
            "legalName": "WelloWork AB", "url": ORIGIN, "email": "info@cytogent.com",
            "address": {"@type": "PostalAddress", "addressCountry": "SE"},
            "brand": {"@type": "Brand", "name": "Cytogent"},
        })
        blocks.append({
            "@context": "https://schema.org", "@type": "WebSite",
            "@id": ORIGIN + "/#website", "url": ORIGIN, "name": "Cytogent",
            "description": DEFINITION, "inLanguage": "en",
            "publisher": {"@id": ORIGIN + "/#organization"},
        })
        blocks.append({
            "@context": "https://schema.org", "@type": "SoftwareApplication",
            "@id": ORIGIN + "/#software", "name": "Cytogent",
            "applicationCategory": "Research", "operatingSystem": "Web browser",
            "description": DEFINITION,
            "publisher": {"@id": ORIGIN + "/#organization"},
            "offers": {"@type": "Offer", "availability": "https://schema.org/LimitedAvailability",
                       "description": "Access is by request only. No self sign-up."},
        })
    if crumbs:
        blocks.append({
            "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n,
                                 "item": ORIGIN + u} for i, (n, u) in enumerate(crumbs)],
        })
    if extra:
        blocks.append(extra)
    if faq:
        blocks.append({
            "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": strip(q),
                            "acceptedAnswer": {"@type": "Answer", "text": strip(a)}} for q, a in faq],
        })
    return ''.join('<script type="application/ld+json">%s</script>'
                   % json.dumps(b, ensure_ascii=False, separators=(',', ':')) for b in blocks)


def strip(html):
    t = re.sub(r'<[^>]+>', '', html)
    return (t.replace('&amp;', '&').replace('&mdash;', '—').replace('&nbsp;', ' ')).strip()


def og_name(path):
    return 'og%s.jpg' % (path.rstrip('/').replace('/', '-') or '-home')


def page(path, title, desc, body, faq=None, crumbs=None, extra=None):
    css = font_face(False) + CSS
    canonical = ORIGIN + path
    head = [
        '<title>%s</title>' % title,
        '<meta name="description" content="%s">' % desc,
        '<link rel="canonical" href="%s">' % canonical,
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="Cytogent">',
        '<meta property="og:title" content="%s">' % title,
        '<meta property="og:description" content="%s">' % desc,
        '<meta property="og:url" content="%s">' % canonical,
        '<meta property="og:image" content="%s/%s">' % (ORIGIN, og_name(path)),
        '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="theme-color" content="#05060E">',
        '<link rel="icon" href="/img/favicon.svg" type="image/svg+xml">',
        '<link rel="preload" href="/fonts/Geist-Latin.woff2" as="font" type="font/woff2" crossorigin>',
        '<link rel="preload" href="/fonts/GeistMono-Latin.woff2" as="font" type="font/woff2" crossorigin>',
        '<style>%s</style>' % css,
        jsonld(path, title, desc, faq, crumbs, extra),
    ]
    return ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
            '%s</head><body>%s\n<main id="main">%s</main>\n%s'
            '<script src="/js/cell.js" defer></script><script src="/js/diagrams.js" defer></script>'
            '<script src="/js/app.js" defer></script>'
            '</body></html>'
            % (''.join(head), nav(path), body, footer()))


ROUTER = r"""
(function () {
  // Preview only: every page of the site lives in this one file; links are #/paths and swap the page body.
  var main = document.getElementById('main'), T = {}, cur = '/', homeTitle = document.title, home = window.__cgHome || main.innerHTML;
  Array.prototype.forEach.call(document.querySelectorAll('template[data-path]'), function (t) { T[t.getAttribute('data-path')] = t; });
  function go() {
    var h = location.hash || '#/';
    if (h.indexOf('#/') !== 0) { return; }
    var full = h.slice(1), path = full.split('?')[0];
    if (full === cur) { return; }
    var t = T[path], html = path === '/' ? home : (t ? t.innerHTML : null);
    if (html === null) { path = '/'; full = '/'; html = home; }
    cur = full; main.innerHTML = html;
    document.title = path === '/' ? homeTitle : t.getAttribute('data-title');
    // a new page starts at the top at once (the site's smooth scrolling is for in-page anchors only)
    var de = document.documentElement, sb = de.style.scrollBehavior; de.style.scrollBehavior = 'auto'; void getComputedStyle(de).scrollBehavior;
    try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); }
    de.style.scrollBehavior = sb;
    Array.prototype.forEach.call(document.querySelectorAll('.nav a[href^="#/"]'), function (a) {
      if (a.getAttribute('href') === '#' + path && path !== '/') { a.setAttribute('aria-current', 'page'); } else { a.removeAttribute('aria-current'); }
    });
    Array.prototype.forEach.call(document.querySelectorAll('.nav [data-group]'), function (g) {
      var here = !!g.querySelector('a[aria-current]');
      if (here) { g.setAttribute('data-current', 'true'); } else { g.removeAttribute('data-current'); }
      if (g.tagName === 'DETAILS') { g.open = here; }
    });
    if (window.CytogentApp) { window.CytogentApp.mount(main); }
    var h1 = main.querySelector('h1'); if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
  }
  window.addEventListener('hashchange', go);
  go();
})();
"""


def artifact(pages, home_title, home_body):
    """One self-contained file for the Claude preview: all pages as templates, a hash router, fonts inline."""
    css = font_face(True) + CSS
    js = CELL_JS + '\n' + DG_JS + '\n' + APP_JS
    tmpl = ''.join('<template data-path="%s" data-title="%s">%s</template>' % (p, html.escape(t, quote=True), b)
                   for p, t, b in pages)
    doc = ('<title>%s</title><meta name="description" content="Cytogent website preview"><style>%s</style>'
           '%s\n<main id="main">%s</main>\n'
           # the home page as written, taken before the page script adds its runtime state
           '<script>window.__cgHome=document.getElementById("main").innerHTML;</script>'
           '%s%s<script>%s</script><script>%s</script>'
           % (home_title, css, nav('/'), home_body, footer(), tmpl, js, ROUTER))
    # internal links become #/paths; in-page anchors stay as they are
    doc = re.sub(r'href="(/[^"]*)"', r'href="#\1"', doc)
    return doc


# =============================================================== home page ==
def home():
    o = []

    # ---- 1. hero: one screen; the cell sits behind it and explodes as the page scrolls ---
    o.append(
        '<section class="heroscene" aria-label="Introduction" id="hero">'
        '<div class="hero__stage">'
        '<canvas class="hero__canvas" role="img" aria-label="A dense molecular cell drawn from thousands of glowing '
        'particles. As you scroll, the particles loosen and drift away."></canvas>'
        '<div class="hero__scrim"></div>'
        '</div>'
        '<div class="wrap hero__content hero">'
        '<h1>Where scientists and AI agents do research <span class="nobr"><span class="kw">together</span>.</span></h1>'
        '<div class="hero__actions">%s%s</div>'
        '</div>'
        '</section>'
        % (btn('Request access', '/request-access/', 'primary'),
           btn('See the platform', '/platform/', 'outline', False)))

    # ---- 2. who it is for --------------------------------------------------
    cards = ''
    for i in INDUSTRIES:
        cards += (
            '<a class="card rv" data-rv-item href="/industries/%s/">%s<h3>%s</h3>'
            '<p class="card__pain">%s</p><p class="card__get">%s</p>%s</a>'
            % (i['slug'], icon(i['icon']), i['title'], i['pain'], i['get'],
               tfake('See this page')))
    o.append(
        '<section class="band band--dark" aria-labelledby="h-who"><div class="wrap">%s'
        '<div class="grid grid--4 rv" data-stagger style="margin-top:44px">%s</div>'
        '</div></section>'
        % (shead('Who it is for', '<span id="h-who">Built for the people who move science <span class="nobr"><span class="kw">forward</span>.</span></span>',
                 'Four teams, one workspace. Each gets the agents, data and documents its work needs.'),
           cards))

    # ---- 3. how it works ---------------------------------------------------
    steps = ''
    for n, (h, p) in enumerate(HOW, 1):
        steps += ('<li class="step"><span class="step__n">0%d</span><div><h3>%s</h3><p>%s</p></div></li>'
                  % (n, h, p))
    annots = (
        '<span class="annot" data-how-label style="left:6%;top:12%"><i></i>Receptor</span>'
        '<span class="annot" data-how-label style="left:6%;bottom:22%"><i></i>Cascade</span>'
        '<span class="annot" data-how-label style="right:6%;top:12%"><i></i>Nucleus</span>'
    )
    how_media = frame(('', 'You \u2192 Reader, Analyst, Writer \u2192 a cited result \u2192 your decision', ''),
                      'frame--43', '',
                      vis=dg('flow', 'A person asks a question; it fans out to three agents, Reader, Analyst and Writer, '
                                     'each with its model; their work lands in a result page with two citations; '
                                     'a person signs off.', cid='dg-how'))
    o.append(
        '<section class="band band--cream" aria-labelledby="h-how"><div class="wrap">%s'
        '<div class="how"><ol class="steps rv" id="how-steps" data-drive="dg-how">%s</ol>'
        '<div class="rv">%s</div>'
        '</div></div></section>'
        % (shead('How it works', '<span id="h-how">From question to cited <span class="kw">answer</span> in three steps.</span>',
                 'You ask. Agents read, compute and draft. You review and decide. Every step is logged.'),
           steps, how_media))

    # ---- 4. seven workflows ------------------------------------------------
    flows = ''
    for s in SOLUTIONS:
        tags = ''.join('<span class="tag">%s</span>' % t for t in s['tags'])
        wide = ' flow--wide' if s.get('wide') else ''
        v = s['vis']
        body = dg(v[0], v[2], phase=len(flows) % 7)
        caption = v[1]
        flows += (
            '<a class="flow rv%s" data-rv-item href="/solutions/%s/">'
            '<div class="frame">%s<p class="frame__cap">%s</p></div>'
            '<div class="flow__body"><h3>%s</h3><p>%s</p><div class="tags">%s</div>%s</div></a>'
            % (wide, s['slug'], body, caption, s['title'], s['blurb'], tags,
               tfake('Open %s' % strip(s['title']).lower())))
    o.append(
        '<section class="band band--dark" aria-labelledby="h-flows"><div class="wrap">%s'
        '<div class="flows" data-stagger>%s</div></div></section>'
        % (shead('Workflows', '<span id="h-flows">Seven workflows. One <span class="kw">evidence</span> trail.</span>',
                 'Every workflow uses the same agents, data and rules, so a result in one is a source in the next.'),
           flows))

    # ---- 5. one project, end to end ---------------------------------------
    layers, steps_html = '', ''
    for i, st in enumerate(STORY):
        v = st['vis']
        body = dg(v[0], v[2], phase=i)
        extra = ''
        layers += '<div class="story__layer" data-on="%s">%s%s<p class="frame__cap">%s</p></div>' % (
            'true' if i == 0 else 'false', body, extra, v[1])
        steps_html += (
            '<li class="sstep" data-on="%s" data-label="%s"><span class="sstep__n">%s</span>'
            '<h3>%s</h3><p>%s</p></li>'
            % ('true' if i == 0 else 'false', st['label'], st['n'], st['h'], st['p']))
    o.append(
        '<section class="band band--cream" aria-labelledby="h-story" id="story"><div class="wrap">%s'
        '<div class="story"><div class="story__media">'
        '<div class="frame story__frame">%s</div>'
        '</div>'
        '<ol class="story__steps">%s</ol></div></div></section>'
        % (shead('One project, end to end',
                 '<span id="h-story">Follow a single <span class="kw">question</span> through the workspace.</span>',
                 'A resistance mutation in a cancer cell line. Six steps, one evidence trail. '
                 'Illustrative example.'),
           layers, steps_html))

    # ---- 6. why Cytogent: an icon matrix, the Cytogent column raised --------
    def mark(word, col=''):
        yes = ('Always', 'Yes', 'Yes, logged', 'Built in', 'One workspace', 'Never')
        part = ('Rarely', 'Sometimes', 'Varies', 'Per tool', 'One area each')
        kind = 'yes' if word in yes else ('part' if word in part else 'no')
        ico = {'yes': '<path d="M5 12.5l4.5 4.5L19 7.5"/>', 'part': '<path d="M5 12h14"/>', 'no': '<path d="M7 7l10 10M17 7L7 17"/>'}[kind]
        return ('<span class="mk mk--%s" data-col="%s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
                'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg><span>%s</span></span>' % (kind, col, ico, word))
    rows = ''
    row_icons = [
        '<path d="M7 9h3l-2 6H5zM14 9h3l-2 6h-3z"/>',
        '<path d="M6 5v6a4 4 0 0 0 4 4h8M14 11l4 4-4 4"/>',
        '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
        '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
        '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
        '<circle cx="9" cy="12" r="3.5"/><path d="M12.5 12H20M17 12v3M14.5 12v2"/>',
        '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6M15 16l2.5 2.5L22 14"/>',
    ]
    for n, (label, a, b, c) in enumerate(COMPARE):
        rows += ('<li class="cmpv__row"><span class="cmpv__label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
                 'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>%s</span>'
                 '%s%s%s</li>' % (row_icons[n], label, mark(a, 'General AI'), mark(b, 'Point tools'), mark(c, 'Cytogent')))
    o.append(
        '<section class="band band--dark" aria-labelledby="h-why"><div class="wrap">%s'
        '<div class="cmpv rv" role="table" aria-label="How Cytogent compares">'
        '<div class="cmpv__head" role="row"><span></span><span>General AI chat</span><span>Point tools</span>'
        '<span class="cmpv__us">%sCytogent</span></div>'
        '<ul class="cmpv__body">%s</ul></div></div></section>'
        % (shead('Why Cytogent', '<span id="h-why">Not another chat <span class="nobr"><span class="kw">window</span>.</span></span>',
                 'General AI assistants give answers. Cytogent gives evidence, inside your data rules, '
                 'with a record of every step.'),
           logo_mark('cmp'), rows))

    # ---- 8. data and models ------------------------------------------------
    dm_cards = [
        ('Datasets', 'Public and licensed collections, cleaned, versioned and documented. Each one lists its '
                     'source, version and licence inside the workspace.'),
        ('Trained models', 'Domain models for prediction and screening — variant effect, binding affinity, '
                           'assay QC — each with its validation reported on its own card.'),
        ('Protocols', 'Protocols you can search, adapt and cite, with every step attributed to where it came from.'),
    ]
    cards = ''.join('<div class="card rv" data-rv-item><h3>%s</h3><p class="card__get">%s</p></div>' % c
                    for c in dm_cards)
    o.append(
        '<section class="band band--cream" aria-labelledby="h-data"><div class="wrap">%s'
        '<div class="split"><div class="split__text">'
        '<div class="grid" style="gap:14px">%s</div>%s</div>'
        '<div class="split__media rv">%s</div>'
        '</div></div></section>'
        % (shead('Data &amp; models', '<span id="h-data">Built on data you can <span class="nobr"><span class="kw">trace</span>.</span></span>',
                 'Every dataset has a source, a version and a licence. Every model reports its validation.'),
           cards, tlink('See data and models', '/data-and-models/'),
           frame(('', 'Datasets with source, version and licence \u00b7 models with validation \u00b7 the curation path', ''),
                 'frame--43', vis=dg('data', 'Four dataset cards with their version and licence; three trained models with '
                                             'their validation metric; a five-step path Collect, Clean, Version, Document, Serve.'))))

    # ---- 9. security -------------------------------------------------------
    rows = ''
    for name, desc, state in SECURITY:
        rows += '<li class="row rv" data-rv-item><b>%s</b><p>%s</p>%s</li>' % (name, desc, pill(state))
    o.append(
        '<section class="band band--dark" aria-labelledby="h-sec"><div class="wrap">%s'
        '<div class="split"><div class="split__text" style="max-width:none">'
        '<ul class="rows" data-stagger style="margin-top:0">%s</ul>'
        '<p class="body" style="font-size:15px">Cytogent is a research tool. It is not a medical device and '
        'makes no clinical decisions.</p>%s</div>'
        '<div class="split__media rv">%s</div>'
        '</div></div></section>'
        % (shead('Security', '<span id="h-sec">Your data stays <span class="nobr"><span class="kw">yours</span>.</span></span>',
                 'Projects are isolated. Access is per role. Nothing trains on your data.'),
           rows, tlink('Read the full security page', '/security/'),
           frame(('', 'Three isolated projects \u00b7 a crossing refused \u00b7 roles \u00b7 the audit log', ''),
                 'frame--43', vis=dg('security', 'Three project boxes, each with its own data and agent and a lock; a packet '
                                                 'trying to cross between projects is refused; owner, editor and viewer roles; '
                                                 'an audit log filling in.'))))

    # ---- 10. three ways in -------------------------------------------------
    doors = ''
    for k, name, desc, t in DOORS:
        doors += ('<a class="door rv" data-rv-item href="/request-access/?type=%s">'
                  '<h3>%s</h3><p>%s</p>%s</a>' % (t, name, desc, tfake('Request access')))
    o.append(
        '<section class="band band--cream" aria-labelledby="h-access"><div class="wrap">%s'
        '<div class="doors" data-stagger>%s</div>'
        '<div class="next" style="margin-top:40px"><span data-n="1">We read your request</span>'
        '<span data-n="2">A short call, if needed</span>'
        '<span data-n="3">Workspace set up with your permissions</span></div>'
        '</div></section>'
        % (shead('Access', '<span id="h-access">Access is by <span class="nobr"><span class="kw">request</span>.</span></span>',
                 'No self sign-up. Tell us who you are and what you want to do. We review every request.'),
           doors))

    # ---- 11. FAQ: a standard accordion, the first answer open ---------------
    qa = ''.join('<details class="qa"%s><summary><span>%s</span><svg class="qa__chev" viewBox="0 0 16 16" fill="none" '
                 'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>'
                 '</summary><div class="qa__a"><p>%s</p></div></details>' % (' open' if n == 0 else '', q, a)
                 for n, (q, a) in enumerate(FAQ))
    o.append(
        '<section class="band band--dark" aria-labelledby="h-faq"><div class="wrap">%s'
        '<div class="faq rv">%s</div></div></section>'
        % (shead('FAQ', '<span id="h-faq">Questions scientists ask <span class="nobr"><span class="kw">first</span>.</span></span>',
                 'Short answers, in plain words. The full list lives in Resources.'),
           qa))

    # ---- 12. final CTA -----------------------------------------------------
    o.append(
        '<section class="band band--cream" aria-labelledby="h-cta"><div class="wrap">'
        '<div class="cta rv">'
        '<h2 id="h-cta">Bring your next <span class="nobr"><span class="kw">question</span>.</span></h2>'
        '<p class="lede">Tell us your field and what you want to do. We set up the workspace around it.</p>'
        '%s</div></div></section>' % btn('Request access', '/request-access/', 'primary'))

    return ''.join(o)



# ============================================================ inner pages ==
SOL = {s['slug']: s for s in SOLUTIONS}
IND = {i['slug']: i for i in INDUSTRIES}
SOL_ICON = {'literature-and-evidence': 'book', 'in-silico-studies': 'cpu', 'protein-design': 'molecule',
            'crispr-genome-editing': 'dna', 'clinical-trials': 'clipboard', 'regulatory-documentation': 'layers',
            'patent-documentation': 'seal'}
TICK = ('<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" '
        'stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="M6.6 10.2l2.2 2.2 4.4-4.6"/></svg>')
XMARK = ('<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" '
         'aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="M7.4 7.4l5.2 5.2M12.6 7.4l-5.2 5.2"/></svg>')


def kw(s):
    """<kw>word</kw>. -> the accent keyword, kept on one line with its full stop."""
    return re.sub(r'<kw>(.*?)</kw>(\.?)', r'<span class="nobr"><span class="kw">\1</span>\2</span>', s)


def phero(h1, hero, actions='', short=False, sub=None):
    view, anim, alt = hero[0], hero[1], hero[2]
    zoom = ' data-zoom="%s"' % hero[3] if len(hero) > 3 else ''
    if view == 'whole':
        zoom += ' data-fill="0.33"'  # the whole cell sits a little smaller, so it is seen in full
    return ('<section class="phero%s" aria-label="Introduction" id="top" data-view="%s" data-anim="%s"%s>'
            '<div class="phero__stage"><canvas class="phero__canvas" role="img" aria-label="%s"></canvas>'
            '<div class="phero__scrim"></div></div>'
            '<div class="wrap phero__content"><h1>%s</h1>%s%s</div></section>'
            % ((' phero--short' if short else '') + (' phero--sub' if sub else ''), view, anim, zoom, alt, kw(h1),
               '<p class="phero__sub">%s</p>' % ' '.join('<span>%s</span>' % x for x in sub) if sub else '',
               '<div class="hero__actions">%s</div>' % actions if actions else ''))


def head2(hid, h2, lede, split=True):
    # the lede is kept in the copy for reference but not printed: titles stand on their own
    return '<div class="shead rv"><div class="shead__top"><h2 id="%s">%s</h2></div></div>' % (hid, kw(h2))


def band(kind, hid, inner):
    return ('<section class="band band--%s" aria-labelledby="%s"><div class="wrap">%s</div></section>' % (kind, hid, inner))


def icards(items, cols=3, start=0, cls=''):
    """items: (icon, title, text) or (icon, title, text, href)."""
    out = ''
    for n, it in enumerate(items):
        body = '%s<h3>%s</h3><p>%s</p>' % (ico(it[0], start + n), it[1], it[2])
        if len(it) > 3 and it[3]:
            out += '<a class="card icard" data-rv-item href="%s">%s%s</a>' % (it[3], body, tfake(it[4] if len(it) > 4 else 'Open'))
        else:
            out += '<div class="card icard" data-rv-item>%s</div>' % body
    return '<div class="grid grid--%d icards rv %s" data-stagger>%s</div>' % (cols, cls, out)


def ticks(items):
    return '<ul class="ticks">%s</ul>' % ''.join('<li>%s<span>%s</span></li>' % (TICK, t) for t in items)


def split(text_html, media_html, flip=False):
    return ('<div class="split%s"><div class="split__text rv">%s</div><div class="split__media rv">%s</div></div>'
            % (' split--flip' if flip else '', text_html, media_html))


def dframe(kind, caption, alt, cfg=None, cid=None, cls='frame--43'):
    return frame(('', caption, ''), cls, vis=dg(kind, alt, cfg=cfg, cid=cid))


def steps_list(items, drive=None):
    li = ''.join('<li class="step"><span class="step__n">%02d</span><div><h3>%s</h3><p>%s</p></div></li>' % (n, h, p)
                 for n, (h, p) in enumerate(items, 1))
    return '<ol class="steps rv"%s>%s</ol>' % (' data-drive="%s"' % drive if drive else '', li)


def status_rows(items):
    return '<ul class="rows" data-stagger>%s</ul>' % ''.join(
        '<li class="row rv" data-rv-item><b>%s</b><p>%s</p>%s</li>' % (n, d_, pill(st)) for n, d_, st in items)


def qa_list(items, first_open=True):
    return ''.join('<details class="qa"%s><summary><span>%s</span><svg class="qa__chev" viewBox="0 0 16 16" fill="none" '
                   'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>'
                   '</summary><div class="qa__a"><p>%s</p></div></details>' % (' open' if (n == 0 and first_open) else '', q, a)
                   for n, (q, a) in enumerate(items))


def cta(h2, lede, href='/request-access/', label='Request access'):
    return ('<section class="band band--cream" aria-labelledby="h-cta"><div class="wrap"><div class="cta rv">'
            '<h2 id="h-cta">%s</h2><p class="lede">%s</p>%s</div></div></section>' % (kw(h2), lede, btn(label, href, 'primary')))


def pill2(state):
    if state == 'statement':
        return '<span class="pill pill--note"><i></i>Statement</span>'
    return pill(state)


# ---- solution page --------------------------------------------------------
def solution_page(slug):
    s, c = SOL[slug], SOLUTION_PAGES[slug]
    o = [phero(c['h1'], c['hero'], btn('Request access', '/request-access/', 'primary') +
               btn('See the platform', '/platform/', 'outline', False))]
    h2, lede, bl = c['intro']
    kind, cap, alt = s['vis']
    o.append(band('dark', 'h-what', split(
        '<h2 id="h-what">%s</h2>%s' % (kw(h2), ticks(bl)),
        dframe(kind, cap, alt))))
    t = c['team']
    cfg = {'q': t['q'], 'agents': [[a[0], a[1]] for a in t['agents']], 'outs': t['outs']}
    team_alt = ('You ask: %s. The Reader, the Analyst and the Writer take turns, each with its model, and their work '
                'lands as %s. You sign off.' % (t['q'], ', '.join(t['outs'])))
    o.append(band('cream', 'h-team',
                  head2('h-team', 'Three agents, one <kw>result</kw>.',
                        'Each agent does one job, with the model that does it best, and hands its work to the next. You see every step.') +
                  '<div class="teamgrid">%s%s</div>' % (
                      '<div class="rv">%s</div>' % dframe('team', 'You ask · agents take turns · results arrive cited · you sign off', team_alt, cfg=cfg),
                      '<ul class="agents rv" data-stagger>%s</ul>' % ''.join(
                          '<li class="agentrow" data-rv-item>%s<div><h3>%s <span>%s</span></h3><p>%s</p></div></li>'
                          % (ico(a[2], [0, 1, 2][i]), a[0], a[1], a[3]) for i, a in enumerate(t['agents'])))))
    o.append(band('dark', 'h-out', head2('h-out', 'What you get <kw>back</kw>.',
                                         'Every output carries its sources, its versions and the name of whoever signed it off.') +
                  icards([(a, b, c_) for a, b, c_ in c['outputs']], cols=4)))
    o.append(band('cream', 'h-faq', head2('h-faq', 'Common <kw>questions</kw>.', 'Short answers. More in the FAQ.') +
                  '<div class="faq rv">%s</div>' % qa_list(c['faq'])))
    rel = [(SOL_ICON[r], SOL[r]['title'], SOL[r]['blurb'], '/solutions/%s/' % r, 'See this workflow') for r in c['related']]
    o.append(band('dark', 'h-rel', head2('h-rel', 'Works well <kw>with</kw>.',
                                         'The same agents, data and rules, so a result here is a source there.') + icards(rel, cols=3, start=2)))
    o.append(cta('Bring your next <kw>question</kw>.', 'Tell us your field and what you want to do. We set up the workspace around it.'))
    return ''.join(o)


# ---- industry page --------------------------------------------------------
def industry_page(slug):
    i, c = IND[slug], INDUSTRY_PAGES[slug]
    href = '/request-access/?type=%s' % c['door']
    o = [phero(c['h1'], c['hero'], btn('Request access', href, 'primary') + btn('See the workflows', '#workflows', 'outline', False))]
    before = ''.join('<li>%s<span>%s</span></li>' % (XMARK, x) for x in c['before'])
    after = ''.join('<li>%s<span>%s</span></li>' % (TICK, x) for x in c['after'])
    lists = ('<div class="pg"><div class="pg__card pg__card--before"><h3>Today</h3><ul>%s</ul></div>'
             '<div class="pg__card pg__card--after"><h3>With Cytogent</h3><ul>%s</ul></div></div>' % (before, after))
    sc_alt = ('Scattered files (%s) drift apart with tangled links; then they are filed inside one project where the '
              'Reader, the Analyst and the Writer work.' % ', '.join(c['chips']))
    o.append(band('dark', 'h-why', head2('h-why', 'From scattered to one <kw>record</kw>.', strip(i['pain']) + ' That changes here.') +
                  split(lists, dframe('scatter', 'Files and tools scattered today · one project with its agents', sc_alt, cfg={'chips': c['chips']}))))
    flows = [(SOL_ICON[f], SOL[f]['title'], SOL[f]['blurb'], '/solutions/%s/' % f, 'See this workflow') for f in c['flows']]
    o.append('<div id="workflows"></div>' + band('cream', 'h-flows', head2('h-flows', 'The workflows your team <kw>uses</kw>.',
                                                                         'Each one runs in the same workspace, on the same data, under the same rules.') +
             icards(flows, cols=2 if len(flows) == 4 else 3)))
    stages = [[st[0], st[1]] for st in c['example']]
    pl_alt = 'An example project in %d stages: %s. Each stage is logged as it passes.' % (len(stages), ', '.join('%s by %s' % (a, b.lower()) for a, b in stages))
    o.append(band('dark', 'h-ex', head2('h-ex', 'One project, step by <kw>step</kw>.', 'An illustrative example of how a project runs.') +
                  split(steps_list([(st[2], st[3]) for st in c['example']]),
                        dframe('pipeline', 'Each stage has its owner · the record fills in as it passes', pl_alt, cfg={'stages': stages}), flip=True)))
    rules = ''.join('<div class="card icard" data-rv-item>%s<h3>%s</h3><p>%s</p>%s</div>' % (ico(a, n + 3), b, c_, pill2(st))
                    for n, (a, b, c_, st) in enumerate(c['rules']))
    o.append(band('cream', 'h-rules', head2('h-rules', 'Inside your data <kw>rules</kw>.', 'Each control says plainly where it stands.') +
                  '<div class="grid grid--3 icards rv" data-stagger>%s</div>' % rules +
                  '<p class="more rv">%s</p>' % tlink('Read the full security page', '/security/')))
    o.append(cta('Bring your next <kw>question</kw>.', 'Tell us your field and what you want to do. We set up the workspace around it.', href))
    return ''.join(o)


# ---- platform -------------------------------------------------------------
def platform_page():
    c = PLATFORM
    o = [phero(c['h1'], c['hero'], btn('Request access', '/request-access/', 'primary') + btn('Data and models', '/data-and-models/', 'outline', False))]
    h2, lede = c['bench']
    o.append(band('dark', 'h-bench', head2('h-bench', h2, lede) + '<div class="wide rv">%s</div>' % dframe(
        'bench', 'An illustrative project board · three agents at work · one draft waiting for you',
        'A project board for KRAS G12C with three tasks: the Reader on a literature review, the Analyst on a variant call, '
        'the Writer on a protocol draft that waits for your review.', cls='frame--wide')))
    h2, lede, routes = c['routing']
    rl = ''.join('<li class="route" data-rv-item>%s<div><b>%s</b><span>%s</span></div></li>' % (ico(a, n), b, m) for n, (a, b, m) in enumerate(routes))
    o.append(band('cream', 'h-route', split('<h2 id="h-route">%s</h2><ul class="routes" data-stagger>%s</ul>' % (kw(h2), rl),
                                             dframe('routing', 'Each task to its model · every routing decision logged',
                                                    'Four tasks on the left go through a router to four models on the right: reading to a long-context '
                                                    'language model, code to a code model, structure to a structure model, drafting to a drafting model. '
                                                    'A routing log fills in.'))))
    h2, lede, st = c['cascade']
    o.append(band('dark', 'h-casc', head2('h-casc', h2, lede) +
                  '<div class="how">%s<div class="rv">%s</div></div>' % (
                      steps_list(st, drive='dg-casc'),
                      dframe('cascade', 'Request → access check → agents, logged → cited result',
                             'A request travels from a person to an access check with a lock, then through three agents in turn, '
                             'then lands as a cited result.', cid='dg-casc'))))
    h2, lede, items = c['stack']
    o.append(band('cream', 'h-stack', head2('h-stack', h2, lede) +
                  icards([(a, b, c_, '/data-and-models/', 'See data and models') for a, b, c_ in items], cols=3)))
    h2, lede, tools = c['integrations']
    o.append(band('dark', 'h-int', split('<h2 id="h-int">%s</h2><div class="tags tags--lg">%s</div>'
                                         % (kw(h2), ''.join('<span class="tag">%s</span>' % t for t in tools)),
                                         dframe('hub', 'Your project in the middle · data in, results out',
                                                'A project in the centre, linked to an electronic lab notebook, LIMS, storage, Git, '
                                                'team chat, single sign-on and a reference manager, with data flowing in and results out.'))))
    o.append(cta('See it with your own <kw>data</kw>.', 'Tell us your field and what you want to do. We set up the workspace around it.'))
    return ''.join(o)


# ---- data and models ------------------------------------------------------
def data_page():
    c = DATA
    o = [phero(c['h1'], c['hero'], btn('Request access', '/request-access/', 'primary') + btn('Security', '/security/', 'outline', False))]
    h2, lede, items = c['datasets']
    o.append(band('dark', 'h-ds', head2('h-ds', h2, lede) + icards(items, cols=3)))
    h2, lede, items = c['models']
    o.append(band('cream', 'h-tm', head2('h-tm', h2, lede) +
                  '<div class="wide rv">%s</div>' % dframe('models', 'Three trained models · validation drawn on each card',
                                                          'Three model cards: a variant effect model with a curve above chance, a binding '
                                                          'affinity model with predictions close to measurements, and an assay QC model '
                                                          'scanning a plate and flagging three wells.', cls='frame--wide') +
                  icards(items, cols=3, start=1)))
    h2, lede, st = c['curation']
    o.append(band('dark', 'h-cur', head2('h-cur', h2, lede) +
                  '<div class="how">%s<div class="rv">%s</div></div>' % (
                      steps_list(st), dframe('curation', 'A dataset gains its source, version and documents on the way in',
                                             'A dataset card moves along five steps, Collect, Clean, Version, Document and Serve, '
                                             'and gains a tag at each one.'))))
    h2, lede, items = c['yours']
    o.append(band('cream', 'h-yours', head2('h-yours', h2, lede) + icards(items, cols=3, start=3)))
    o.append(cta('Bring your next <kw>question</kw>.', 'Tell us your field and what you want to do. We set up the workspace around it.'))
    return ''.join(o)


# ---- security -------------------------------------------------------------
def security_page():
    c = SECURITY_PAGE
    o = [phero(c['h1'], c['hero'], btn('Request access', '/request-access/', 'primary') + btn('Read the FAQ', '/resources/faq/', 'outline', False))]
    legend = ('<div class="legend rv">%s%s%s</div>' % (pill('done'), pill('progress'), pill('planned')))
    h2, lede, rows = c['handling']
    o.append(band('dark', 'h-dh', head2('h-dh', h2, lede) + legend + split(status_rows(rows), dframe(
        'encrypt', 'In transit through TLS · at rest under managed keys · inside its project',
        'Data leaves a person, crosses an encrypted tunnel as scrambled blocks, and is stored inside Project A under a key that turns on a schedule.'))))
    h2, lede, rows = c['access']
    o.append(band('cream', 'h-ac', head2('h-ac', h2, lede) + split(status_rows(rows), dframe(
        'roles', 'Owner, editor and viewer · set per project',
        'A table of roles for Project A: the owner can view, edit, run agents and manage; the editor can view, edit and run agents; the viewer can only view.'),
        flip=True)))
    h2, lede, items = c['compliance']
    comp = ''.join('<div class="card icard" data-rv-item>%s<h3>%s</h3><p>%s</p>%s</div>' % (ico(a, n), b, c_, pill(st))
                   for n, (a, b, c_, st) in enumerate(items))
    o.append(band('dark', 'h-cp', head2('h-cp', h2, lede) + '<div class="grid grid--4 icards rv" data-stagger>%s</div>' % comp +
                  '<div class="statement rv">%s<p><b>Cytogent is a research tool.</b> It is not a medical device and makes no '
                  'clinical decisions. Agents draft, search, predict and support; a qualified person reviews and decides.</p></div>'
                  % ico('info', 3)))
    o.append(band('cream', 'h-faq', head2('h-faq', 'Common <kw>questions</kw>.', 'Short answers. More in the FAQ.') +
                  '<div class="faq rv">%s</div>' % qa_list(c['faq'])))
    o.append(cta('Ask us <kw>anything</kw>.', 'A data processing agreement is available on request. Tell us what your team needs.'))
    return ''.join(o)


# ---- about ----------------------------------------------------------------
def about_page():
    c = ABOUT
    o = [phero(c['h1'], c['hero'], btn('Request access', '/request-access/', 'primary') + btn('See the platform', '/platform/', 'outline', False))]
    o.append('<section class="band band--dark" aria-labelledby="h-def"><div class="wrap"><div class="def rv">'
             '<h2 id="h-def">What Cytogent <span class="nobr"><span class="kw">is</span>.</span></h2><p>%s</p></div></div></section>' % DEFINITION)
    h2, lede = c['mission']
    o.append(band('cream', 'h-mis', split('<h2 id="h-mis">%s</h2>' % kw(h2),
                                          dframe('circle', 'Scientists ask · agents read, compute and draft · scientists judge and decide',
                                                 'A project in the centre with two people on the left and three agents on the right: '
                                                 'the people ask, the agents work, and the people review and decide.'))))
    h2, lede, items = c['principles']
    o.append(band('dark', 'h-pr', head2('h-pr', h2, lede) + icards(items, cols=4)))
    h2, p1, url = c['partner']
    o.append(band('cream', 'h-kg', split('<h2 id="h-kg">%s</h2><p class="body body--lg">%s</p>' % (kw(h2), p1),
                                         '<a class="kg" href="%s" rel="noopener" aria-label="Kilogent, opens kilogent.com">%s</a>'
                                         % (url, KILOGENT_MARK))))
    h2, mail = c['contact']
    o.append('<section class="band band--dark" aria-labelledby="h-cta"><div class="wrap"><div class="cta contact rv">'
             '<h2 id="h-cta">%s</h2><a class="contact__mail" href="mailto:%s">%s</a></div></div></section>' % (kw(h2), mail, mail))
    return ''.join(o)


# ---- resources, FAQ, glossary ---------------------------------------------
def faq_groups():
    F = FAQ
    return [('About Cytogent', [F[0]] + FAQ_MORE['general'] + [F[1], F[2], F[5]]),
            ('Using the workspace', FAQ_MORE['using']),
            ('Data and security', [F[3], F[4]] + FAQ_MORE['data'] + [F[7]]),
            ('Access', [F[6]] + FAQ_MORE['access'])]


def resources_page():
    c = RESOURCES
    n_faq = sum(len(g[1]) for g in faq_groups())
    o = [phero(c['h1'], c['hero'], btn('Request access', '/request-access/', 'primary'))]
    cards = [('message', 'FAQ', '%d short answers about agents, data, security and access.' % n_faq, '/resources/faq/', 'Read the FAQ'),
             ('book', 'Glossary', '%d terms from life science and AI, in plain words.' % len(GLOSSARY), '/resources/glossary/', 'Open the glossary'),
             ('layers', 'Platform', 'How agents, models and data work together.', '/platform/', 'See the platform'),
             ('database', 'Data and models', 'What agents can query, and how it is curated.', '/data-and-models/', 'See data and models'),
             ('shield', 'Security', 'Every control, with its status.', '/security/', 'Read the security page'),
             ('key', 'Request access', 'Three request types, reviewed by hand.', '/request-access/', 'Request access')]
    o.append(band('dark', 'h-res', head2('h-res', 'Start <kw>here</kw>.', 'Answers, terms and the pages people ask about most.') + icards(cards, cols=3)))
    o.append(band('cream', 'h-top', head2('h-top', 'Asked most <kw>often</kw>.', 'Three answers to start with.') +
                  '<div class="faq rv">%s</div><p class="more rv">%s</p>' % (qa_list([FAQ[0], FAQ[3], FAQ[6]]), tlink('All questions', '/resources/faq/'))))
    o.append(cta('Bring your next <kw>question</kw>.', 'Tell us your field and what you want to do. We set up the workspace around it.'))
    return ''.join(o)


def faq_page():
    c = FAQ_PAGE
    o = [phero(c['h1'], c['hero'], btn('Request access', '/request-access/', 'primary'), short=True)]
    groups = faq_groups()
    nav_ = '<nav class="jump rv" aria-label="FAQ sections">%s</nav>' % ''.join(
        '<a href="#faq-%d">%s</a>' % (n, g[0]) for n, g in enumerate(groups))
    body = ''.join('<section class="faqg rv" aria-labelledby="faq-%d"><h2 id="faq-%d">%s</h2><div class="faq">%s</div></section>'
                   % (n, n, g[0], qa_list(g[1], first_open=(n == 0))) for n, g in enumerate(groups))
    o.append('<section class="band band--dark" aria-label="Questions and answers"><div class="wrap"><div class="faqwrap">%s<div>%s</div></div></div></section>' % (nav_, body))
    o.append(cta('Still have a <kw>question</kw>?', 'Ask it in your access request. A person reads every one.'))
    return ''.join(o)


def glossary_page():
    c = GLOSSARY_PAGE
    o = [phero(c['h1'], c['hero'], btn('Request access', '/request-access/', 'primary'), short=True)]
    letters = []
    for term, d_ in sorted(GLOSSARY, key=lambda x: x[0].lower()):
        L = term[0].upper()
        if not letters or letters[-1][0] != L:
            letters.append((L, []))
        letters[-1][1].append((term, d_))
    idx = '<nav class="gl__index" aria-label="Letters">%s</nav>' % ''.join('<a href="#gl-%s">%s</a>' % (L, L) for L, _ in letters)
    body = ''.join('<section class="gl__group rv" aria-labelledby="gl-%s"><h2 id="gl-%s">%s</h2><dl>%s</dl></section>'
                   % (L, L, L, ''.join('<div class="gl__item" id="term-%s"><dt>%s</dt><dd>%s</dd></div>'
                                        % (re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-'), t, d_) for t, d_ in items))
                   for L, items in letters)
    o.append('<section class="band band--dark" aria-label="Glossary"><div class="wrap"><div class="gl">%s<div>%s</div></div></div></section>' % (idx, body))
    o.append(cta('Missing a <kw>term</kw>?', 'Tell us in your access request and we will add it.'))
    return ''.join(o)


# ---- request access -------------------------------------------------------
def request_page():
    c = REQUEST

    def field(fid, label, ctl, hint='', opt=False):
        return ('<div class="field"><label for="%s">%s%s</label>%s%s</div>'
                % (fid, label, ' <span class="opt">(optional)</span>' if opt else '', ctl,
                   '<span class="hint" id="%s-hint">%s</span>' % (fid, hint) if hint else ''))

    def inp(fid, typ='text', auto='', req=True, ph='', extra=''):
        return ('<input class="input" id="%s" name="%s" type="%s"%s%s%s%s>'
                % (fid, fid, typ, ' autocomplete="%s"' % auto if auto else '', ' required' if req else '',
                   ' placeholder="%s"' % ph if ph else '', extra))

    def sel(fid, opts, req=True):
        return ('<select class="input" id="%s" name="%s"%s><option value="">Choose one</option>%s</select>'
                % (fid, fid, ' required' if req else '', ''.join('<option>%s</option>' % o_ for o_ in opts)))

    def area(fid, ph):
        return '<textarea class="input" id="%s" name="%s" required placeholder="%s"></textarea>' % (fid, fid, ph)

    def choices(name, opts):
        return '<div class="choices">%s</div>' % ''.join(
            '<label class="choice"><input type="checkbox" name="%s" value="%s"><span>%s</span></label>' % (name, o_, o_) for o_ in opts)

    def fields_fs(key):
        return '<fieldset class="fs"><legend>Fields</legend>%s</fieldset>' % choices(key + '-areas', c['fields'])

    sizes = ['1 to 5', '6 to 20', '21 to 100', 'More than 100']
    types = [('individual', 'Individual', 'Scientists and students with an institutional email.', 'users'),
             ('institute', 'Institute', 'Companies, academic institutes and CROs.', 'flask'),
             ('hospital', 'Hospital', 'Clinical teams and hospital units.', 'dish')]
    DEFAULT = 'institute'  # chosen when the page opens, so a form is already there
    type_cards = ''.join('<label class="type" for="type-%s"><input type="radio" name="type" value="%s" id="type-%s"%s>%s<b>%s</b><span>%s</span></label>'
                         % (v, v, v, ' checked' if v == DEFAULT else '', ico(i_, n), t, dd) for n, (v, t, dd, i_) in enumerate(types))
    ind = ('<div class="form-step" id="step-individual" hidden><h2 class="form__title">About you</h2><div class="fgrid">%s%s%s%s</div>%s'
           '<div class="fgrid">%s%s</div>%s</div>'
           % (field('ind-name', 'Full name', inp('ind-name', auto='name')),
              field('ind-email', 'Work email', inp('ind-email', 'email', 'email', extra=' aria-describedby="ind-email-hint"'), 'An institutional address helps us verify faster.'),
              field('ind-inst', 'Institution', inp('ind-inst', auto='organization')),
              field('ind-role', 'Role', inp('ind-role', auto='organization-title', ph='Postdoc, PI, bioinformatician')),
              fields_fs('ind'),
              field('ind-orcid', 'ORCID', inp('ind-orcid', req=False, ph='0000-0000-0000-0000', extra=r' inputmode="numeric" pattern="\d{4}-\d{4}-\d{4}-\d{3}[\dX]"'), opt=True),
              field('ind-heard', 'How did you hear about us?', sel('ind-heard', ['A colleague', 'A conference', 'A publication', 'Search', 'Social media', 'Other'])),
              field('ind-use', 'Intended use', area('ind-use', 'What would you do with the workspace in the first month?'))))
    org = ('<div class="form-step" id="step-institute"><h2 class="form__title">About your organization</h2><div class="fgrid">%s%s%s%s%s%s%s%s</div>%s%s'
           '<fieldset class="fs"><legend>Compliance needs</legend>%s</fieldset></div>'
           % (field('org-name', 'Organization name', inp('org-name', auto='organization')),
              field('org-type', 'Type', sel('org-type', ['Private company', 'Academic institute', 'CRO', 'Other'])),
              field('org-country', 'Country', inp('org-country', auto='country-name')),
              field('org-web', 'Website', inp('org-web', 'url', 'url', ph='https://', extra=' inputmode="url"')),
              field('org-contact', 'Contact name', inp('org-contact', auto='name')),
              field('org-email', 'Work email', inp('org-email', 'email', 'email')),
              field('org-role', 'Your role', inp('org-role', auto='organization-title')),
              field('org-size', 'Team size', sel('org-size', sizes)),
              fields_fs('org'),
              field('org-use', 'Intended use', area('org-use', 'Which teams, which questions, which data?')),
              choices('org-compliance', ['GDPR', 'HIPAA', 'ISO 27001', 'SOC 2', 'IVDR / MDR', 'GxP', 'Data residency'])))
    hos = ('<div class="form-step" id="step-hospital" hidden><h2 class="form__title">About your hospital</h2><div class="fgrid">%s%s%s%s%s%s%s%s%s%s</div>%s%s'
           '<fieldset class="fs"><legend>Compliance needs</legend>%s</fieldset></div>'
           % (field('hos-name', 'Hospital name', inp('hos-name', auto='organization')),
              field('hos-dept', 'Department or unit', inp('hos-dept', ph='Oncology, clinical genetics, molecular pathology')),
              field('hos-country', 'Country', inp('hos-country', auto='country-name')),
              field('hos-web', 'Website', inp('hos-web', 'url', 'url', req=False, ph='https://', extra=' inputmode="url"'), opt=True),
              field('hos-contact', 'Contact name', inp('hos-contact', auto='name')),
              field('hos-email', 'Work email', inp('hos-email', 'email', 'email')),
              field('hos-role', 'Your role', sel('hos-role', ['Clinician', 'Clinical scientist', 'Data manager', 'IT or security', 'Administration', 'Other'])),
              field('hos-size', 'Team size', sel('hos-size', sizes)),
              field('hos-data', 'Patient data involved', sel('hos-data', ['No patient data', 'Anonymized or pseudonymized data', 'Identifiable data', 'Not sure yet'])),
              field('hos-ethics', 'Ethics approval', sel('hos-ethics', ['Not needed for this use', 'In preparation', 'Approved', 'Not sure yet'])),
              fields_fs('hos'),
              field('hos-use', 'Intended use', area('hos-use', 'Which questions, which cohorts, which workflows?')),
              choices('hos-compliance', ['GDPR', 'HIPAA', 'Data processing agreement', 'Data residency', 'On-premise or private hosting', 'Single sign-on'])))
    consent = ('<div class="form-step" id="step-consent"><div class="field" id="consent-field"><label class="consent" for="consent">'
               '<input type="checkbox" id="consent" name="consent" required><span>I agree to the <a href="/terms/">Terms</a> and the '
               '<a href="/privacy/">Privacy Policy</a>. WelloWork AB processes this request to review access.</span></label>'
               '<span class="err" id="consent-error" hidden>Please agree to continue.</span></div>'
               '<div class="form__foot"><span class="hint" id="form-status" aria-live="polite">We reply within 5 working days.</span>'
               '<div class="form__actions"><button class="btn btn--primary" type="submit">Send request%s</button></div></div></div>' % ARROW)
    frm = ('<form class="rq" id="access-form" novalidate>'
           '<fieldset class="fs" aria-labelledby="type-title">'
           '<h2 class="form__title rq__title" id="type-title">Select the option that fits you and fill out the request form</h2>'
           '<div class="types">%s</div></fieldset>%s%s%s%s</form>' % (type_cards, ind, org, hos, consent))
    success = ('<div class="success" id="access-success" hidden tabindex="-1">%s<h2 class="form__title">Request received.</h2>'
               '<p class="lede">We process every request within 5 working days. You will hear from us by email.</p></div>' % ico('check', 4))
    o = [phero(c['h1'], c['hero'], '', short=True, sub=c['sub'])]
    o.append('<section class="band band--dark" aria-label="Request form"><div class="wrap"><div class="rqwrap">%s%s</div></div></section>' % (frm, success))
    return ''.join(o)


# ---- legal ----------------------------------------------------------------
def legal_page(key):
    c = LEGAL[key]
    body = ''.join('<h2>%s</h2>%s' % (h, p) for h, p in c['body'])
    other = ('<a href="/privacy/">Privacy policy</a>' if key == 'terms' else '<a href="/terms/">Terms of service</a>')
    return (phero(c['h1'], c['hero'], '', short=True) +
            '<section class="band band--dark" aria-label="%s"><div class="wrap"><article class="prose rv">'
            '<div class="note">%s<p><b>Draft.</b> Under legal review before publication. The final text will carry its date.</p></div>%s'
            '<p class="prose__other">See also: %s.</p></article></div></section>' % (strip(c['h1']), ico('info', 3), body, other))


# ---- the page list: path, title, description, body, faq for schema, crumbs, extra JSON-LD
def inner_pages():
    P = []
    P.append(('/platform/', PLATFORM['title'], PLATFORM['desc'], platform_page, None, [('Home', '/'), ('Platform', '/platform/')], None))
    P.append(('/data-and-models/', DATA['title'], DATA['desc'], data_page, None, [('Home', '/'), ('Data and models', '/data-and-models/')], None))
    P.append(('/security/', SECURITY_PAGE['title'], SECURITY_PAGE['desc'], security_page, SECURITY_PAGE['faq'], [('Home', '/'), ('Security', '/security/')], None))
    P.append(('/about/', ABOUT['title'], ABOUT['desc'], about_page, None, [('Home', '/'), ('About', '/about/')], None))
    P.append(('/resources/', RESOURCES['title'], RESOURCES['desc'], resources_page, None, [('Home', '/'), ('Resources', '/resources/')], None))
    allfaq = [qa for g in faq_groups() for qa in g[1]]
    P.append(('/resources/faq/', FAQ_PAGE['title'], FAQ_PAGE['desc'], faq_page, allfaq, [('Home', '/'), ('Resources', '/resources/'), ('FAQ', '/resources/faq/')], None))
    terms = {"@context": "https://schema.org", "@type": "DefinedTermSet", "name": "Cytogent glossary",
             "url": ORIGIN + '/resources/glossary/',
             "hasDefinedTerm": [{"@type": "DefinedTerm", "name": t, "description": d_,
                                 "url": ORIGIN + '/resources/glossary/#term-' + re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')} for t, d_ in GLOSSARY]}
    P.append(('/resources/glossary/', GLOSSARY_PAGE['title'], GLOSSARY_PAGE['desc'], glossary_page, None,
              [('Home', '/'), ('Resources', '/resources/'), ('Glossary', '/resources/glossary/')], terms))
    P.append(('/request-access/', REQUEST['title'], REQUEST['desc'], request_page, None, [('Home', '/'), ('Request access', '/request-access/')], None))
    P.append(('/terms/', LEGAL['terms']['title'], LEGAL['terms']['desc'], lambda: legal_page('terms'), None, [('Home', '/'), ('Terms', '/terms/')], None))
    P.append(('/privacy/', LEGAL['privacy']['title'], LEGAL['privacy']['desc'], lambda: legal_page('privacy'), None, [('Home', '/'), ('Privacy', '/privacy/')], None))
    for s in SOLUTIONS:
        c = SOLUTION_PAGES[s['slug']]
        P.append(('/solutions/%s/' % s['slug'], c['title'], c['desc'], (lambda sl=s['slug']: solution_page(sl)), c['faq'],
                  [('Home', '/'), (strip(s['title']), '/solutions/%s/' % s['slug'])], None))
    for i in INDUSTRIES:
        c = INDUSTRY_PAGES[i['slug']]
        P.append(('/industries/%s/' % i['slug'], c['title'], c['desc'], (lambda sl=i['slug']: industry_page(sl)), None,
                  [('Home', '/'), (strip(i['title']), '/industries/%s/' % i['slug'])], None))
    return P


def hero_of(path):
    """The cell view each page shows (used for its OG image)."""
    m = {'/platform/': PLATFORM, '/data-and-models/': DATA, '/security/': SECURITY_PAGE, '/about/': ABOUT,
         '/resources/': RESOURCES, '/resources/faq/': FAQ_PAGE, '/resources/glossary/': GLOSSARY_PAGE,
         '/request-access/': REQUEST, '/terms/': LEGAL['terms'], '/privacy/': LEGAL['privacy']}
    if path in m:
        return m[path]['hero'], m[path]['h1']
    if path.startswith('/solutions/'):
        c = SOLUTION_PAGES[path.split('/')[2]]; return c['hero'], c['h1']
    if path.startswith('/industries/'):
        c = INDUSTRY_PAGES[path.split('/')[2]]; return c['hero'], c['h1']
    return ('whole', 'breathe', ''), 'Where scientists and AI agents do research <kw>together</kw>.'


# ============================================================== SEO files ===
def seo_files():
    urls = ['/', '/platform/', '/data-and-models/', '/security/', '/about/',
            '/resources/', '/resources/faq/', '/resources/glossary/',
            '/request-access/', '/terms/', '/privacy/']
    urls += ['/solutions/%s/' % s['slug'] for s in SOLUTIONS]
    urls += ['/industries/%s/' % i['slug'] for i in INDUSTRIES]
    prio = {'/': '1.0'}
    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        sm.append('<url><loc>%s%s</loc><changefreq>monthly</changefreq><priority>%s</priority></url>'
                  % (ORIGIN, u, prio.get(u, '0.8')))
    sm.append('</urlset>')

    robots = ('User-agent: *\nAllow: /\nDisallow: /request-access/success/\n\n'
              'Sitemap: %s/sitemap.xml\n' % ORIGIN)

    llms = ['# Cytogent', '', '> ' + strip(DEFINITION), '',
            'Cytogent is operated by WelloWork AB, a company registered in Sweden.', '',
            '## What it is', '',
            strip(DEFINITION), '',
            'Access is by request only. There is no self sign-up, no password and no free trial. '
            'Three request types: Individual, Institute, Hospital.', '',
            'Cytogent is a research tool. It is not a medical device and makes no clinical decisions. '
            'Agents draft, search, predict and support; a qualified scientist reviews and decides.', '',
            '## Who it is for', '']
    for i in INDUSTRIES:
        llms.append('- %s: %s (%s%s/industries/%s/)' % (strip(i['title']), strip(i['get']), ORIGIN, '', i['slug']))
    llms += ['', '## Workflows', '']
    for s in SOLUTIONS:
        llms.append('- %s: %s (%s/solutions/%s/)' % (strip(s['title']), strip(s['blurb']), ORIGIN, s['slug']))
    llms += ['', '## Key pages', '']
    for u in urls:
        llms.append('- %s%s' % (ORIGIN, u))
    llms += ['', '## Facts', '',
             '- Product: Cytogent', '- Operator: WelloWork AB', '- Country: Sweden',
             '- Data: project data is isolated and never trains shared models',
             '- EU data residency: in progress', '- Access: by request only', '- Contact: info@cytogent.com', '']
    return '\n'.join(sm), robots, '\n'.join(llms)


# =================================================================== build ==
def build():
    if os.path.isdir(DIST):
        shutil.rmtree(DIST)
    os.makedirs(os.path.join(DIST, 'fonts'), exist_ok=True)
    os.makedirs(os.path.join(DIST, 'img'), exist_ok=True)
    os.makedirs(os.path.join(DIST, 'js'), exist_ok=True)

    for f in ['Geist-Latin.woff2', 'GeistMono-Latin.woff2']:
        shutil.copy(os.path.join(STATIC, 'fonts', f), os.path.join(DIST, 'fonts', f))
    for f in os.listdir(os.path.join(STATIC, 'img')):
        shutil.copy(os.path.join(STATIC, 'img', f), os.path.join(DIST, 'img', f))
    shutil.copy(os.path.join(SRC, 'js', 'cell.js'), os.path.join(DIST, 'js', 'cell.js'))
    shutil.copy(os.path.join(SRC, 'js', 'diagrams.js'), os.path.join(DIST, 'js', 'diagrams.js'))
    shutil.copy(os.path.join(SRC, 'js', 'app.js'), os.path.join(DIST, 'js', 'app.js'))
    # favicon = the mark on its own
    open(os.path.join(DIST, 'img', 'favicon.svg'), 'w', encoding='utf-8').write(MARK)

    title = 'Cytogent — Agentic Workspace for Life Science Research'
    desc = ('An agentic workspace where scientists and AI agents research together: literature, '
            'in-silico, protein design, CRISPR, trials and regulatory documents.')
    body = home()
    open(os.path.join(DIST, 'index.html'), 'w', encoding='utf-8').write(
        page('/', title, desc, body, faq=FAQ, crumbs=None))

    built = []
    for path, t, d_, fn, faq, crumbs, extra in inner_pages():
        b_ = fn()
        out = os.path.join(DIST, path.strip('/'))
        os.makedirs(out, exist_ok=True)
        open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(page(path, t, d_, b_, faq=faq, crumbs=crumbs, extra=extra))
        built.append((path, t, b_))

    sm, robots, llms = seo_files()
    open(os.path.join(DIST, 'sitemap.xml'), 'w', encoding='utf-8').write(sm)
    open(os.path.join(DIST, 'robots.txt'), 'w', encoding='utf-8').write(robots)
    open(os.path.join(DIST, 'llms.txt'), 'w', encoding='utf-8').write(llms)
    # the pages each OG image needs: path, its hero view, its title
    json.dump([{'path': p_, 'og': og_name(p_), 'hero': list(hero_of(p_)[0][:2]), 'h1': hero_of(p_)[1]} for p_ in ['/'] + [b[0] for b in built]],
              open(os.path.join(ROOT, '_og_pages.json'), 'w'))

    art = artifact(built, 'Cytogent v3', body)
    open(os.path.join(ROOT, 'artifact.html'), 'w', encoding='utf-8').write(art)

    print('pages            %d' % (1 + len(built)))
    print('artifact.html    %d KB' % (os.path.getsize(os.path.join(ROOT, 'artifact.html')) // 1024))
    print('sitemap urls     %d' % sm.count('<loc>'))


if __name__ == '__main__':
    build()
