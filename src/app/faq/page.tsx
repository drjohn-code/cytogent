import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Section";
import { faqGroups } from "@/content/faq";

export const metadata: Metadata = pageMetadata("/faq");

export default function FaqPage() {
  return (
    <>
      <PageHeader
        path="/faq"
        eyebrow="FAQ"
        answer={<p>Short, honest answers. Cytogent is in development, and these answers say so where it matters.</p>}
      />
      <Container className="py-16">
        <div className="max-w-[var(--measure)] space-y-14">
          {faqGroups.map((g) => (
            <section key={g.heading} aria-labelledby={`faq-${g.heading.replace(/\W+/g, "-").toLowerCase()}`}>
              <h2 id={`faq-${g.heading.replace(/\W+/g, "-").toLowerCase()}`} className="text-2xl font-semibold">
                {g.heading}
              </h2>
              <div className="mt-4 border-t border-line">
                {g.items.map((f) => (
                  <details key={f.q} className="group border-b border-line">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-lg font-medium">{f.q}</h3>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="size-4 shrink-0 text-signal transition-transform duration-200 group-open:rotate-45"
                      >
                        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </summary>
                    <div className="pb-6 text-muted">
                      <p>{f.a}</p>
                      {f.link && (
                        <p className="mt-3">
                          <Link href={f.link.href} className="text-signal underline underline-offset-4">
                            {f.link.label}
                          </Link>
                        </p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
      <CtaBand title="Ask us a question." cta={{ label: "Ask us a question", href: "/contact?intent=general" }}>
        If your question isn’t here, ask it directly.
      </CtaBand>
    </>
  );
}
