# -*- coding: utf-8 -*-
"""Raster icons from the Cytogent mark (static/img/cytogent-mark-on-dark.svg), on the #05060E ground:
  dist/img/logo-512.png      512x512, the logo in the JSON-LD
  dist/apple-touch-icon.png  180x180
  dist/favicon.ico           48x48, for search results and browsers that do not take the SVG icon"""
import os, io
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, 'dist')
MARK = open(os.path.join(ROOT, 'static', 'img', 'cytogent-mark-on-dark.svg'), encoding='utf-8').read()
GROUND = '#05060E'
SIZE = 1024   # rendered once, then scaled down

PAGE = ('<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:%s}'
        'div{width:%dpx;height:%dpx;display:flex;align-items:center;justify-content:center}'
        'svg{width:80%%;height:80%%}</style><div>%s</div>' % (GROUND, SIZE, SIZE, MARK))


def main():
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={'width': SIZE, 'height': SIZE})
        pg.set_content(PAGE)
        big = Image.open(io.BytesIO(pg.screenshot())).convert('RGB')
        b.close()
    os.makedirs(os.path.join(DIST, 'img'), exist_ok=True)
    big.resize((512, 512), Image.LANCZOS).save(os.path.join(DIST, 'img', 'logo-512.png'), optimize=True)
    big.resize((180, 180), Image.LANCZOS).save(os.path.join(DIST, 'apple-touch-icon.png'), optimize=True)
    big.resize((48, 48), Image.LANCZOS).save(os.path.join(DIST, 'favicon.ico'), sizes=[(48, 48)])
    print('icons            logo-512.png, apple-touch-icon.png, favicon.ico')


if __name__ == '__main__':
    main()
