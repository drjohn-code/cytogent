import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Section, SectionHeader } from "@/components/ui/Section";

export const metadata: Metadata = pageMetadata("/partners/laboratories");

const roles = [
  {
    role: "Execution",
    does: "Runs the chosen batch on authenticated models, to an agreed assay plan, and returns quality-checked readouts, negatives included.",
    why: "Each batch is small and has a stated purpose, so lab time goes to experiments with a reason.",
  },
  {
    role: "Independent validation",
    does: "Re-tests the most decision-relevant signals, out of batch or with an orthogonal readout, without seeing the expected answer.",
    why: "A finding is stronger once a second lab has seen it.",
  },
];

const steps = [
  "An introductory conversation about your models, assays and capacity.",
  "A look at model authentication, assay quality control and data handling.",
  "A small test batch to check fit on both sides.",
  "An agreement covering scope, data use and publication before project work starts.",
];

export default function LaboratoriesPage() {
  return (
    <>
      <PageHeader
        path="/partners/laboratories"
        eyebrow="For laboratory partners"
        answer={
          <p>
            We are looking for laboratories with authenticated cancer models and functional assays. Cytogent brings
            a defined question, a bounded batch and a clear plan; your lab brings the biology and the readout.
          </p>
        }
        actions={
          <Link href="/contact?intent=lab" className="btn btn-primary">
            Qualify as a lab partner
          </Link>
        }
      />

      <Section id="exchange">
        <SectionHeader id="exchange" eyebrow="The exchange" title="What we ask, and what we bring." />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="glass p-6">
            <h3 className="text-xl font-semibold">We ask for</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted marker:text-signal">
              <li>Authenticated, documented models, ideally with resistant and matched parental pairs.</li>
              <li>Assays with quality control you can describe.</li>
              <li>Readouts returned in full, including results that did not work.</li>
            </ul>
          </div>
          <div className="glass p-6">
            <h3 className="text-xl font-semibold">We bring</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted marker:text-signal">
              <li>Questions with a purpose, not open-ended screens.</li>
              <li>Work scoped in advance, on agreed terms.</li>
              <li>Clear terms on data, credit and publication.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="roles" className="border-t border-line">
        <SectionHeader id="roles" eyebrow="Two roles" title="Execution and validation stay separate.">
          <p>The lab that runs a batch is not the lab that confirms it. That separation is part of the design.</p>
        </SectionHeader>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {roles.map((r) => (
            <div key={r.role} className="glass p-6">
              <h3 className="text-xl font-semibold">{r.role}</h3>
              <p className="mt-3">{r.does}</p>
              <p className="mt-3 text-muted">{r.why}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="qualify">
        <SectionHeader id="qualify" eyebrow="Qualification" title="Four steps before project work.">
          <p>How we qualify laboratory partners.</p>
        </SectionHeader>
        <ol className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s} className="rounded-[var(--radius-card)] border border-line p-5">
              <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2">{s}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-x-8">
          <ArrowLink href="/science">The science</ArrowLink>
          <ArrowLink href="/data-governance">Data governance</ArrowLink>
          <ArrowLink href="/partners/biobanks">For biobanks</ArrowLink>
        </div>
      </Section>

      <CtaBand title="Qualify as a lab partner." cta={{ label: "Qualify as a lab partner", href: "/contact?intent=lab" }}>
        Tell us about your models, assays and capacity. Please don’t send patient-identifiable data.
      </CtaBand>
    </>
  );
}
