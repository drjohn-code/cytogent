import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DesignPrinciples } from "@/components/content/DesignPrinciples";
import { ColourLens } from "@/components/hero/ColourLens";
import { ProgrammeStory } from "@/components/loop/ProgrammeStory";
import { PageJsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/ui/CtaBand";
import { ImageBand } from "@/components/ui/ImageBand";
import { ArrowLink, Container, Section, SectionHeader } from "@/components/ui/Section";
import { Marquee } from "@/components/ui/Marquee";
import { Statement } from "@/components/ui/Statement";
import { BottleneckData } from "@/components/visuals/BottleneckData";
import { CombinationWells } from "@/components/visuals/CombinationWells";
import { RankedBatch } from "@/components/visuals/RankedBatch";
import { TissueCores } from "@/components/visuals/TissueCores";
import { VariantTrack } from "@/components/visuals/VariantTrack";
import { credentials, isPublic } from "@/content/credentials";
import { pageMetadata, route } from "@/content/routes";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata("/");

const bottleneck = [
  { data: "pairs" as const, title: "Too many drug pairs", body: "Partners, doses and schedules multiply faster than any lab can test them." },
  { data: "time" as const, title: "Too little lab time", body: "Every functional assay costs weeks and budget." },
  { data: "samples" as const, title: "Too few living samples", body: "Patient-derived models are scarce and precious." },
];

const pathways = [
  { image: "team-data", title: "Drug teams", body: "Bring a resistance question and scope a pilot.", href: "/for-drug-developers", cta: "For drug teams" },
  { image: "lab-automation", title: "Labs and biobanks", body: "Help run and confirm the experiments that matter.", href: "/partners", cta: "Explore a collaboration" },
  { image: "sem-tcell-attack", title: "Everyone else", body: "Why a cancer drug can stop working, in plain words.", href: "/for-people", cta: "Read the explainer" },
];

export default function Home() {
  return (
    <>
      <PageJsonLd path="/" />
      {/* 1. Hero: a colourised electron micrograph, revealed by a lens that follows the pointer */}
      <section aria-labelledby="hero-title" className="relative isolate flex min-h-[calc(100svh-var(--header-h))] flex-col justify-end overflow-hidden">
        <ColourLens src="/images/gen/hero-cancer-cell.webp" priority />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--canvas)_8%,color-mix(in_srgb,var(--canvas)_70%,transparent)_42%,transparent_70%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(0deg,var(--canvas),transparent)]" />
        <Container className="relative pt-24 pb-12 sm:pb-16">
          <div className="max-w-3xl">
            <p className="eyebrow">Decision-as-a-Service</p>
            <h1 id="hero-title" className="mt-6 text-[2.75rem] sm:text-6xl lg:text-[5rem] xl:text-[5.6rem]">
              {route("/").heading}
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted">
              Cytogent has built a closed-loop service so drug teams can prioritise combination experiments, test them
              with laboratory partners, and update plans from biological outcomes.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href={site.primaryCta.href} className="btn btn-primary">
                {site.primaryCta.label}
              </Link>
              <Link href="/platform" className="btn btn-ghost backdrop-blur-sm">
                See how the loop works
              </Link>
            </div>
            {isPublic(credentials.nvidiaInception) && (
              /* eslint-disable-next-line @next/next/no-img-element -- small static SVG badge */
              <img src="/brand/partners/nvidia-inception-on-dark.svg" alt={credentials.nvidiaInception.value} width={185} height={80} className="mt-10 h-14 w-auto" />
            )}
          </div>
        </Container>
        <div className="relative">
          <Marquee
            items={[
              "Patient-derived organoids",
              "Multiplex imaging",
              "Combination ranking",
              "Visible uncertainty",
              "Independent confirmation",
              "EGFR-mutant lung cancer",
              "Laboratory partners",
              "Decision briefs",
            ]}
          />
        </div>
      </section>

      <Statement
        id="thesis"
        text="Sequencing reads what changed in a tumour. Only living cells show what two drugs do together. Cytogent connects both."
      />

      {/* 2. Bottleneck */}
      <Section id="bottleneck" className="border-t border-line">
        <SectionHeader id="bottleneck" eyebrow="The bottleneck" title="Resistance writes its own rules.">
          <p>
            After targeted therapy, tumours with the same starting mutation can escape in different ways. The hard part
            is choosing which experiments to run.
          </p>
        </SectionHeader>
        <div className="mt-16 mb-20">
          <TissueCores />
        </div>
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-3">
          {bottleneck.map((b) => (
            <li key={b.title} data-spot className="flex flex-col bg-canvas p-8">
              <div className="flex h-36 items-center">
                <BottleneckData kind={b.data} />
              </div>
              <h3 className="mt-8 text-xl font-normal">{b.title}</h3>
              <p className="mt-2 text-muted">{b.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <ImageBand id="bypass" src="/images/gen/sem-drug-response.webp" eyebrow="Combination" title="The right pair takes resistant cells out." align="right" />

      {/* 3. What we have built */}
      <Section id="building">
        <SectionHeader id="building" eyebrow="What we have built" title="From hypothesis noise to a ranked batch.">
          <p>Each batch is chosen for what it can teach, from the mutation to the living response.</p>
        </SectionHeader>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line lg:grid-cols-3">
          <li data-spot className="flex flex-col bg-canvas">
            <div className="h-64 border-b border-line px-6 pt-6 pb-2">
              <VariantTrack />
            </div>
            <div className="p-8">
              <p className="font-mono text-xs text-alert">01 · Genome</p>
              <h3 className="mt-2 text-xl font-normal">What changed</h3>
              <p className="mt-2 text-muted">A mutation in the drug&rsquo;s target, read from the tumour&rsquo;s DNA.</p>
            </div>
          </li>
          <li data-spot className="flex flex-col bg-canvas">
            <div className="relative h-64 overflow-hidden border-b border-line">
              <Image src="/images/gen/tem-cancer-cell.webp" alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="drift object-cover" />
            </div>
            <div className="p-8">
              <p className="font-mono text-xs text-shift">02 · Cell</p>
              <h3 className="mt-2 text-xl font-normal">Where it acts</h3>
              <p className="mt-2 text-muted">Inside the cancer cell, where the drug meets its target and signals reroute.</p>
            </div>
          </li>
          <li data-spot className="flex flex-col bg-canvas">
            <div className="relative h-64 overflow-hidden border-b border-line">
              <Image src="/images/gen/sem-organoid.webp" alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="drift object-cover" />
            </div>
            <div className="p-8">
              <p className="font-mono text-xs text-actin">03 · Living model</p>
              <h3 className="mt-2 text-xl font-normal">What cells do</h3>
              <p className="mt-2 text-muted">A patient-derived organoid under two drugs at once: the answer only an experiment gives.</p>
            </div>
          </li>
        </ol>
        <div className="mt-6">
          <ArrowLink href="/science">Read the science</ArrowLink>
        </div>
      </Section>

      {/* 4. Living cells decide */}
      <Section id="wells" className="border-t border-line">
        <SectionHeader id="wells" eyebrow="The verdict" title="Living cells decide.">
          <p>One drug leaves resistant cells behind. The right partner takes them out.</p>
        </SectionHeader>
        <div className="mt-12">
          <CombinationWells />
        </div>
      </Section>

      {/* 5. The loop, as the product at work */}
      <Section id="loop" className="border-t border-line">
        <SectionHeader id="loop" eyebrow="The loop" title="One question, through six decisions." />
        <ProgrammeStory />
        <div className="mt-8">
          <ArrowLink href="/platform">How the loop works</ArrowLink>
        </div>
      </Section>

      {/* 6. Standard of proof */}
      <Section id="proof" className="border-t border-line">
        <SectionHeader id="proof" eyebrow="Standard of proof" title="Predictions are hypotheses. Experiments are the verdict.">
          <p>A ranking is a reason to run an experiment, not a result. Key findings are re-tested before they count.</p>
        </SectionHeader>
        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
          <RankedBatch />
          <DesignPrinciples compact />
        </div>
      </Section>

      {/* 7. Three pathways */}
      <Section id="pathways" className="border-t border-line">
        <SectionHeader id="pathways" eyebrow="Where to start" title="Three ways in." />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {pathways.map((p) => (
            <li key={p.href} className="group flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-line">
                <Image src={`/images/gen/${p.image}.webp`} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 className="mt-6 text-2xl font-light">{p.title}</h3>
              <p className="mt-2 flex-1 text-muted">{p.body}</p>
              <div className="mt-3">
                <ArrowLink href={p.href}>{p.cta}</ArrowLink>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-muted">
          Investing in the space?{" "}
          <Link href="/investors" className="text-signal underline underline-offset-4">
            Read the investor view
          </Link>
        </p>
      </Section>

      {/* 8. Starting focus */}
      <Section id="beachhead" className="border-t border-line">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="eyebrow">Starting focus</p>
            <h2 id="beachhead-title" className="mt-4 text-4xl sm:text-5xl">
              One candidate. One resistance context. One measurable decision.
            </h2>
            <p className="mt-6 text-lg text-muted">
              Our inaugural programme blueprint: combination selection in EGFR-mutant lung adenocarcinoma after
              osimertinib resistance.
            </p>
            <div className="mt-6">
              <ArrowLink href="/pilot-programme">How a pilot runs</ArrowLink>
            </div>
          </div>
          <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-md">
            <Image src="/images/gen/tissue-core-d.webp" alt="" fill sizes="448px" className="core-turn object-contain" />
          </div>
        </div>
      </Section>

      <CtaBand title="Bring us a real resistance question." cta={site.primaryCta}>
        We are ready to start pilots with oncology asset teams and to partner with model laboratories.
      </CtaBand>
    </>
  );
}
