import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Section, SectionHeader } from "@/components/ui/Section";
import { FeatureCard, toneAt } from "@/components/ui/FeatureCard";
import type { IconName } from "@/components/ui/Icon";

export const metadata: Metadata = pageMetadata("/investors");

const gates: { gate: string; aim: string; icon: IconName }[] = [
  { gate: "Buyer pull", icon: "magnet", aim: "Drug teams commit time and budget to a pilot question." },
  { gate: "Model access", icon: "cells", aim: "Reliable access to suitable resistant and matched parental models." },
  { gate: "Matched benchmark", icon: "compare", aim: "Loop-selected batches compared fairly with how the team would otherwise choose." },
  { gate: "Prospective economic proof", icon: "trend", aim: "Evidence, measured going forward, that better selection saves experiments or time." },
  { gate: "Cross-lab reproducibility", icon: "network", aim: "Key signals confirmed in an independent laboratory." },
  { gate: "Paid multi-wave", icon: "waves", aim: "A sponsor pays for repeated waves because the first was worth it." },
];

export default function InvestorsPage() {
  return (
    <>
      <PageHeader
        path="/investors"
        eyebrow="Investors"
        answer={
          <p>
            Cytogent has built the Experimental Intelligence Layer for oncology R&amp;D, delivered as
            Decision-as-a-Service. We are starting narrow on purpose: one resistance setting, one kind of decision, and
            clear gates that have to be passed before anything broader.
          </p>
        }
        actions={
          <Link href="/contact?intent=investor" className="btn btn-primary">
            Request the investor brief
          </Link>
        }
      />

      <Section id="wedge">
        <SectionHeader id="wedge" eyebrow="Why this beachhead" title="A proving ground, not a market claim.">
          <p>
            Resistance after osimertinib in EGFR-mutant lung cancer is well described, varied and actively studied.
            That makes it a demanding test: if better experiment selection changes decisions here, the result is hard
            to explain away.
          </p>
        </SectionHeader>
      </Section>

      <Section id="compounding" className="border-t border-line">
        <SectionHeader id="compounding" eyebrow="Compounding, by design" title="What should get better with each wave.">
          <p>
            The design aim is that each wave leaves something behind: longitudinal outcomes including negatives,
            confirmed findings, a sharper workflow and stronger lab partnerships, each kept within its sponsor’s
            governance terms.
          </p>
        </SectionHeader>
      </Section>

      <Section id="gates">
        <SectionHeader id="gates" eyebrow="Validation aims" title="Six gates.">
          <p>These are aims we will be measured against. None is presented here as achieved.</p>
        </SectionHeader>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gates.map((g, i) => (
            <FeatureCard
              key={g.gate}
              icon={g.icon}
              tone={toneAt(i)}
              title={g.gate}
              titleClassName="text-lg font-semibold"
              kicker={
                <span className="flex items-center gap-2">
                  <span className="text-signal">GATE {i + 1}</span>
                  <span className="rounded-full border border-line-strong px-2 py-0.5 text-[0.7rem]">AIM</span>
                </span>
              }
            >
              <p className="mt-2 text-muted">{g.aim}</p>
            </FeatureCard>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-x-8">
          <ArrowLink href="/platform">How the loop works</ArrowLink>
          <ArrowLink href="/pilot-programme">The pilot structure</ArrowLink>
          <ArrowLink href="/about">About Cytogent</ArrowLink>
        </div>
      </Section>

      <CtaBand title="Request the investor brief." cta={{ label: "Request the investor brief", href: "/contact?intent=investor" }}>
        We share the brief directly on request.
      </CtaBand>
    </>
  );
}
