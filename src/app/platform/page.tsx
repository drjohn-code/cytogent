import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { DesignPrinciples } from "@/components/content/DesignPrinciples";
import { NotCards } from "@/components/content/NotCards";
import { ProgrammeStory } from "@/components/loop/ProgrammeStory";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Chips, Section, SectionHeader } from "@/components/ui/Section";
import { UncertaintyMap } from "@/components/visuals/UncertaintyMap";
import { FeatureCard } from "@/components/ui/FeatureCard";
import type { IconName, Tone } from "@/components/ui/Icon";

export const metadata: Metadata = pageMetadata("/platform");

const decisions: { q: string; a: string; icon: IconName; tone: Tone }[] = [
  { q: "What to test next", icon: "ranked", tone: "signal", a: "A ranked, feasible batch of combination experiments, each with its reason." },
  { q: "What reproduced", icon: "checkCircle", tone: "actin", a: "Which signals held up when tested again, out of batch or with another readout." },
  { q: "What to stop", icon: "stop", tone: "alert", a: "Which lines of work the evidence no longer supports, so budget moves elsewhere." },
  { q: "Where to commit capital", icon: "flag", tone: "dose", a: "A plain-language summary a programme team can take to its decision meeting." },
];

export default function PlatformPage() {
  return (
    <>
      <PageHeader
        path="/platform"
        eyebrow="Decision-as-a-Service"
        answer={
          <>
            <p>
              Cytogent provides Decision-as-a-Service: a managed scientific workflow that helps oncology drug teams
              choose the next combination experiment, run it with laboratory partners, and update the plan from what
              the cells actually did.
            </p>
            <p>It is not a self-serve dashboard, a chatbot, a generic CRO or a static PDF.</p>
          </>
        }
        actions={
          <Link href="/contact?intent=pilot" className="btn btn-primary">
            Scope a pilot
          </Link>
        }
        aside={
          <div className="glass p-6">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-signal">Deliverables per wave</p>
            <div className="mt-4">
              <Chips items={["Decision brief", "Ranked batch", "Uncertainty map", "QC'd readouts", "Audit trail"]} />
            </div>
          </div>
        }
      />

      <Section id="loop">
        <SectionHeader id="loop" eyebrow="The loop" title="Six steps, repeated in waves.">
          <p>Each wave is small on purpose. What one wave learns shapes the next.</p>
        </SectionHeader>
        <ProgrammeStory />
      </Section>

      <Section id="decisions" className="border-t border-line">
        <SectionHeader id="decisions" eyebrow="Outputs" title="Four decisions it informs." />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {decisions.map((d) => (
            <FeatureCard key={d.q} icon={d.icon} tone={d.tone} title={d.q} titleClassName="text-xl font-semibold">
              <p className="mt-2 text-muted">{d.a}</p>
            </FeatureCard>
          ))}
        </ul>
      </Section>

      <Section id="uncertainty">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeader id="uncertainty" eyebrow="Uncertainty" title="A ranking should show what it doesn’t know.">
            <p>
              Each ranked experiment carries an uncertainty estimate. Where the evidence is too thin, the
              right output is to abstain, or to propose an experiment that would reduce the uncertainty.
            </p>
            <p>Calibration of those estimates is a validation objective: something to show, not assume.</p>
          </SectionHeader>
          <UncertaintyMap />
        </div>
      </Section>

      <Section id="principles" className="border-t border-line">
        <SectionHeader id="principles" eyebrow="Principles" title="How we operate." />
        <div className="mt-10">
          <DesignPrinciples />
        </div>
        <div className="mt-6">
          <ArrowLink href="/data-governance">How project data is kept apart</ArrowLink>
        </div>
      </Section>

      <Section id="not">
        <SectionHeader id="not" eyebrow="Boundaries" title="What Cytogent is not.">
          <p>These describe its intended use, not a regulatory classification.</p>
        </SectionHeader>
        <div className="mt-10">
          <NotCards />
        </div>
        <div className="mt-6 flex flex-wrap gap-x-8">
          <ArrowLink href="/science">The biology behind the loop</ArrowLink>
          <ArrowLink href="/for-drug-developers">For drug teams</ArrowLink>
        </div>
      </Section>

      <CtaBand
        title="Scope a pilot around one decision."
        cta={{ label: "Scope a pilot", href: "/contact?intent=pilot" }}
        secondary={{ label: "See the pilot structure", href: "/pilot-programme" }}
      >
        Tell us the candidate, the resistance context and the decision you need to make.
      </CtaBand>
    </>
  );
}
