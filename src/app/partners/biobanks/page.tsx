import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Section, SectionHeader } from "@/components/ui/Section";
import { SampleLineage } from "@/components/visuals/SampleLineage";
import { FeatureCard, toneAt } from "@/components/ui/FeatureCard";
import type { IconName } from "@/components/ui/Icon";

export const metadata: Metadata = pageMetadata("/partners/biobanks");

const commitments: { title: string; body: string; icon: IconName }[] = [
  { title: "Ethics and consent first", icon: "consent", body: "Work only within the consent, ethics approval and usage rights attached to each sample." },
  { title: "No patient-identifiable data here", icon: "userOff", body: "Nothing on this website collects or shows patient-identifiable data, and we ask you not to send any through it." },
  { title: "No automatic pooling", icon: "separate", body: "Our policy: data from one collaboration is not pooled with another client’s data unless all parties agree." },
];

export default function BiobanksPage() {
  return (
    <>
      <PageHeader
        path="/partners/biobanks"
        eyebrow="For biobanks"
        answer={
          <p>
            Donated samples are most useful when they answer a specific question. Cytogent matches consented
            material and patient-derived models with focused resistance questions, so each sample is used where it can
            teach the most.
          </p>
        }
        actions={
          <Link href="/contact?intent=collaboration" className="btn btn-primary">
            Explore a collaboration
          </Link>
        }
        aside={<SampleLineage />}
      />

      <Section id="context">
        <SectionHeader id="context" eyebrow="Why context matters" title="Before and after treatment.">
          <p>
            Resistance is a change over time. Samples or models with longitudinal context, from before treatment and
            after resistance appears, are what let a resistant model be compared with its matched starting point.
          </p>
        </SectionHeader>
      </Section>

      <Section id="commitments" className="border-t border-line">
        <SectionHeader id="commitments" eyebrow="How we work" title="Governance before data." />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {commitments.map((c, i) => (
            <FeatureCard key={c.title} icon={c.icon} tone={toneAt(i)} title={c.title} titleClassName="text-lg font-semibold">
              <p className="mt-2 text-muted">{c.body}</p>
            </FeatureCard>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-x-8">
          <ArrowLink href="/data-governance">Data governance</ArrowLink>
          <ArrowLink href="/for-people">Why donated samples matter</ArrowLink>
          <ArrowLink href="/partners/laboratories">For laboratories</ArrowLink>
        </div>
      </Section>

      <CtaBand title="Explore a collaboration." cta={{ label: "Explore a collaboration", href: "/contact?intent=collaboration" }}>
        Tell us what kinds of material and context you hold. Please don’t send patient-identifiable data.
      </CtaBand>
    </>
  );
}
