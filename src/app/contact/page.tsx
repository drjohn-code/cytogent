import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Container } from "@/components/ui/Section";
import { credentials, isPublic } from "@/content/credentials";
import { contactTopics } from "@/content/contact";
import { pageMetadata } from "@/content/routes";

/**
 * Form (POST /api/contact → email via Resend) plus direct email and office address.
 * `?intent=` links from other pages preselect the topic; each topic also has an anchor.
 * The office card renders once `credentials.address` is verified.
 */
export const metadata: Metadata = pageMetadata("/contact");

const steps = [
  { title: "You write", body: "The question and the decision behind it." },
  { title: "We talk", body: "A call to scope what an experiment could answer." },
  { title: "You get a plan", body: "A bounded pilot: models, batch and readout." },
];

export default function ContactPage() {
  const email = credentials.email;
  const address = credentials.address;
  return (
    <>
      <PageHeader
        path="/contact"
        eyebrow="Contact"
        answer={<p>Tell us what you are working on and what decision you need to make. A few sentences is enough to start.</p>}
      />
      <Container className="py-16 sm:py-24">
        {contactTopics.map((t) => (
          <span key={t.id} id={t.id} className="sr-only">
            {t.title}
          </span>
        ))}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <section aria-labelledby="form-title" className="glass reveal relative p-6 sm:p-10">
            <h2 id="form-title" className="text-2xl font-semibold sm:text-3xl">
              Send us a message
            </h2>
            <div className="mt-8">
              <ContactForm email={email.value} />
            </div>
          </section>

          <div className="space-y-4">
            {isPublic(email) && (
              <section aria-labelledby="email-title" className="glass reveal p-6">
                <p className="eyebrow">Email</p>
                <h2 id="email-title" className="sr-only">
                  Email
                </h2>
                <a href={`mailto:${email.value}`} className="mt-3 block text-xl font-semibold text-text underline-offset-4 hover:text-signal hover:underline">
                  {email.value}
                </a>
              </section>
            )}
            {isPublic(address) && (
              <section aria-labelledby="office-title" className="glass reveal p-6">
                <p className="eyebrow">Office</p>
                <h2 id="office-title" className="sr-only">
                  Office
                </h2>
                <address className="mt-3 text-lg not-italic">{address.value}</address>
              </section>
            )}
            <section aria-labelledby="next-title" className="glass reveal p-6">
              <p className="eyebrow" id="next-title">
                What happens next
              </p>
              <ol className="mt-5 space-y-5">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-signal/50 font-mono text-xs text-signal">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-sm text-muted">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-1 sm:flex-row sm:gap-8">
          <ArrowLink href="/faq">Questions and answers</ArrowLink>
          <ArrowLink href="/pilot-programme">The pilot structure</ArrowLink>
          <ArrowLink href="/data-governance">Data governance</ArrowLink>
        </div>
      </Container>
    </>
  );
}
