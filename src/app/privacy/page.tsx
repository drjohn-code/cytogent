import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { credentials, isPublic } from "@/content/credentials";

// Drafted from what the site actually does (no cookies, analytics, forms or third-party scripts). Needs legal review: docs/TODO_VERIFY.md.
export const metadata: Metadata = pageMetadata("/privacy");

export default function PrivacyPage() {
  const emailLive = isPublic(credentials.email);
  return (
    <LegalPage
      path="/privacy"
      eyebrow="Privacy"
      summary={
        <p>
          This website does not use cookies, analytics, tracking pixels or forms, and it loads no third-party scripts or
          fonts. The only personal data involved is the technical data any web server receives, and anything you choose
          to send us by email.
        </p>
      }
    >
      <section>
        <h2>Who is responsible</h2>
        <p>
          The organisation responsible for this website and the details for contacting it about privacy will be stated
          here before the site is launched.
        </p>
      </section>

      <section>
        <h2>What the website itself collects</h2>
        <ul>
          <li>No cookies, and nothing stored in your browser by us.</li>
          <li>No analytics, advertising or social-media tracking.</li>
          <li>No forms. Nothing you type on this site is sent to us.</li>
          <li>Fonts, images and scripts are served from this website’s own domain.</li>
        </ul>
      </section>

      <section>
        <h2>Server logs</h2>
        <p>
          When you visit, the servers that deliver the site receive technical information such as your IP address, your
          browser type and the page you asked for. Our hosting provider processes this to deliver the site and to
          protect it from abuse. We do not use it to identify or profile visitors.
        </p>
      </section>

      {emailLive && (
        <section>
          <h2>If you email us</h2>
          <p>
            We use your email address and what you write to reply to you and to follow up on what you asked about. We do
            not add you to a mailing list. Please do not send patient-identifiable health data.
          </p>
        </section>
      )}

      <section>
        <h2>Your rights</h2>
        <p>
          Under data protection law, including the GDPR, you can ask for access to personal data held about you, and ask
          for it to be corrected or deleted. You can also complain to the data protection authority where you live.
        </p>
      </section>

      <section>
        <h2>Related</h2>
        <p>
          How project data is meant to be handled is described separately on the{" "}
          <Link href="/data-governance">data governance</Link> page. See also the <Link href="/terms">website terms</Link>{" "}
          and the <Link href="/accessibility">accessibility statement</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
