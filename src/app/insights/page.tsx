import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Container } from "@/components/ui/Section";

// Lists published notes only (BRIEF §5, §9). None are published yet, so this is the empty state.
export const metadata: Metadata = pageMetadata("/insights");

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        path="/insights"
        eyebrow="Insights"
        answer={
          <p>
            We are writing short notes on resistance biology, experiment selection and what counts as evidence. Each
            one is reviewed before it is published, and none have cleared review yet.
          </p>
        }
      />
      <Container className="py-16">
        <p className="text-muted">In the meantime:</p>
        <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:gap-8">
          <ArrowLink href="/science">The science</ArrowLink>
          <ArrowLink href="/glossary">The glossary</ArrowLink>
          <ArrowLink href="/for-people">Resistance in plain words</ArrowLink>
        </div>
      </Container>
    </>
  );
}
