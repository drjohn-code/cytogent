# cytogent.com

The website for Cytogent: the Experimental Intelligence Layer for oncology R&D, delivered as Decision-as-a-Service. Next.js App Router, built from the V3.1 build prompt in November 2026.

> **Status (3 November 2026): built and tested locally; not deployed.** `vercel.json` still deploys the legacy static site from `site/` (see [docs/LEGACY_README.md](docs/LEGACY_README.md)). Launch is blocked on owner and legal items listed in [docs/TODO_VERIFY.md](docs/TODO_VERIFY.md#launch-blockers). Nothing has been committed.

## Quick start

Needs Node.js 20.9 or newer (built with Node 25.9, npm 11.12).

```bash
npm ci
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js development server, production build, production server |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules; bans `framer-motion` imports) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | All Playwright + axe-core tests against a production build (run `npm run build` first; it starts `next start` on port 3200 itself). Set `BASE_URL` to test a deployment instead. |
| `npm run seo:check` | The `@seo` subset: page metadata, redirects, 410s, sitemap, robots, `llms.txt`, OG images |
| `npm run check:code` | Static checks: no `framer-motion`, no hard-coded colours outside the tokens, no remote fonts/images/scripts, no 21st API key, logo SVG hygiene |
| `npm run test:screens` | Screenshot matrix (every route × 390/834/1440 px × with/without reduced motion) into `screenshots/` (gitignored) |
| `npm run brand` | Rebuilds the logo system from `docs/brand/build_final_logo.py` (needs Python, Playwright, Pillow) and copies it into `public/` and `src/app/` |

## Stack

Next.js 16.4.5 (App Router, Turbopack) · React 19.3.1 · TypeScript 6.0.3 · Tailwind CSS 4.3.4 · Motion 14.9.0 (`motion/react`) · three 0.187.0 + @react-three/fiber 9.8.2 (home hero only) · Playwright 1.64.1 + axe-core 4.14.0. All versions pinned exactly; why some are not the newest is in [docs/THIRD_PARTY.md](docs/THIRD_PARTY.md).

Every page is statically prerendered. The only server code is `src/proxy.ts` (redirects and 410s). There are no API routes, forms, cookies, analytics or third-party requests.

## Where things live

| Path | What |
| --- | --- |
| `src/app/` | Routes. One folder per page, plus `robots.ts`, `sitemap.ts`, `manifest.ts`, `llms.txt/route.ts`, `og/[slug]/route.tsx`, `not-found.tsx`, favicons |
| `src/proxy.ts` | Legacy redirects (301, one hop), trailing-slash removal, branded 410 for retired sections |
| `src/content/` | **All copy-level facts and data.** See "Changing content" below |
| `src/components/` | `layout/` (header, mobile menu, footer), `ui/` (sections, page header, CTA band, legal layout), `content/` (sources, principles, "what we are not"), `visuals/` and `hero/` (hand-built SVG and the WebGL hero), `loop/`, `seo/`, `motion/`, `brand/` |
| `src/styles/tokens.css` | Design tokens: the single source for colours, surfaces, radii, motion timing (with measured contrast ratios) |
| `src/fonts/` | Self-hosted Space Grotesk and JetBrains Mono (Latin subsets) with their OFL licences |
| `brand/` | Approved logo system (1A "Refined loop"): SVG lockups, mark, wordmark, favicons. Source of what is in `public/brand/` |
| `tests/` | Playwright suites, generated from the route manifest |
| `scripts/` | `code-check.mjs`, `copy-brand.mjs` |
| `docs/` | Handover documents (index below) |
| `design-system/cytogent/MASTER.md` | What was taken from, and rejected from, the UI UX Pro Max design-system search |
| `source/`, `site/`, `api/` | **Legacy site**, still deployed. Remove at cutover (owner approval) |

## Changing content

| To change… | Edit | Notes |
| --- | --- | --- |
| A page's title, description, H1 or breadcrumb | `src/content/routes.ts` | Metadata, breadcrumbs, JSON-LD, sitemap, `llms.txt`, OG image and tests all follow automatically |
| Add a page | Add a manifest entry, then `src/app/<path>/page.tsx` using `pageMetadata("<path>")` and `<PageHeader path="<path>" …>` | Tests pick it up automatically. Add a nav/footer link in `src/content/navigation.ts` if needed |
| Company facts (email, LinkedIn, WelloWork, NVIDIA, accelerators) | `src/content/credentials.ts` | Each fact is `pending`, `planned` or `verified`. **Only `verified` facts render anywhere.** Set to `verified` only with written confirmation |
| Category line, mission, status note, brand line | `src/content/site.ts` | The status note appears in every footer |
| Sources | `src/content/references.ts` | Record how each URL was checked (`checked`) |
| FAQ, glossary | `src/content/faq.ts`, `src/content/glossary.ts` | Structured data is generated from the same text |
| Redirects / retired sections | `src/content/redirects.ts` | Tests cover every entry |
| Articles | `src/content/posts/index.ts` | None yet; topics await approval in `docs/EDITORIAL_PLAN_PROPOSAL.md`. Only `publishedPosts()` feeds the site |

Copy rules: [docs/CONTENT_STYLE_GUIDE.md](docs/CONTENT_STYLE_GUIDE.md). The claims scan (`tests/claims.spec.ts`) is not part of `npm run build`, so run `npm test` after any copy change.

## Environment variables

| Variable | Values | Default | Effect |
| --- | --- | --- | --- |
| `AI_TRAINING_CRAWLERS` | `allow`, `block` | `allow` (same as the legacy site) | `block` adds a `Disallow: /` group to `robots.txt` for GPTBot, Google-Extended, CCBot, ClaudeBot and Applebot-Extended. Search crawlers are never blocked. Read at **build** time. Names checked against each operator's documentation on 3 Nov 2026; recheck before relying on them |
| `BASE_URL` | URL | — | Tests only: run the suite against a deployment instead of a local build |

No secrets are needed to build or run the site.

## Deploying (cutover from the legacy site)

1. Resolve the launch blockers in [docs/TODO_VERIFY.md](docs/TODO_VERIFY.md#launch-blockers).
2. Replace `vercel.json` so Vercel builds Next.js: remove `framework: null`, `outputDirectory: "site"` and the empty build/install commands; keep the security headers (also set in `next.config.ts`) and the `cytogent.vercel.app` → `cytogent.com` redirect.
3. Deploy to a **preview** and run `BASE_URL=https://<preview-url> npm test`.
4. In Vercel → Domains: `cytogent.com` primary, `www` redirects to the apex.
5. Promote to production, then work through [docs/SEO_LAUNCH_CHECKLIST.md](docs/SEO_LAUNCH_CHECKLIST.md).
6. With owner approval, delete `source/`, `site/`, `api/` and the old logo files.

## Documentation

| Document | For |
| --- | --- |
| [docs/TODO_VERIFY.md](docs/TODO_VERIFY.md) | Launch blockers, unverified facts, untested areas |
| [docs/QA_REPORT.md](docs/QA_REPORT.md) | What was tested, results, Lighthouse lab numbers, what was not tested |
| [docs/SEO_LAUNCH_CHECKLIST.md](docs/SEO_LAUNCH_CHECKLIST.md) | Hosting, redirects, discovery files, structured data, post-launch steps |
| [docs/CONTENT_STYLE_GUIDE.md](docs/CONTENT_STYLE_GUIDE.md) | Voice, claims, numbers, citations, words to avoid |
| [docs/BRAND.md](docs/BRAND.md) | Logo construction, files, rules, history |
| [docs/MOTION_SPEC.md](docs/MOTION_SPEC.md) | Every animation, its trigger, timing and reduced-motion behaviour |
| [docs/THIRD_PARTY.md](docs/THIRD_PARTY.md) | Dependencies, versions, licences, tools used |
| [docs/EDITORIAL_PLAN_PROPOSAL.md](docs/EDITORIAL_PLAN_PROPOSAL.md) | Proposed article topics (awaiting approval) |
| [docs/GEO_PROMPT_SET.md](docs/GEO_PROMPT_SET.md) | **Internal only.** Prompts for checking how AI assistants describe Cytogent |
| [docs/LEGACY_README.md](docs/LEGACY_README.md), [docs/HANDOFF.md](docs/HANDOFF.md) | The legacy site |
