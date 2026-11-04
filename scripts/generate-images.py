"""
Generates the site's photographic imagery with Google's Gemini image models, from scripts/image-prompts.json.

    GEMINI_API_KEY=... python3 scripts/generate-images.py            # all images not yet made
    GEMINI_API_KEY=... python3 scripts/generate-images.py kinase-drug  # just these

The key is read from the environment only; never commit it. Images already in public/images/gen/ are skipped,
so a rerun only pays for what is missing. Output is WebP (Pillow), at most 2000 px wide.
Rough cost (Nov 2026): flash image models USD 0.04–0.10 per image, gemini-3-pro-image about USD 0.13 at 2K.
"""
import base64
import io
import json
import os
import sys
import urllib.error
import urllib.request

from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "images", "gen")
os.makedirs(OUT, exist_ok=True)

key = os.environ.get("GEMINI_API_KEY")
if not key:
    sys.exit("Set GEMINI_API_KEY.")

spec = json.load(open(os.path.join(ROOT, "scripts", "image-prompts.json")))
wanted = set(sys.argv[1:])

for img in spec["images"]:
    name = img["name"]
    path = os.path.join(OUT, f"{name}.webp")
    if wanted and name not in wanted:
        continue
    if not wanted and os.path.exists(path):
        print("skip", name)
        continue
    body = {
        "contents": [{"parts": [{"text": f"{img['prompt']} {spec['styles'][img.get('kind', 'data')]}"}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": img["aspect"], "imageSize": img.get("size", "2K")},
        },
    }
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{img['model']}:generateContent",
        data=json.dumps(body).encode(),
        headers={"x-goog-api-key": key, "Content-Type": "application/json"},
    )
    try:
        data = json.load(urllib.request.urlopen(req, timeout=300))
    except urllib.error.HTTPError as e:
        print("FAIL", name, e.code, e.read()[:300].decode(errors="replace"))
        if e.code == 429:
            sys.exit("Quota: billing is not enabled for this key's project.")
        continue
    parts = [p for c in data.get("candidates", []) for p in c.get("content", {}).get("parts", []) if "inlineData" in p]
    if not parts:
        print("FAIL", name, "no image returned")
        continue
    pil = Image.open(io.BytesIO(base64.b64decode(parts[0]["inlineData"]["data"]))).convert("RGB")
    if pil.width > 2000:
        pil = pil.resize((2000, round(pil.height * 2000 / pil.width)), Image.LANCZOS)
    pil.save(path, "WEBP", quality=84, method=6)
    usage = data.get("usageMetadata", {})
    print("ok", name, pil.size, f"{os.path.getsize(path) // 1024} KB", "tokens out:", usage.get("candidatesTokenCount"))
