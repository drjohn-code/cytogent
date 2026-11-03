import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Section, SectionHeader } from "@/components/ui/Section";
import { TrackArchitecture } from "@/components/visuals/TrackArchitecture";

export const metadata: Metadata = pageMetadata("/partners");

const tracks = [
  { name: "Sponsors", body: "Drug teams who bring a resistance question, a candidate and a decision to make.", href: "/for-drug-developers" },
  { name: "Execution laboratories", body: "Labs with authenticated models that run the chosen assays.", href: "/partners/laboratories" },
  { name: "Validation laboratories", body: "Independent labs that re-test the signals that matter most.", href: "/partners/laboratories" },
  { name: "Biobanks and model providers", body: "Holders of consented samples and patient-derived models with treatment context.", href: "/partners/biobanks" },
];

export default function PartnersPage() {
  return (
    <>
      <PageHeader
        path="/partners"
        eyebrow="Partners"
        answer={
          <p>
            Cytogent chooses and learns from experiments; laboratories and biobanks hold the biology. We are not a
            competing wet lab. Cytogent provides the structure that lets each partner do what it does best, with each
            project’s data kept to that project.
          </p>
        }
        actions={
          <Link href="/contact?intent=collaboration" className="btn btn-primary">
            Explore a collaboration
          </Link>
        }
        aside={<TrackArchitecture />}
      />

      <Section id="tracks">
        <SectionHeader id="tracks" eyebrow="Four tracks" title="Who does what." />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {tracks.map((t) => (
            <li key={t.name} className="glass flex flex-col p-6">
              <h3 className="text-xl font-semibold">{t.name}</h3>
              <p className="mt-2 flex-1 text-muted">{t.body}</p>
              <div className="mt-3">
                <ArrowLink href={t.href}>Read more</ArrowLink>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="lean" className="border-t border-line">
        <SectionHeader id="lean" eyebrow="Operating idea" title="Start lean: one sponsor, one lab.">
          <p>
            The first loops run with the smallest workable group: one sponsor with a real question and one
            laboratory with suitable models. More partners join only when a specific question needs them.
          </p>
          <p>
            We do not name partners on this site until agreements are in place and they have said yes.
          </p>
        </SectionHeader>
        <div className="mt-6 flex flex-wrap gap-x-8">
          <ArrowLink href="/data-governance">How project data is kept apart</ArrowLink>
          <ArrowLink href="/pilot-programme">The pilot structure</ArrowLink>
        </div>
      </Section>

      <CtaBand
        title="Explore a collaboration."
        cta={{ label: "Explore a collaboration", href: "/contact?intent=collaboration" }}
        secondary={{ label: "For laboratories", href: "/partners/laboratories" }}
      >
        Tell us what models, samples or capabilities you have, and what you would want from a collaboration.
      </CtaBand>
    </>
  );
}
