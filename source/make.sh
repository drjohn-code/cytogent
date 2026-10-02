#!/bin/sh
set -e
cd "$(dirname "$0")"
# terser (pinned in package.json) minifies the page scripts
[ -x node_modules/.bin/terser ] || npm ci --no-audit --no-fund
python3 build.py
python3 icons.py
python3 og.py
# a failing SEO check stops here, so a bad build never reaches site/
python3 tools/seo_check.py
# publish the fresh build into the deployed folder (keep the hand-written 404 page)
rsync -a --delete --exclude 404.html dist/ ../site/
