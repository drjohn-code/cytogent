import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { Cite, Sources } from "@/components/content/Sources";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Container, Section, SectionHeader } from "@/components/ui/Section";
import { EscapeRoutes } from "@/components/visuals/EscapeRoutes";

export const metadata: Metadata = pageMetadata("/science");

// Citation numbers follow this order.
const SOURCES = ["REF-01", "REF-02", "REF-03", "REF-05", "REF-06", "REF-08", "REF-09"];

const routes = [
  {
    title: "On-target",
    body: "The drug’s target changes. New mutations in EGFR itself, such as C797S, can stop osimertinib from binding.",
  },
  {
    title: "Bypass",
    body: "Another growth signal takes over, for example through MET or HER2 amplification, so blocking EGFR is no longer enough.",
  },
  {
    title: "Histologic or cell-state shift",
    body: "The tumour changes its type, for example towards small-cell histology, and no longer depends on EGFR.",
  },
];

const signals = [
  {
    name: "Combination benefit",
    compares: "The pair against each drug alone, in the same model",
    tells: "Whether two drugs together do more than either alone in that model. Not what happens in a patient.",
  },
  {
    name: "Resistance-associated differential activity",
    compares: "The resistant model against its matched parental model",
    tells: "Whether a combination hits what resistance changed. Only as good as the match between the two models.",
  },
  {
    name: "Clinical therapeutic window",
    compares: "Needs in vivo pharmacology and toxicology",
    tells: "Whether an effective exposure could be tolerated. A parental cancer line is not a healthy-tissue safety proxy.",
  },
];

export default function SciencePage() {
  return (
    <>
      <PageHeader
        path="/science"
        eyebrow="The biology"
        answer={
          <>
            <p>
              Tumours that start with the same EGFR mutation can stop responding to osimertinib for different reasons
              <Cite n={1} />. A genetic profile shows what changed. A functional assay on living cells shows how they
              now respond. Cytogent’s work starts from that gap.
            </p>
          </>
        }
        aside={<EscapeRoutes />}
      />

      <Section id="routes">
        <SectionHeader id="routes" eyebrow="Escape routes" title="Three broad ways a tumour escapes.">
          <p>
            Drug resistance is when cancer cells stop responding to a drug that used to work
            <Cite n={3} />. After osimertinib, the routes reported in the literature fall into three broad groups.
            Tumours can combine them, and in a share of cases no mechanism is found
            <Cite n={1} />.
          </p>
        </SectionHeader>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {routes.map((r, i) => (
            <li key={r.title} className="glass p-6">
              <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-xl font-semibold">{r.title}</h3>
              <p className="mt-2 text-muted">
                {r.body}
                <Cite n={1} />
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="lab" className="border-t border-line">
        <SectionHeader id="lab" eyebrow="Why the lab still decides" title="A profile is a map. An assay is a test drive.">
          <p>
            Sequencing catalogues mutations, but it does not by itself tell you how adapted living cells will respond to
            two drugs together. Patient-derived models such as organoids can keep features of the tumour they came from
            and can be used for drug testing
            <Cite n={4} />, and open catalogues help researchers find them
            <Cite n={5} />.
          </p>
          <p>
            These models are scarce, so each experiment has to count. Choosing the experiments expected to teach the
            most is an active-learning problem
            <Cite n={6} />, and the readouts are only useful if the assays are well designed and quality-checked
            <Cite n={7} />.
          </p>
        </SectionHeader>
      </Section>

      <Section id="focus">
        <SectionHeader id="focus" eyebrow="Starting focus" title="Why start after osimertinib.">
          <p>
            Osimertinib is a standard treatment option for advanced EGFR-mutant non-small cell lung cancer
            <Cite n={2} />, and resistance to it is a well-described, varied problem
            <Cite n={1} />. That makes it a sharp place to test whether better experiment choice changes decisions.
          </p>
          <p>
            Our inaugural programme blueprint is combination experiment selection in this setting. It is a starting
            R&amp;D focus, not a treated patient population, and not intended for choosing treatment for any individual.
          </p>
        </SectionHeader>
      </Section>

      <Section id="signals" className="border-t border-line">
        <SectionHeader id="signals" eyebrow="What a pilot would measure" title="Three signals, three different questions." />
        {/* Focusable so keyboard users can scroll the table sideways on narrow screens (axe: scrollable-region-focusable). */}
        <div className="mt-10 overflow-x-auto" tabIndex={0} role="region" aria-labelledby="signals-title">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">Three signals a pilot would measure, what each compares, and what it can tell you</caption>
            <thead>
              <tr className="border-b border-line-strong font-mono text-xs uppercase tracking-[0.1em] text-muted">
                <th scope="col" className="py-3 pr-6 font-normal">Signal</th>
                <th scope="col" className="py-3 pr-6 font-normal">Compares</th>
                <th scope="col" className="py-3 font-normal">What it can tell you</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((s) => (
                <tr key={s.name} className="border-b border-line align-top">
                  <th scope="row" className="py-5 pr-6 font-semibold">
                    {s.name}
                  </th>
                  <td className="py-5 pr-6 text-muted">{s.compares}</td>
                  <td className="py-5 text-muted">{s.tells}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-muted">
          Unfamiliar terms? <Link href="/glossary" className="text-signal underline underline-offset-4">See the glossary</Link>.
        </p>
      </Section>

      <Container className="py-16">
        <div className="max-w-4xl">
          <Sources ids={SOURCES} />
        </div>
        <div className="mt-8">
          <ArrowLink href="/platform">How the loop uses these signals</ArrowLink>
        </div>
      </Container>

      <CtaBand
        title="See how a pilot would be structured."
        cta={{ label: "Explore the pilot structure", href: "/pilot-programme" }}
        secondary={{ label: "For drug teams", href: "/for-drug-developers" }}
      >
        One candidate, one resistance context, one decision.
      </CtaBand>
    </>
  );
}
