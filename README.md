# Cytogent website

Marketing site for [cytogent.com](https://cytogent.com), operated by WelloWork AB. It has 27 static pages: home, platform, compare (a hub and 3 product pages), customers, data and models, security, about, resources (hub, FAQ, glossary), request access, terms, privacy, 7 solution pages and 4 industry pages.

## Layout

| Path | What it is |
| --- | --- |
| `site/` | **The deployed site.** Plain static HTML, minified JS with a content hash in each name, fonts, images, OG images, icons (`favicon.ico`, `apple-touch-icon.png`, `img/logo-512.png`), `sitemap.xml`, `robots.txt`, `llms.txt`, `404.html`. No build step on the host. |
| `source/` | The Python generator that produces `site/`. Home copy: `src/content.py`. Inner-page copy: `src/pages.py`. Styles: `src/css/site.css`. Scripts: `src/js/` (`demo.js` is the live demo, `consent.js` is the cookie bar and analytics). |
| `docs/` | `HANDOFF.md` (handoff, open items to confirm, pre-launch checklist), `V2_BRIEF.md` (the brief the v2 site was built from) and full-page screenshots of every route. |
| `api/request-access.js` | Serverless function behind the request-access form. It emails each request to request@cytogent.com through [Resend](https://resend.com). |
| `source/lastmod.json` | The date each page last changed, and a hash of its content. The build updates it; commit it with `site/`. |
| `vercel.json` | Hosting config: serves `site/`, trailing slashes, redirects (`cytogent.vercel.app` → `cytogent.com`), security and cache headers. |

## Deploy (Vercel)

The domain `cytogent.com` already points at Vercel through Cloudflare DNS.

1. In Vercel, go to **Add New → Project** and import `drjohn-code/cytogent`.
2. Leave **Framework Preset** on *Other*. `vercel.json` already sets the output directory to `site` with no build command.
3. Deploy.
4. In **Project → Settings → Domains**, add `cytogent.com` and `www.cytogent.com`, and set `www` to redirect to the apex.
5. Set up the request-access email (see below).

After that, every push to `main` deploys to production and every other branch gets a preview URL.

## Request-access email

The three forms on `/request-access/` (Individual, Institute, Hospital) post to `/api/request-access`. The function checks the answers and emails them to **request@cytogent.com**, with the requester's address set as Reply-To so you can answer directly. The function checks required fields, keeps only known fields, escapes all input, and drops spam: submissions that fill a hidden field or arrive within 2.5 seconds of the page loading are silently discarded.

Setup:

1. **Make request@cytogent.com able to receive mail.** `cytogent.com` has no MX records yet. The simplest fix is Cloudflare → cytogent.com → **Email → Email Routing**: add `request@cytogent.com` and forward it to the inbox the team reads. A mailbox with Google Workspace or Microsoft 365 also works.
2. **Create a Resend account** and add the domain `cytogent.com` under **Domains**. Add the DNS records it shows (SPF and DKIM on a `send` subdomain) in Cloudflare, then wait until the domain shows **Verified**.
3. **Create an API key** in Resend with *Sending access*.
4. In Vercel → Project → **Settings → Environment Variables**, add:

   | Name | Value | Required |
   | --- | --- | --- |
   | `RESEND_API_KEY` | the key from step 3 | yes |
   | `MAIL_TO` | defaults to `request@cytogent.com` | no |
   | `MAIL_FROM` | defaults to `Cytogent website <noreply@cytogent.com>` | no |

5. Redeploy, then send a test request from the live page.

Until `RESEND_API_KEY` is set, the form shows "The form is not configured yet." and sends nothing. If sending fails, the form stays filled in and shows an error, so the visitor can try again. Failures are logged in Vercel → Project → **Logs**.

## Editing content

The HTML in `site/` is generated. Edit the copy in `source/src/`, then rebuild:

```bash
cd source
pip install playwright pillow
python3 -m playwright install chromium
./make.sh
```

The build also needs Node.js: `make.sh` runs `npm ci` in `source/` the first time, to install terser (pinned in `source/package.json`).

`make.sh` does this, in order:

1. `build.py` builds every page into `source/dist/`, minifies the scripts with terser and names each one after a hash of its content (`/js/app.<hash>.js`), and writes `sitemap.xml`, `robots.txt` and `llms.txt`.
2. `icons.py` renders `favicon.ico` (48×48), `apple-touch-icon.png` (180×180) and `img/logo-512.png` from the Cytogent mark.
3. `og.py` renders the OG images.
4. `tools/seo_check.py` checks the result (see below). If it finds a problem, the build stops and `site/` is not touched.
5. The result is synced into `site/`.

Commit `site/` and `source/lastmod.json` along with your source changes.

### Sitemap dates

Each URL in `sitemap.xml` has a `<lastmod>`: the day that page's content last changed. The build hashes each page's title, description and `<main>` HTML (not the inline CSS or scripts) and keeps the hash and the date in `source/lastmod.json`. The date changes only when the hash changes. A changed page gets today's date, or `CG_BUILD_DATE` if it is set (for example `CG_BUILD_DATE=2026-10-02 ./make.sh`). A change to the nav, the footer or the styles does not change any date.

To check a build, serve `site/` locally and run the checks:

```bash
python3 -m http.server 8000 --directory site
```

The checks expect the fresh build on port 8765. From `source/`:

```bash
python3 -m http.server 8765 --directory dist
```

Then, in another terminal, run `python3 verify_all.py`, `python3 tools/dg_layout_check.py` and `python3 tools/v2_check.py`. They need `source/_og_pages.json`, which `make.sh` writes. `verify_all.py` and `v2_check.py` exit with 1 when they find a problem. `python3 tools/shots_docs.py` renews the screenshots in `docs/screenshots/`.

### The SEO check

`python3 tools/seo_check.py` (from `source/`) needs no browser and no server. It reads the HTML in `dist/` and fails when:

- a title is missing or longer than 60 characters, or a description is missing, shorter than 70 or longer than 155 characters;
- two pages share a title or a description;
- the canonical is not `https://cytogent.com` + the page path;
- a page does not have exactly one `<h1>`;
- an `<img>` has no `alt` (`alt=""` is fine for a decorative image), no `width` and `height`, or points to a file that does not exist;
- a link preview tag is missing (`og:title`, `og:description`, `og:url`, `og:image`, `og:image:alt`, `og:locale`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`), or the image file does not exist;
- a JSON-LD block does not parse;
- `sitemap.xml` misses an indexable page, lists a `noindex` page, or has a URL without a date.

It also checks `site/404.html`: a title, one `<h1>`, `alt` on images, and `noindex`.

Any `<img>` added later needs `alt`, `width`, `height` and `loading="lazy"`, unless it is the largest thing on the first screen.

## Analytics and cookie consent

Google Analytics 4 (`G-H7WJPJ2WSP`) loads only after a visitor chooses "Accept analytics" in the cookie bar. Before that, the site makes no request to Google. The script is `source/src/js/consent.js`; the build inlines it into every page.

`site/404.html` is written by hand and is not rebuilt, so it carries its own copy of that script and its own icon links. If you change `consent.js`, paste the new version into `site/404.html` too. The build prints a warning when the two differ.

## Switches in the copy

| Where | What it does |
| --- | --- |
| `PILOTS_PUBLIC` in `source/src/content.py` | `False` keeps `/customers/` out of the nav, footer, sitemap and `llms.txt`, and marks it `noindex`. Set it to `True` once both pilot companies have agreed in writing. |
| `SITE['linkedin']` in `source/src/content.py` | The Cytogent LinkedIn page. The footer link and the JSON-LD (`sameAs`) read it from here. |
| `SITE['google_site_verification']` in `source/src/content.py` | Empty. If you ever verify Search Console with the HTML-tag method, paste the token here and rebuild: the home page then gets the `google-site-verification` meta tag. Not needed with DNS verification. |
| `FACTS_CHECKED` in `source/src/content.py` | The date printed as "checked on" and "Last checked" on the compare pages. Change it only after re-checking the sources listed on those pages. |

## Google Search Console

Done by hand, once:

1. In [Search Console](https://search.google.com/search-console), add a **Domain** property for `cytogent.com`.
2. Copy the TXT record it shows. In Cloudflare → cytogent.com → **DNS → Records**, add a record of type **TXT**, name `@`, with that value. Then click **Verify** in Search Console (DNS can take a few minutes).
3. **Sitemaps**: submit `https://cytogent.com/sitemap.xml`.
4. **URL inspection**: inspect `https://cytogent.com/` and click **Request indexing**.
5. After about a week, open **Indexing → Pages** and check that the 26 pages are indexed. Pages listed as "Duplicate" or "Alternate page with proper canonical tag" on `cytogent.vercel.app` are expected until the redirect has been seen.

## Before launch

See the open items in [`docs/HANDOFF.md`](docs/HANDOFF.md#open-items-to-confirm). Every one is also marked in the built HTML as `<!-- CONFIRM: … -->`. The main ones:

- **Pilot permission**: Cervixel and Eipha Biosciences are named on the home page. Confirm in writing, then set `PILOTS_PUBLIC`.
- **Product claims** marked CONFIRM: life-science models, MCP connectors, health data standards, ScienceDirect, encryption at rest.
- **Compare pages and privacy text** need legal review, and the competitor facts need a re-check on launch day.
- **Google Analytics admin**: set data retention to 14 months.

- **Request-access email** needs the one-time setup above (Email Routing, Resend, `RESEND_API_KEY`).
- **Terms and Privacy** are v1 drafts that still need legal review.
- **Security statuses** (MFA, audit log, SOC 2) and **product claims** (connectors, datasets, models) need to be confirmed.
