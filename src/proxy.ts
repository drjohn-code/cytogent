import { NextResponse, type NextRequest } from "next/server";
import { isGone, redirects } from "@/content/redirects";
import { site } from "@/content/site";

/**
 * Runs before routing (Next.js 16 "proxy", formerly middleware). next.config sets
 * skipTrailingSlashRedirect so this file owns trailing-slash handling:
 *   1. retired sections → 410 Gone (branded HTML, real 410 status)
 *   2. legacy URLs      → one 301 to the new route
 *   3. any other "/x/"  → one 301 to "/x" (canonical: no trailing slash)
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.replace(/\/+$/, "") : pathname;

  if (isGone(path)) return gone();

  const target = redirects[path];
  if (target) return NextResponse.redirect(new URL(target, request.url), 301);

  if (path !== pathname) return NextResponse.redirect(new URL(path + search, request.url), 301);

  return NextResponse.next();
}

export const config = {
  // Skip Next internals and files with an extension (icons, brand SVGs, fonts, robots.txt …).
  matcher: ["/((?!_next/|.*\\.[a-zA-Z0-9]+$).*)"],
};

/**
 * Self-contained page: it must not echo the requested path (no retired slugs or third-party names in the HTML).
 * Colours are the token values from src/styles/tokens.css (this response is outside the app's CSS).
 */
function gone() {
  const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Page removed | ${site.name}</title>
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<style>
  :root { color-scheme: dark; }
  body { margin: 0; min-height: 100svh; display: grid; place-items: center; background: #050b14; color: #eaf4f5;
         font: 17px/1.6 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { max-width: 34rem; padding: 32px 16px; }
  img { display: block; height: 26px; width: auto; margin-bottom: 40px; }
  p.code { font: 12px ui-monospace, Menlo, monospace; letter-spacing: .14em; color: #42e8c8; margin: 0; }
  h1 { font-size: 2.25rem; line-height: 1.15; margin: 12px 0 16px; }
  p { color: #8fa6b4; margin: 0 0 28px; }
  nav { display: flex; flex-wrap: wrap; gap: 12px; }
  a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 18px; border-radius: 999px;
      border: 1px solid #56748a; color: #eaf4f5; text-decoration: none; font-weight: 600; }
  a.primary { background: #42e8c8; border-color: #42e8c8; color: #050b14; }
  a:focus-visible { outline: 2px solid #42e8c8; outline-offset: 3px; }
</style>
</head>
<body>
<main>
  <img src="/brand/cytogent-logo.svg" alt="${site.name}">
  <p class="code">410 · GONE</p>
  <h1>This page has been removed.</h1>
  <p>It belonged to an earlier version of this site and will not come back. ${site.name} is now building an experimental intelligence layer for oncology R&amp;D.</p>
  <nav aria-label="Next steps">
    <a class="primary" href="/">Go to the home page</a>
    <a href="/platform">How the loop works</a>
  </nav>
</main>
</body>
</html>`;
  return new NextResponse(html, {
    status: 410,
    headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex", "cache-control": "public, max-age=3600" },
  });
}
