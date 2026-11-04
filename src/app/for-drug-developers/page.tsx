import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { DesignPrinciples } from "@/components/content/DesignPrinciples";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Chips, Section, SectionHeader } from "@/components/ui/Section";
import { PlatePlanHud } from "@/components/visuals/PlatePlanHud";
import { FeatureCard, toneAt } from "@/components/ui/FeatureCard";
import type { IconName } from "@/components/ui/Icon";

export const metadata: Metadata = pageMetadata("/for-drug-developers");

const roles: { role: string; need: string; icon: IconName }[] = [
  { role: "Asset team lead", icon: "compass", need: "A defensible go, adjust or stop on a combination strategy, with the evidence behind it." },
  { role: "Translational scientist", icon: "microscope", need: "Experiments that test a biological hypothesis about resistance, not a screen for its own sake." },
  { role: "Portfolio and business development", icon: "pie", need: "To know which signals reproduced before committing capital or a partnership." },
];

const path: { step: string; body: string; icon: IconName }[] = [
  { step: "Share the question", icon: "chat", body: "The candidate, the resistance context and the decision you face. No confidential structures or patient data at this stage." },
  { step: "Scope it together", icon: "scope", body: "Which models, which readouts, what budget, and what result would change the decision." },
  { step: "Agree the pilot shape", icon: "contract", body: "A bounded first wave with agreed deliverables and go/no-go criteria." },
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
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {roles.map((r, i) => (
            <FeatureCard key={r.role} icon={r.icon} tone={toneAt(i)} title={r.role} titleClassName="text-xl font-semibold">
              <p className="mt-2 text-muted">{r.need}</p>
            </FeatureCard>
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
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {path.map((p, i) => (
            <FeatureCard key={p.step} icon={p.icon} tone={toneAt(i)} kicker={String(i + 1).padStart(2, "0")} title={p.step} titleClassName="text-xl font-semibold">
              <p className="mt-2 text-muted">{p.body}</p>
            </FeatureCard>
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
