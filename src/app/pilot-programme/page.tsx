import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Section, SectionHeader } from "@/components/ui/Section";
import { DeliverableRail } from "@/components/visuals/DeliverableRail";
import { site } from "@/content/site";
import { FeatureCard, toneAt } from "@/components/ui/FeatureCard";
import type { IconName } from "@/components/ui/Icon";

export const metadata: Metadata = pageMetadata("/pilot-programme");

const horizons: { name: string; body: string; icon: IconName }[] = [
  { name: "One decision", icon: "target", body: "A single pilot wave on one candidate and one resistance question." },
  { name: "Repeated waves", icon: "repeat", body: "Further waves on the same programme, each shaped by what the last one learned." },
  { name: "More resistance contexts", icon: "branch", body: "The same approach applied to other candidates or settings." },
  { name: "A learning layer", icon: "layers", body: "Lessons carried across a sponsor’s own programmes, within that sponsor’s governance terms." },
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
            context and one decision the sponsor needs to make. What follows is the standard shape; the details are
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
        <SectionHeader id="method" eyebrow="Method" title="Write the decision down first.">
          <p>
            Before any experiment is chosen, the pilot records the decision it should inform and the go/no-go criteria.
            That keeps the batch small and the result readable, including when the answer is “stop”.
          </p>
        </SectionHeader>
      </Section>

      <Section id="deliverables" className="border-t border-line">
        <SectionHeader id="deliverables" eyebrow="Pilot shape" title="Eight deliverables.">
          <p>What every pilot includes.</p>
        </SectionHeader>
        <div className="mt-12">
          <DeliverableRail />
        </div>
      </Section>

      <Section id="horizons">
        <SectionHeader id="horizons" eyebrow="If it works" title="Four possible horizons.">
          <p>An earned path, not a promise. Each step only makes sense if the one before it was worth it.</p>
        </SectionHeader>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {horizons.map((h, i) => (
            <FeatureCard key={h.name} icon={h.icon} tone={toneAt(i)} kicker={`H${i + 1}`} title={h.name} titleClassName="text-lg font-semibold">
              <p className="mt-2 text-muted">{h.body}</p>
            </FeatureCard>
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
