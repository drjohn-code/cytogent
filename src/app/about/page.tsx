import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { DesignPrinciples } from "@/components/content/DesignPrinciples";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, Section, SectionHeader } from "@/components/ui/Section";
import { credentials, isPublic } from "@/content/credentials";
import { site } from "@/content/site";

export const metadata: Metadata = pageMetadata("/about");

export default function AboutPage() {
  const shown = [credentials.affiliation, credentials.accelerators, credentials.nvidiaInception].filter(isPublic);
  return (
    <>
      <PageHeader
        path="/about"
        eyebrow="About"
        answer={
          <>
            <p>{site.mission}</p>
            <p>
              The question behind it: when a cancer drug stops working, which experiment should a team run next? We built a service to answer that, starting with resistance to osimertinib in EGFR-mutant lung
              cancer.
            </p>
          </>
        }
        actions={
          <Link href="/contact?intent=general" className="btn btn-primary">
            Talk with our team
          </Link>
        }
      />

      <Section id="principles">
        <SectionHeader id="principles" eyebrow="Operating principles" title="How we work." />
        <div className="mt-10">
          <DesignPrinciples />
        </div>
      </Section>

      {shown.length > 0 && (
        <Section id="credentials" className="border-t border-line">
          <SectionHeader id="credentials" eyebrow="Facts" title="Programmes and affiliation." />
          <ul className="mt-6 space-y-2">
            {shown.map((c) => (
              <li key={c.value}>{c.value}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            Membership or selection does not mean clinical validation or commercial endorsement.
          </p>
        </Section>
      )}

      <Section id="stage" className="border-t border-line">
        <SectionHeader id="stage" eyebrow="Where we are" title="Ready to start.">
          <p>
            The platform is built. We are ready to start pilots with oncology drug teams and to partner with
            laboratories and biobanks.
          </p>
          <p>{site.statusNote}</p>
        </SectionHeader>
        <div className="mt-6 flex flex-wrap gap-x-8">
          <ArrowLink href="/platform">How the loop works</ArrowLink>
          <ArrowLink href="/science">The science</ArrowLink>
          <ArrowLink href="/investors">For investors</ArrowLink>
        </div>
      </Section>

      <CtaBand title="Talk with our team." cta={{ label: "Talk with our team", href: "/contact?intent=general" }}>
        Questions about the work, a collaboration or a pilot are all welcome.
      </CtaBand>
    </>
  );
}
