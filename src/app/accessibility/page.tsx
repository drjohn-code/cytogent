import type { Metadata } from "next";
import { pageMetadata } from "@/content/routes";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";

// Keep "How we check" in step with what has actually been tested (docs/TODO_VERIFY.md).
export const metadata: Metadata = pageMetadata("/accessibility");

export default function AccessibilityPage() {
  return (
    <LegalPage
      path="/accessibility"
      eyebrow="Accessibility"
      summary={
        <p>
          We aim for this website to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. It has not
          yet been audited independently.
        </p>
      }
    >
      <section>
        <h2>What we have built in</h2>
        <ul>
          <li>A skip link, landmarks and one main heading per page.</li>
          <li>Links, the menu and the questions and answers work with a keyboard, with a visible focus outline.</li>
          <li>Text colours meet AA contrast against the dark background.</li>
          <li>Animation follows your system’s reduced-motion setting; the 3D illustration is replaced by a still image.</li>
          <li>The moving 3D illustration has a pause button.</li>
          <li>Diagrams are illustrations: the same information is in the text beside them.</li>
          <li>Questions and answers use standard disclosure controls.</li>
        </ul>
      </section>

      <section>
        <h2>How we check</h2>
        <p>
          Every page is checked automatically against WCAG 2.2 A and AA rules (axe-core) at phone and desktop widths.
          Automated tests also cover keyboard use, focus visibility, reflow at 320 pixels wide, doubled text size and
          reduced motion. A review with screen readers and an independent audit have not been done yet; this section
          will say what they find.
        </p>
      </section>

      <section>
        <h2>Known limitations</h2>
        <ul>
          <li>The 3D illustration on the home page is decorative and hidden from screen readers.</li>
          <li>The site has not yet been tested with a range of screen readers or on many real devices.</li>
        </ul>
      </section>

      <section>
        <h2>Report a barrier</h2>
        <p>
          If something on this site is hard to use, please tell us through the <Link href="/contact?intent=general">contact page</Link>{" "}
          and say which page and what happened.
        </p>
      </section>

      <section>
        <h2>Related</h2>
        <p>
          See also the <Link href="/privacy">privacy notice</Link>, the <Link href="/terms">website terms</Link> and the{" "}
          <Link href="/glossary">glossary</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
