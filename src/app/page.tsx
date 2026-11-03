import type { Metadata } from "next";
import Link from "next/link";
import { DesignPrinciples } from "@/components/content/DesignPrinciples";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { LoopTimeline } from "@/components/loop/LoopTimeline";
import { CtaBand } from "@/components/ui/CtaBand";
import { ArrowLink, Container, Section, SectionHeader } from "@/components/ui/Section";
import { UncertaintyMap } from "@/components/visuals/UncertaintyMap";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, route } from "@/content/routes";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata("/");

const bottleneck = [
  { title: "Too many drug pairs", body: "Partners, doses and schedules multiply faster than any lab can test them." },
  { title: "Too little lab time", body: "Every functional assay costs weeks and budget." },
  { title: "Too few living samples", body: "Patient-derived models are scarce and precious." },
];

const pathways = [
  { title: "Drug teams", body: "Bring a resistance question and scope a pilot.", href: "/for-drug-developers", cta: "For drug teams" },
  { title: "Labs and biobanks", body: "Help run and confirm the experiments that matter.", href: "/partners", cta: "Explore a collaboration" },
  { title: "Everyone else", body: "Why a cancer drug can stop working, in plain words.", href: "/for-people", cta: "Read the explainer" },
];

export default function Home() {
  return (
    <>
      <PageJsonLd path="/" />
      {/* 1. Hero */}
      <section aria-labelledby="hero-title" className="relative flex min-h-[92svh] items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25 [mask-image:radial-gradient(ellipse_at_70%_45%,black,transparent_70%)]"
        />
        <Container className="relative grid gap-12 py-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="eyebrow">Experimental intelligence // Decision-as-a-Service</p>
            <h1 id="hero-title" className="mt-5 text-4xl font-semibold sm:text-6xl lg:text-[3.6rem] xl:text-[4rem]">
              {route("/").heading}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Cytogent is building a closed-loop service so drug teams can prioritise combination experiments, test
              them with laboratory partners, and update plans from biological outcomes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={site.primaryCta.href} className="btn btn-primary">
                {site.primaryCta.label}
              </Link>
              <Link href="/platform" className="btn btn-ghost">
                See how the loop works
              </Link>
            </div>
            <p className="mt-8 font-mono text-sm text-muted">{site.brandLine}</p>
          </div>
          <figure>
            <HeroVisual />
            <figcaption className="mt-2 text-sm text-muted">
              Conceptual illustration: cells regrouped into the wells of a plate. Not patient or experimental data.
            </figcaption>
          </figure>
        </Container>
      </section>

      {/* 2. Credential strip: omitted until a credential is verified (BRIEF §7.2). */}

      {/* 3. Bottleneck */}
      <Section id="bottleneck" className="border-t border-line">
        <SectionHeader id="bottleneck" eyebrow="The bottleneck" title="Resistance writes its own rules.">
          <p>
            After targeted therapy, tumours with the same starting mutation can escape in different ways. The hard part
            is choosing which experiments to run.
          </p>
        </SectionHeader>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {bottleneck.map((b) => (
            <li key={b.title} className="glass p-6">
              <h3 className="text-xl font-semibold">{b.title}</h3>
              <p className="mt-2 text-muted">{b.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 4. What we are building */}
      <Section id="building">
        <SectionHeader id="building" eyebrow="What we are building" title="From hypothesis noise to a ranked batch.">
          <p>
            Sequencing lists what changed in a tumour. It does not, by itself, show how adapted living cells respond to
            two drugs together. We are building a way to connect both, so each batch is chosen for what it can teach.
          </p>
        </SectionHeader>
        <div className="mt-6">
          <ArrowLink href="/science">Read the science</ArrowLink>
        </div>
      </Section>

      {/* 5. Loop */}
      <Section id="loop" className="border-t border-line">
        <SectionHeader id="loop" eyebrow="The intended loop" title="One loop. Six decisions." />
        <LoopTimeline />
        <p className="mt-10 max-w-2xl text-muted">
          The report communicates evidence. The loop is the product being built.{" "}
          <Link href="/platform" className="text-signal underline underline-offset-4">
            How the loop works
          </Link>
        </p>
      </Section>

      {/* 6. Standard of proof */}
      <Section id="proof">
        <SectionHeader id="proof" eyebrow="Standard of proof" title="Predictions are hypotheses. Experiments are the verdict.">
          <p>
            A ranking is a reason to run an experiment, not a result. Uncertainty, including the choice to abstain,
            should be visible. Independent confirmation is a design goal.
          </p>
        </SectionHeader>
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          <UncertaintyMap />
          <DesignPrinciples compact />
        </div>
        <div className="mt-6">
          <ArrowLink href="/pilot-programme">See the proposed pilot structure</ArrowLink>
        </div>
      </Section>

      {/* 7. Three pathways */}
      <Section id="pathways" className="border-t border-line">
        <SectionHeader id="pathways" eyebrow="Where to start" title="Three ways in." />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {pathways.map((p) => (
            <li key={p.href} className="glass flex flex-col p-6">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 flex-1 text-muted">{p.body}</p>
              <div className="mt-4">
                <ArrowLink href={p.href}>{p.cta}</ArrowLink>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-muted">
          Investing in the space?{" "}
          <Link href="/investors" className="text-signal underline underline-offset-4">
            Read the investor view
          </Link>
        </p>
      </Section>

      {/* 8. Beachhead */}
      <Section id="beachhead">
        <div className="glass grid gap-6 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="eyebrow">Starting focus</p>
            <h2 id="beachhead-title" className="mt-3 text-3xl font-semibold sm:text-4xl">
              One candidate. One resistance context. One measurable decision.
            </h2>
            <p className="mt-5 text-lg text-muted">
              Our inaugural programme blueprint: combination selection in EGFR-mutant lung adenocarcinoma after
              osimertinib resistance.
            </p>
          </div>
          <div className="space-y-4">
            <p className="inline-flex rounded-full border border-alert/60 px-3 py-1.5 font-mono text-xs text-alert">
              Starting R&amp;D focus. Not intended as a clinical diagnostic.
            </p>
            <div>
              <ArrowLink href="/pilot-programme">How a pilot would run</ArrowLink>
            </div>
          </div>
        </div>
      </Section>

      {/* 9. Insights teaser: omitted until a note is published (BRIEF §7.9). */}

      {/* 10. Close */}
      <CtaBand title="Bring us a real resistance question." cta={site.primaryCta}>
        We are scoping pilot conversations with oncology asset teams and model laboratories.
      </CtaBand>
    </>
  );
}
