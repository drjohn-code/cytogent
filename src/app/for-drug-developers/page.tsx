import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { DesignPrinciples } from "@/components/content/DesignPrinciples";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Chips, Section, SectionHeader } from "@/components/ui/Section";
import { PlatePlanHud } from "@/components/visuals/PlatePlanHud";

export const metadata: Metadata = pageMetadata("/for-drug-developers");

const roles = [
  { role: "Asset team lead", need: "A defensible go, adjust or stop on a combination strategy, with the evidence behind it." },
  { role: "Translational scientist", need: "Experiments that test a biological hypothesis about resistance, not a screen for its own sake." },
  { role: "Portfolio and business development", need: "To know which signals reproduced before committing capital or a partnership." },
];

const path = [
  { step: "Share the question", body: "The candidate, the resistance context and the decision you face. No confidential structures or patient data at this stage." },
  { step: "Scope it together", body: "Which models, which readouts, what budget, and what result would change the decision." },
  { step: "Agree the pilot shape", body: "A bounded first wave with agreed deliverables and go/no-go criteria." },
];

export default function ForDrugDevelopersPage() {
  return (
    <>
      <PageHeader
        path="/for-drug-developers"
        eyebrow="For drug teams"
        answer={
          <p>
            When a programme meets resistance, the Monday-morning question is practical: which experiments get the next
            slot of lab time and the next vial of patient-derived material? Cytogent helps
            answer that, one bounded batch at a time.
          </p>
        }
        actions={
          <Link href="/contact?intent=pilot" className="btn btn-primary">
            Bring a resistance question
          </Link>
        }
      />

      <Section id="allocation">
        <SectionHeader id="allocation" eyebrow="The allocation problem" title="Everything competes for the same slots.">
          <p>
            Each choice below multiplies the others. The aim is not to test everything, but to test the few things that
            would change the decision.
          </p>
        </SectionHeader>
        <div className="mt-8">
          <Chips
            items={[
              "Partner drugs",
              "Doses and schedules",
              "Resistant models",
              "Matched parental controls",
              "Readouts",
              "Lab time",
              "Patient-derived material",
              "Budget",
            ]}
          />
        </div>
      </Section>

      <Section id="brief" className="border-t border-line">
        <SectionHeader id="brief" eyebrow="From question to plate" title="A decision brief becomes a plate plan.">
          <p>
            The workflow starts with the decision, not the data. The brief sets the question, the models and
            the budget; the plan is the small batch that best serves it, with controls built in.
          </p>
        </SectionHeader>
        <div className="mt-10">
          <PlatePlanHud />
        </div>
      </Section>

      <Section id="roles">
        <SectionHeader id="roles" eyebrow="Who it is for" title="Built around the people who make the call." />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {roles.map((r) => (
            <li key={r.role} className="glass p-6">
              <h3 className="text-xl font-semibold">{r.role}</h3>
              <p className="mt-2 text-muted">{r.need}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="principles" className="border-t border-line">
        <SectionHeader id="principles" eyebrow="Principles" title="What you can expect from the way we work." />
        <div className="mt-10">
          <DesignPrinciples />
        </div>
      </Section>

      <Section id="path">
        <SectionHeader id="path" eyebrow="Path to a pilot" title="Three conversations to a first wave." />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {path.map((p, i) => (
            <li key={p.step} className="rounded-[var(--radius-card)] border border-line p-6">
              <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-xl font-semibold">{p.step}</h3>
              <p className="mt-2 text-muted">{p.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-x-8">
          <ArrowLink href="/pilot-programme">The pilot structure</ArrowLink>
          <ArrowLink href="/science">The biology</ArrowLink>
          <ArrowLink href="/data-governance">Data governance</ArrowLink>
        </div>
      </Section>

      <CtaBand title="Bring a resistance question." cta={{ label: "Bring a resistance question", href: "/contact?intent=pilot" }}>
        We are ready to start pilots now. Please don’t send confidential chemical structures or patient data in a
        first message.
      </CtaBand>
    </>
  );
}
