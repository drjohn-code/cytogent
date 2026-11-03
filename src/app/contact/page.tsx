import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Container } from "@/components/ui/Section";
import { credentials, isPublic } from "@/content/credentials";

/**
 * mailto only (BRIEF §8): no form backend, validation, retention policy or controller is confirmed.
 * The address renders only once `credentials.email` is verified; until then the page says so plainly.
 * `?intent=` links from other pages land here; the page is static and lists every intent.
 */
export const metadata: Metadata = pageMetadata("/contact");

const intents = [
  { id: "pilot", title: "Discuss a pilot programme", body: "The candidate, the resistance context and the decision you face.", subject: "Pilot programme" },
  { id: "lab", title: "Qualify as a lab partner", body: "Your models, assays and capacity.", subject: "Laboratory partnership" },
  { id: "collaboration", title: "Explore a collaboration", body: "Biobanks, model providers and other partners.", subject: "Collaboration" },
  { id: "investor", title: "Request the investor brief", body: "Who you are and what you would like to know.", subject: "Investor brief" },
  { id: "general", title: "Ask a question", body: "Anything else, including governance and accessibility.", subject: "Question" },
];

export default function ContactPage() {
  const email = credentials.email;
  const live = isPublic(email);
  return (
    <>
      <PageHeader
        path="/contact"
        eyebrow="Contact"
        answer={<p>Tell us what you are working on and what decision you need to make. A few sentences is enough to start.</p>}
      />
      <Container className="py-16">
        <div
          role="note"
          className="max-w-[var(--measure)] rounded-[var(--radius-card)] border border-alert/60 p-5 text-[0.95rem]"
        >
          <p className="font-semibold text-alert">Before you write</p>
          <p className="mt-1 text-muted">
            Please do not send patient-identifiable health data or confidential chemical structures. If a project goes
            ahead, we will agree how to share data under a written agreement.
          </p>
        </div>

        {live ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {intents.map((i) => (
              <li key={i.id} id={i.id} className="glass flex flex-col p-6">
                <h2 className="text-xl font-semibold">{i.title}</h2>
                <p className="mt-2 flex-1 text-muted">{i.body}</p>
                <a
                  href={`mailto:${email.value}?subject=${encodeURIComponent(i.subject)}`}
                  className="btn btn-ghost mt-5 self-start"
                >
                  Email {email.value}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 max-w-[var(--measure)]">
            <h2 className="text-2xl font-semibold">Our contact address is being set up.</h2>
            <p className="mt-3 text-muted">
              It will appear on this page shortly. When it does, you will be able to reach us about any of these:
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {intents.map((i) => (
                <li key={i.id} id={i.id} className="rounded-[var(--radius-card)] border border-line p-5">
                  <h3 className="font-semibold">{i.title}</h3>
                  <p className="mt-1 text-sm text-muted">{i.body}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12 flex flex-col gap-1 sm:flex-row sm:gap-8">
          <ArrowLink href="/faq">Questions and answers</ArrowLink>
          <ArrowLink href="/pilot-programme">The pilot structure</ArrowLink>
          <ArrowLink href="/data-governance">Data governance</ArrowLink>
        </div>
      </Container>
    </>
  );
}
