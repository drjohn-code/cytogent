import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { NotCards } from "@/components/content/NotCards";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Container, Section, SectionHeader } from "@/components/ui/Section";
import { ResistanceStory } from "@/components/visuals/ResistanceStory";
import { references } from "@/content/references";

export const metadata: Metadata = pageMetadata("/for-people");

export default function ForPeoplePage() {
  return (
    <>
      <PageHeader
        path="/for-people"
        eyebrow="In plain words"
        answer={
          <p>
            Some cancer drugs target one signal that a tumour depends on. They can work well for a time. But a tumour is
            made of many cells, and a few of them can find another way to survive. When those cells grow back, the drug
            may no longer work as well. Doctors call this drug resistance.
          </p>
        }
      />

      <Section id="story">
        <SectionHeader id="story" eyebrow="The story in three frames" title="How resistance happens." />
        <div className="mt-10">
          <ResistanceStory />
        </div>
        <p className="mt-6 max-w-2xl text-muted">
          The drawings are simplified. Real tumours are more varied, and the same drug can fail in different ways in
          different people.
        </p>
      </Section>

      <Section id="samples" className="border-t border-line">
        <SectionHeader id="samples" eyebrow="Donated samples" title="Making each donated sample count.">
          <p>
            Researchers can grow small living models of a tumour from donated tissue and test drugs on them in the lab.
            There are never enough of these samples. Cytogent helps researchers choose the experiments that will
            teach the most, so that each donation is used well.
          </p>
        </SectionHeader>
      </Section>

      <Section id="limits">
        <SectionHeader id="limits" eyebrow="Honest limits" title="What we do not do.">
          <p>
            Cytogent works on research for drug developers. We cannot give medical advice, and our work is not intended
            for diagnosing anyone or choosing anyone’s treatment. If you have questions about your own care, please ask
            your doctor or care team.
          </p>
        </SectionHeader>
        <div className="mt-10">
          <NotCards />
        </div>
      </Section>

      <Container className="pb-24">
        <div className="glass p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Read more</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/glossary" className="inline-flex min-h-11 items-center text-signal underline underline-offset-4">
                Glossary: the words on this site, explained
              </Link>
            </li>
            <li>
              <a href={references["REF-03"].url} rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-signal underline underline-offset-4">
                National Cancer Institute: what “drug resistance” means
              </a>
            </li>
            <li>
              <a href={references["REF-04"].url} rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-signal underline underline-offset-4">
                World Health Organization: lung cancer fact sheet
              </a>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-x-8">
            <ArrowLink href="/faq">Questions and answers</ArrowLink>
            <ArrowLink href="/contact?intent=general">Ask us a question</ArrowLink>
          </div>
        </div>
      </Container>
    </>
  );
}
