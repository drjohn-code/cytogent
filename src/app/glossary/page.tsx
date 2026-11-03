import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Container } from "@/components/ui/Section";
import { glossary } from "@/content/glossary";

export const metadata: Metadata = pageMetadata("/glossary");

export default function GlossaryPage() {
  const terms = [...glossary].sort((a, b) => a.term.localeCompare(b.term, "en-GB"));
  return (
    <>
      <PageHeader
        path="/glossary"
        eyebrow="Glossary"
        answer={<p>{terms.length} terms, each in a few sentences. Links go straight to a definition.</p>}
      />
      <Container className="py-16">
        <nav aria-label="Glossary index">
          <ul className="flex flex-wrap gap-2">
            {terms.map((t) => (
              <li key={t.slug}>
                <a
                  href={`#${t.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line px-3 font-mono text-xs text-muted hover:border-signal hover:text-text"
                >
                  {t.term}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <dl className="mt-14 max-w-[var(--measure)] divide-y divide-line border-y border-line">
          {terms.map((t) => (
            <div key={t.slug} id={t.slug} className="scroll-mt-28 py-6">
              <dt className="text-xl font-semibold">{t.term}</dt>
              <dd className="mt-2 text-muted">{t.definition}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-wrap gap-x-8">
          <ArrowLink href="/science">Read the science</ArrowLink>
          <ArrowLink href="/faq">Questions and answers</ArrowLink>
        </div>
      </Container>
    </>
  );
}
