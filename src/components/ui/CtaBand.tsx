import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./Section";

export function CtaBand({
  id = "close",
  title,
  children,
  cta,
  secondary,
}: {
  id?: string;
  title: string;
  children: ReactNode;
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="py-20 sm:py-28">
      <Container>
        <div className="glass relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-signal/10 blur-3xl"
          />
          <h2 id={`${id}-title`} className="max-w-2xl text-3xl font-semibold sm:text-4xl">
            {title}
          </h2>
          <div className="mt-4 max-w-2xl text-lg text-muted">{children}</div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={cta.href} className="btn btn-primary">
              {cta.label}
            </Link>
            {secondary && (
              <Link href={secondary.href} className="btn btn-ghost">
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
