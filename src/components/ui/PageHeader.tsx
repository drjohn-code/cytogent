import Link from "next/link";
import type { ReactNode } from "react";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { crumbsFor, route } from "@/content/routes";
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

/**
 * Inner-page header: breadcrumbs, H1, a visible answer summary, then the page CTA.
 * Breadcrumbs, H1 and the page's JSON-LD all come from the route manifest, so they cannot disagree.
 */
export function PageHeader({
  path,
  eyebrow,
  answer,
  actions,
  aside,
}: {
  path: string;
  eyebrow: string;
  answer: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="border-b border-line">
      <PageJsonLd path={path} />
      <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <Breadcrumbs items={crumbsFor(path)} />
          <p className="eyebrow mt-8">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{route(path).heading}</h1>
          <div className="mt-6 max-w-2xl space-y-4 text-lg text-muted">{answer}</div>
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {aside && <div>{aside}</div>}
      </Container>
    </header>
  );
}
