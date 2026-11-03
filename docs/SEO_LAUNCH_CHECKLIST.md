# SEO launch checklist

Built up during Phases 4–8 (3 November 2026). Ticked items were checked **locally** against the production build; nothing has been checked on a deployed site yet.

## Cutover, in order

1. Launch blockers resolved (`docs/TODO_VERIFY.md#launch-blockers`). **Launched with items open, by owner decision (3 Nov 2026).**
2. [x] `vercel.json` switched to Next.js.
3. [x] Preview deploy: 193/193 tests passed (3 Nov 2026).
4. [x] Production deploy of `b42d93e`: 193/193 tests passed against `https://cytogent.com` (3 Nov 2026); HTTPS, `www` and `vercel.app` redirects and HSTS checked with curl.
5. Search Console and Bing Webmaster: verify the domain, submit the sitemap, watch coverage for the retired URLs (should report 410, not soft 404).
6. Rich Results Test and schema.org validator on `/`, `/platform`, `/faq`, `/glossary`.

## Hosting and canonical host

- [ ] Switch `vercel.json` from the legacy static output (`framework: null`, `outputDirectory: site`) to Next.js, at cutover only. Keep the `cytogent.vercel.app` → `cytogent.com` redirect.
- [ ] Vercel → Domains: `cytogent.com` primary; `www.cytogent.com` redirects to the apex (permanent).
- [ ] HTTPS enforced (Vercel default). Check `http://cytogent.com` → `https://cytogent.com` in one hop.
- [ ] Canonical form everywhere: `https://cytogent.com`, apex, no `www`, no trailing slash (checked locally on every route).

## Redirects and retired URLs

Handled in `src/proxy.ts` (see `src/content/redirects.ts`). It answers with **301** (one hop), not Next's default 308, so no host-level 301 is needed for these.

- [x] Local test with curl (`next start`, 3 Nov 2026): all §4 redirects one hop; trailing-slash variants one hop; 410 for retired sections; look-alike paths not caught; assets unaffected.
- [ ] Repeat the same curl checks against the deployed site (preview URL, then production).
- [ ] In Google Search Console, after launch: check that the retired URLs show as removed (410), not as soft 404s.

## Pages

- [x] Unique `<title>` and meta description on all 18 indexable routes (checked 3 Nov 2026).
- [x] One H1 per page; self-referencing canonical; breadcrumbs on inner pages.
- [x] 404 uses `not-found.tsx` with `noindex` (added by Next); 410 sends `x-robots-tag: noindex`.
- [ ] Home meta description is 163 characters (as written in the brief); decide whether to shorten.

## Discovery files and structured data (Phase 6, checked locally 3 Nov 2026)

Single source: `src/content/routes.ts` (titles, descriptions, H1s, breadcrumb parents). Page metadata, visible breadcrumbs, JSON-LD, sitemap, `llms.txt` and OG images all read from it.

- [x] `robots.txt`: `Allow: /` for all, sitemap link. `/thank-you` is not disallowed (there is no such page; there is no form). No `/api/` rule: the new site has no API routes.
- [x] AI training crawlers: `AI_TRAINING_CRAWLERS=block` adds a `Disallow: /` group for GPTBot, Google-Extended, CCBot, ClaudeBot, Applebot-Extended. Both settings built and checked. Names verified on each operator's own docs page on 3 Nov 2026 (OpenAI platform docs, Google Search Central, commoncrawl.org, Anthropic support, Apple support).
- [x] `sitemap.xml`: the 19 manifest routes, canonical URLs, no 404/410, no drafts. **No `<lastmod>`**: there is no reliable per-page change date yet, and the build date would be false.
- [x] JSON-LD `@graph` on every page with stable `@id`s (`/#organization`, `/#website`, `<url>#webpage`, `<url>#breadcrumb`). Organization has no email, `sameAs` or `parentOrganization` (none verified). `Service` only on `/platform` and `/pilot-programme`, no `offers`. `FAQPage` on `/faq` (12 Q&As, text identical to the visible answers, checked); `DefinedTermSet` on `/glossary` (18 terms, identical text, checked). `CollectionPage` on `/insights`, `ContactPage` on `/contact`, `AboutPage` on `/about`. No medical, drug, rating, review or speakable markup.
- [x] JSON-LD breadcrumbs equal the visible breadcrumbs on all 18 inner pages (checked).
- [x] OG images: `/og/<slug>`, 1200×630 PNG, prerendered from each page's real H1 and description; `og:image:alt` is the H1. `twitter:card` = `summary_large_image`; no `twitter:site` (there is no X account).
- [x] `llms.txt`: built from verified facts, manifest pages and published posts only. Optional; no ranking effect claimed. `llms-full.txt` not generated.
- [ ] **Not run:** Google Rich Results Test and Schema.org validator on the deployed URLs. The FAQ rich result may not appear even with valid markup; that is expected.
- [ ] IndexNow: not set up (optional, Bing/Yandex only; needs a key file and host). Never claimed for Google.
- [ ] RSS: not shipped (no published posts).
- [ ] After launch: submit `https://cytogent.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
