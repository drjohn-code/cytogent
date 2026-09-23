#!/bin/sh
set -e
cd "$(dirname "$0")"
python3 build.py
python3 poster.py
python3 og.py
# publish the fresh build into the deployed folder (keep the hand-written 404 page)
rsync -a --delete --exclude 404.html dist/ ../site/
