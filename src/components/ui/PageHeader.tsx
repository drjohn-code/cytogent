import Link from "next/link";
import type { ReactNode } from "react";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { crumbsFor, route } from "@/content/routes";
import { ColourLens } from "@/components/hero/ColourLens";
import { Container } from "./Section";

export interface Crumb {
  label: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 font-mono text-xs text-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="text-text">
                  {c.label}
                </span>
              ) : (
                <>
                  <Link href={c.href} className="inline-flex min-h-11 min-w-11 items-center underline-offset-4 hover:underline">
                    {c.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Each inner page's hero image (public/images/gen). Legal pages pass `plain` and have none. */
const heroImage: Record<string, string> = {
  "/platform": "lab-automation",
  "/science": "tem-cancer-cell",
  "/for-drug-developers": "sem-drug-response",
  "/pilot-programme": "lab-bench",
  "/partners": "lab-interior",
  "/partners/laboratories": "lab-imaging-suite",
  "/partners/biobanks": "lab-biobank",
  "/investors": "sem-cell-division",
  "/for-people": "sem-tcell-attack",
  "/about": "team-data",
  "/data-governance": "lab-interior",
  "/insights": "sem-tumour-tissue",
  "/faq": "sem-organoid",
  "/glossary": "tem-cancer-cell",
  "/contact": "lab-imaging-suite",
};

/**
 * Inner-page header: a full-width image hero (greyscale, with a colour lens that follows the pointer),
 * breadcrumbs, H1, a visible answer summary, then the page CTA. A page's own diagram sits on the right.
 * Breadcrumbs, H1 and the page's JSON-LD all come from the route manifest, so they cannot disagree.
 */
export function PageHeader({
  path,
  eyebrow,
  answer,
  actions,
  aside,
  plain = false,
}: {
  path: string;
  eyebrow: string;
  answer: ReactNode;
  actions?: ReactNode;
  /** The page's own diagram, shown on the right over the image. */
  aside?: ReactNode;
  plain?: boolean;
}) {
  const image = plain ? undefined : heroImage[path];
  return (
    <header className="relative isolate overflow-hidden border-b border-line">
      <PageJsonLd path={path} />
      {image && (
        <>
          <ColourLens src={`/images/gen/${image}.webp`} priority lens={200} />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${
              aside
                ? "bg-[linear-gradient(90deg,var(--canvas)_12%,color-mix(in_srgb,var(--canvas)_60%,transparent)_50%,color-mix(in_srgb,var(--canvas)_30%,transparent))]"
                : "bg-[linear-gradient(90deg,var(--canvas)_12%,color-mix(in_srgb,var(--canvas)_70%,transparent)_48%,transparent_80%)]"
            }`}
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,var(--canvas),transparent)]" />
        </>
      )}
      <Container
        className={`relative grid gap-12 py-16 sm:py-24 ${image ? "lg:min-h-[68svh] lg:items-end" : ""} ${aside ? "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]" : ""}`}
      >
        <div className="max-w-3xl">
          <Breadcrumbs items={crumbsFor(path)} />
          <p className="eyebrow mt-8">{eyebrow}</p>
          <h1 className="mt-4 text-4xl sm:text-6xl">{route(path).heading}</h1>
          <div className="mt-6 max-w-2xl space-y-4 text-lg text-muted">{answer}</div>
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {aside && <div className="reveal">{aside}</div>}
      </Container>
    </header>
  );
}
