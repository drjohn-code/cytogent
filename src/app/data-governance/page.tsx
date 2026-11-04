import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Section, SectionHeader } from "@/components/ui/Section";
import { SiloedVaults } from "@/components/visuals/SiloedVaults";
import { FeatureCard, toneAt } from "@/components/ui/FeatureCard";
import type { IconName } from "@/components/ui/Icon";

export const metadata: Metadata = pageMetadata("/data-governance");

const aims: { title: string; body: string; icon: IconName }[] = [
  { title: "Project-level isolation", icon: "vault", body: "Each sponsor’s data sits in its own project and is used only for that project, unless every party agrees otherwise." },
  { title: "Permission gates", icon: "key", body: "Data moves into the loop, or out to a partner, only through an explicit, recorded permission." },
  { title: "Audit lineage", icon: "lineage", body: "Every recommendation is traceable to the data, model version and decisions behind it." },
  { title: "Research use", icon: "microscope", body: "Intended as decision support for preclinical and translational research, not for clinical care." },
];

export default function DataGovernancePage() {
  return (
    <>
      <PageHeader
        path="/data-governance"
        eyebrow="Data governance"
        answer={
          <>
            <p>
              Sponsors, laboratories and biobanks will only share data if they trust where it goes. This page describes
              how each project’s data is kept separate. It is not a certification: independent assessments will be listed
              here when they are completed.
            </p>
          </>
        }
        actions={
          <Link href="/contact?intent=general" className="btn btn-primary">
            Ask about governance
          </Link>
        }
        aside={<SiloedVaults />}
      />

      <Section id="aims">
        <SectionHeader id="aims" eyebrow="Design" title="Four commitments." />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {aims.map((a, i) => (
            <FeatureCard key={a.title} icon={a.icon} tone={toneAt(i)} title={a.title} titleClassName="text-lg font-semibold">
              <p className="mt-2 text-muted">{a.body}</p>
            </FeatureCard>
          ))}
        </ul>
      </Section>

      <Section id="website" className="border-t border-line">
        <SectionHeader id="website" eyebrow="This website" title="No patient data here.">
          <p>
            This website does not collect patient data, and it has no forms. Please do not email us patient-identifiable
            health data or confidential chemical structures. Project data is handled only under a written agreement.
          </p>
        </SectionHeader>
        <div className="mt-6 flex flex-wrap gap-x-8">
          <ArrowLink href="/privacy">Privacy notice</ArrowLink>
          <ArrowLink href="/partners/biobanks">For biobanks</ArrowLink>
          <ArrowLink href="/platform">How the loop works</ArrowLink>
        </div>
      </Section>

      <CtaBand title="Ask about governance." cta={{ label: "Ask about governance", href: "/contact?intent=general" }}>
        If governance is the question that decides whether you can work with us, ask it first.
      </CtaBand>
    </>
  );
}
