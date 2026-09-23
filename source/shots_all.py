import os, sys, json
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.join(ROOT,'shots','pages'); os.makedirs(OUT,exist_ok=True)
pages=[p['path'] for p in json.load(open(os.path.join(ROOT,'_og_pages.json')))]
only=sys.argv[1].split(',') if len(sys.argv)>1 and sys.argv[1] else None
mobile=len(sys.argv)>2 and sys.argv[2]=='m'
errs={}
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True) if mobile else b.new_context(viewport={'width':1440,'height':900})
    pg=ctx.new_page()
    cur={'e':[]}
    pg.on('pageerror',lambda e:cur['e'].append(str(e)))
    pg.on('console',lambda m:cur['e'].append(m.text) if m.type=='error' else None)
    for path in pages:
        if only and path not in only: continue
        cur['e']=[]
        pg.goto('http://127.0.0.1:8765'+path, wait_until='networkidle'); pg.wait_for_timeout(1200)
        name=(path.strip('/').replace('/','_') or 'home')+('-m' if mobile else '')
        pg.screenshot(path=os.path.join(OUT,name+'-top.png'))
        H=pg.evaluate('document.body.scrollHeight'); y=0
        while y<H:
            pg.evaluate('window.scrollTo(0,%d)'%y); pg.wait_for_timeout(140); y+=500
        pg.wait_for_timeout(2400); pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(500)
        pg.screenshot(path=os.path.join(OUT,name+'-full.png'),full_page=True)
        im=Image.open(os.path.join(OUT,name+'-full.png'))
        w=520 if not mobile else 300
        im=im.resize((w,int(im.height*w/im.width))); im.save(os.path.join(OUT,name+'-thumb.png'))
        errs[path]=cur['e'][:3]
    b.close()
print({k:v for k,v in errs.items() if v} or 'no errors')
