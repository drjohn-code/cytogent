# Cytogent website

Marketing site for [cytogent.com](https://cytogent.com), operated by WelloWork AB. It has 22 static pages: home, platform, data and models, security, about, resources (hub, FAQ, glossary), request access, terms, privacy, 7 solution pages and 4 industry pages.

## Layout

| Path | What it is |
| --- | --- |
| `site/` | **The deployed site.** Plain static HTML, JS, fonts, images, OG images, `sitemap.xml`, `robots.txt`, `llms.txt`, `404.html`. No build step on the host. |
| `source/` | The Python generator that produces `site/`. Home copy: `src/content.py`. Inner-page copy: `src/pages.py`. Styles: `src/css/site.css`. Scripts: `src/js/`. |
| `docs/` | `HANDOFF.md` (design handoff and pre-launch checklist) and full-page screenshots of every route. |
| `vercel.json` | Hosting config: serves `site/`, trailing slashes, security and cache headers. |

## Deploy (Vercel)

The domain `cytogent.com` already points at Vercel through Cloudflare DNS.

1. In Vercel, go to **Add New → Project** and import `drjohn-code/cytogent`.
2. Leave **Framework Preset** on *Other*. `vercel.json` already sets the output directory to `site` with no build command.
3. Deploy.
4. In **Project → Settings → Domains**, add `cytogent.com` and `www.cytogent.com`, and set `www` to redirect to the apex.

After that, every push to `main` deploys to production and every other branch gets a preview URL.

## Editing content

The HTML in `site/` is generated. Edit the copy in `source/src/`, then rebuild:

```bash
cd source
pip install playwright pillow
python3 -m playwright install chromium
./make.sh
```

`make.sh` builds into `source/dist/`, renders the hero poster and the OG images, and then syncs the result into `site/`. Commit `site/` along with your source changes.

To check a build, serve `site/` locally and run the checks:

```bash
python3 -m http.server 8000 --directory site
```

Then, in another terminal, run `source/verify_all.py` and `source/tools/dg_layout_check.py`. They need `source/_og_pages.json`, which `make.sh` writes.

## Before launch

See the checklist in [`docs/HANDOFF.md`](docs/HANDOFF.md#please-check-before-launch). The main open items:

- **The request-access form sends nothing yet.** It validates and shows the success state, but it only logs the answers to the browser console. It needs a real endpoint (see `source/src/js/app.js`).
- **Terms and Privacy** are v1 drafts that still need legal review.
- **Security statuses** (MFA, audit log, SOC 2) and **product claims** (connectors, datasets, models) need to be confirmed.
