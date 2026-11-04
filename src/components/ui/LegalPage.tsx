import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { Container } from "./Section";

/** Text-first layout for legal pages (BRIEF §6: legal pages are typography, not visuals). */
export function LegalPage({
  path,
  eyebrow,
  summary,
  children,
}: {
  path: string;
  eyebrow: string;
  summary: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader path={path} eyebrow={eyebrow} answer={summary} plain />
      <Container className="py-16">
        <div className="max-w-[var(--measure)] space-y-10 [&_a]:text-signal [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_li]:mt-2 [&_p]:mt-3 [&_p]:text-muted [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-muted">
          {children}
        </div>
      </Container>
    </>
  );
}
