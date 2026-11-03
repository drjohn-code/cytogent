/**
 * Legacy URL handling (BRIEF §4). Applied in src/proxy.ts so every legacy URL takes exactly one hop:
 * `/resources/` → `/insights`, not `/resources/` → `/resources` → `/insights`.
 * Keys are written without the trailing slash; the proxy matches both forms.
 */
export const redirects: Record<string, string> = {
  "/resources": "/insights",
  "/resources/faq": "/faq",
  "/resources/glossary": "/glossary",
  "/request-access": "/contact",
  "/data-and-models": "/data-governance",
  "/security": "/data-governance",
  "/industries/pharma-and-biotech": "/for-drug-developers",
  "/industries/cro-and-clinical-teams": "/partners/laboratories",
  "/industries/hospitals-and-academic-labs": "/partners/biobanks",
};

/**
 * Retired sections answered with HTTP 410 Gone. Prefix match on whole path segments, so no retired
 * slug (and no third-party name) has to be listed anywhere in the repo.
 */
export const gonePrefixes = ["/compare", "/solutions", "/customers", "/industries/regulatory-and-ip-teams"];

export function isGone(path: string) {
  return gonePrefixes.some((p) => path === p || path.startsWith(`${p}/`));
}
