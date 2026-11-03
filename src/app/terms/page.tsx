import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/content/site";

// Website terms only. Governing law, the contracting entity and liability wording need legal review (docs/TODO_VERIFY.md).
export const metadata: Metadata = pageMetadata("/terms");

export default function TermsPage() {
  return (
    <LegalPage
      path="/terms"
      eyebrow="Terms"
      summary={<p>These terms cover your use of this website. Any project work is governed by its own written agreement.</p>}
    >
      <section>
        <h2>Information only</h2>
        <p>
          This website describes Cytogent’s services. It is general information, not an offer, and it may change without
          notice.
        </p>
      </section>

      <section>
        <h2>No medical advice</h2>
        <p>
          Nothing on this website is medical advice. {site.statusNote} If you have questions about your own health or
          treatment, please speak to your doctor or care team.
        </p>
      </section>

      <section>
        <h2>Scientific content</h2>
        <p>
          Diagrams and illustrations marked as conceptual do not show real data. Cited sources describe the scientific
          field, not the performance of Cytogent’s platform.
        </p>
      </section>

      <section>
        <h2>Using site content</h2>
        <p>
          You may link to this website and quote short passages with attribution. The Cytogent name and logo may not be
          used in a way that suggests endorsement or a partnership.
        </p>
      </section>

      <section>
        <h2>Links to other websites</h2>
        <p>We link to external sources for reference. We are not responsible for their content.</p>
      </section>

      <section>
        <h2>Related</h2>
        <p>
          See also the <Link href="/privacy">privacy notice</Link> and the{" "}
          <Link href="/accessibility">accessibility statement</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
