import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Section, SectionHeader } from "@/components/ui/Section";
import { DeliverableRail } from "@/components/visuals/DeliverableRail";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata("/pilot-programme");

const horizons = [
  { name: "One decision", body: "A single pilot wave on one candidate and one resistance question." },
  { name: "Repeated waves", body: "Further waves on the same programme, each shaped by what the last one learned." },
  { name: "More resistance contexts", body: "The same approach applied to other candidates or settings." },
  { name: "A learning layer", body: "Lessons carried across a sponsor’s own programmes, within that sponsor’s governance terms." },
];

export default function PilotProgrammePage() {
  return (
    <>
      <PageHeader
        path="/pilot-programme"
        eyebrow="Pilot programme"
        answer={
          <p>
            A pilot is the smallest useful test of the loop. It is designed around one candidate, one resistance
            context and one decision the sponsor needs to make. What follows is the proposed shape; the details are
            scoped with each sponsor.
          </p>
        }
        actions={
          <Link href={site.primaryCta.href} className="btn btn-primary">
            {site.primaryCta.label}
          </Link>
        }
      />

      <Section id="method">
        <SectionHeader id="method" eyebrow="Intended method" title="Write the decision down first.">
          <p>
            Before any experiment is chosen, the pilot records the decision it should inform and the go/no-go criteria.
            That keeps the batch small and the result readable, including when the answer is “stop”.
          </p>
        </SectionHeader>
      </Section>

      <Section id="deliverables" className="border-t border-line">
        <SectionHeader id="deliverables" eyebrow="Proposed pilot shape" title="Eight deliverables.">
          <p>This is the design we are working to. It is not a list of completed engagements.</p>
        </SectionHeader>
        <div className="mt-12">
          <DeliverableRail />
        </div>
      </Section>

      <Section id="horizons">
        <SectionHeader id="horizons" eyebrow="If it works" title="Four possible horizons.">
          <p>An earned path, not a promise. Each step only makes sense if the one before it was worth it.</p>
        </SectionHeader>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {horizons.map((h, i) => (
            <li key={h.name} className="glass p-6">
              <span className="font-mono text-xs text-signal">H{i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{h.name}</h3>
              <p className="mt-2 text-muted">{h.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-2xl text-muted">
          Scope and cost are agreed per pilot. Laboratory work runs with qualified partners; Cytogent is not a
          competing wet lab.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-8">
          <ArrowLink href="/platform">How the loop works</ArrowLink>
          <ArrowLink href="/partners/laboratories">For laboratory partners</ArrowLink>
          <ArrowLink href="/faq">Questions</ArrowLink>
        </div>
      </Section>

      <CtaBand title="Discuss a pilot programme." cta={site.primaryCta} secondary={{ label: "For drug teams", href: "/for-drug-developers" }}>
        Start with the candidate, the resistance context and the decision you need to make.
      </CtaBand>
    </>
  );
}
