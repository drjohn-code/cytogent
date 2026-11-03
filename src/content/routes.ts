import type { Metadata } from "next";
import { site } from "./site";

/**
 * Route manifest: the single source for each indexable page's title, description, H1 and breadcrumb parent.
 * Page metadata, visible breadcrumbs, JSON-LD, the sitemap, llms.txt, OG images and tests all read from here.
 */
export type PageKind = "home" | "page" | "about" | "collection" | "contact" | "faq" | "glossary" | "legal";

export interface RouteEntry {
  path: string;
  /** Key for /og/[slug]. */
  slug: string;
  title: string;
  description: string;
  /** The page's H1 (used on OG images and as the OG alt text). */
  heading: string;
  /** Breadcrumb label. */
  label: string;
  parent?: string;
  kind: PageKind;
  /** Page honestly describes the intended service: emit a Service node (no offers). */
  service?: boolean;
}

export const routes: RouteEntry[] = [
  {
    path: "/",
    slug: "home",
    title: "Cytogent | Experimental Intelligence for Oncology R&D",
    description:
      "Cytogent connects molecular state and lab response so oncology teams can choose the next high-value combination experiment in resistant cancer.",
    heading: "The Experimental Intelligence Layer for Resistant Cancer.",
    label: "Home",
    kind: "home",
  },
  {
    path: "/platform",
    slug: "platform",
    title: "How the Cytogent Loop Works | Decision-as-a-Service",
    description:
      "How Cytogent's closed loop works: frame a resistance question, rank a bounded batch with visible uncertainty, test with lab partners, then learn.",
    heading: "A loop, not another dashboard.",
    label: "Platform",
    parent: "/",
    kind: "page",
    service: true,
  },
  {
    path: "/science",
    slug: "science",
    title: "Osimertinib Resistance Biology | Cytogent Science",
    description:
      "Why EGFR-mutant lung cancer can escape osimertinib in different ways, why a functional lab readout still decides, and three signals a pilot measures.",
    heading: "Resistance is not one mutation.",
    label: "Science",
    parent: "/",
    kind: "page",
  },
  {
    path: "/for-drug-developers",
    slug: "for-drug-developers",
    title: "Experiment Selection for Oncology Drug Teams | Cytogent",
    description:
      "For asset teams and translational leads facing resistance: how Cytogent helps choose which combination experiments to run next, and what to stop.",
    heading: "Know what to test on Monday.",
    label: "For drug teams",
    parent: "/",
    kind: "page",
  },
  {
    path: "/pilot-programme",
    slug: "pilot-programme",
    title: "Pilot Programme Structure | Cytogent",
    description:
      "The shape of a Cytogent pilot: one candidate, one resistance question, a bounded batch, independent confirmation and a go/no-go package.",
    heading: "One candidate. One question. One measurable decision.",
    label: "Pilot programme",
    parent: "/",
    kind: "page",
    service: true,
  },
  {
    path: "/partners",
    slug: "partners",
    title: "Partner With Cytogent | Labs, Biobanks and Sponsors",
    description:
      "How laboratories, biobanks and drug sponsors could work with Cytogent's experiment-selection loop. Cytogent is not a competing wet lab.",
    heading: "The loop needs good biology.",
    label: "Partners",
    parent: "/",
    kind: "page",
  },
  {
    path: "/partners/laboratories",
    slug: "partners-laboratories",
    title: "For Laboratory Partners | Cytogent",
    description:
      "For laboratories with authenticated cancer models: how execution and independent validation roles work in Cytogent's experiment loop.",
    heading: "Your models. A governed next experiment.",
    label: "Laboratories",
    parent: "/partners",
    kind: "page",
  },
  {
    path: "/partners/biobanks",
    slug: "partners-biobanks",
    title: "For Biobanks and Model Providers | Cytogent",
    description:
      "For biobanks and holders of patient-derived models: how consented samples with treatment context could answer focused resistance questions.",
    heading: "Samples with a question attached.",
    label: "Biobanks",
    parent: "/partners",
    kind: "page",
  },
  {
    path: "/investors",
    slug: "investors",
    title: "Investor Overview | Cytogent",
    description:
      "Cytogent's thesis for investors: a narrow beachhead in osimertinib resistance first, and six validation aims that must be met before a broader platform.",
    heading: "A sharp wedge before a broad platform.",
    label: "Investors",
    parent: "/",
    kind: "page",
  },
  {
    path: "/for-people",
    slug: "for-people",
    title: "Why a Cancer Drug Can Stop Working | Cytogent",
    description:
      "A plain-language explanation of cancer drug resistance, why donated samples matter, and what Cytogent does and does not do.",
    heading: "Why a drug can stop working.",
    label: "For people",
    parent: "/",
    kind: "page",
  },
  {
    path: "/about",
    slug: "about",
    title: "About Cytogent | Experimental Intelligence for Oncology",
    description:
      "Cytogent has built an experimental intelligence layer for oncology R&D and is starting pilots in combination experiment selection for resistant lung cancer.",
    heading: "Built around one hard question.",
    label: "About",
    parent: "/",
    kind: "about",
  },
  {
    path: "/data-governance",
    slug: "data-governance",
    title: "Data Governance | Cytogent",
    description:
      "How Cytogent keeps each project's data separate: project-level isolation, permission gates and an audit trail, for research-use decision support.",
    heading: "Data stays in its own lane.",
    label: "Data governance",
    parent: "/",
    kind: "page",
  },
  {
    path: "/insights",
    slug: "insights",
    title: "Insights | Cytogent",
    description:
      "Notes from Cytogent on drug resistance, experiment selection and evidence in oncology R&D. The first notes are in review and will appear here.",
    heading: "Notes forthcoming.",
    label: "Insights",
    parent: "/",
    kind: "collection",
  },
  {
    path: "/faq",
    slug: "faq",
    title: "Questions and Answers | Cytogent",
    description:
      "Straight answers about Cytogent: what it does, what it is not, how a pilot works, how data is handled, and what it means for patients.",
    heading: "Questions and answers.",
    label: "FAQ",
    parent: "/",
    kind: "faq",
  },
  {
    path: "/glossary",
    slug: "glossary",
    title: "Glossary | Cytogent",
    description:
      "Plain definitions of the terms used on this site, from active learning and abstention to PDOs, therapeutic window and Decision-as-a-Service.",
    heading: "The words on this site, explained.",
    label: "Glossary",
    parent: "/",
    kind: "glossary",
  },
  {
    path: "/contact",
    slug: "contact",
    title: "Contact Cytogent | Bring the Question",
    description:
      "Contact Cytogent about a pilot programme, a laboratory or biobank collaboration, the investor brief, or a general question.",
    heading: "Bring the question.",
    label: "Contact",
    parent: "/",
    kind: "contact",
  },
  {
    path: "/privacy",
    slug: "privacy",
    title: "Privacy Notice | Cytogent",
    description:
      "What this website collects and why: no cookies, no analytics, no forms, and no third-party scripts. Server logs and email are covered here.",
    heading: "Privacy notice.",
    label: "Privacy",
    parent: "/",
    kind: "legal",
  },
  {
    path: "/terms",
    slug: "terms",
    title: "Website Terms | Cytogent",
    description:
      "Terms for using the Cytogent website: information only, no medical advice, the platform's intended use, and how site content may be used.",
    heading: "Website terms.",
    label: "Terms",
    parent: "/",
    kind: "legal",
  },
  {
    path: "/accessibility",
    slug: "accessibility",
    title: "Accessibility Statement | Cytogent",
    description:
      "Cytogent aims to meet WCAG 2.2 level AA. What we have done, what we have and have not tested, known limitations, and how to report a barrier.",
    heading: "Accessibility statement.",
    label: "Accessibility",
    parent: "/",
    kind: "legal",
  },
];

const byPath = new Map(routes.map((r) => [r.path, r]));

export function route(path: string): RouteEntry {
  const r = byPath.get(path);
  if (!r) throw new Error(`Route not in manifest: ${path}`);
  return r;
}

export function absoluteUrl(path: string) {
  return path === "/" ? site.url : `${site.url}${path}`;
}

/** Home → … → this page, from the parent chain. */
export function crumbsFor(path: string): { label: string; href: string }[] {
  const chain: RouteEntry[] = [];
  for (let r: RouteEntry | undefined = route(path); r; r = r.parent ? route(r.parent) : undefined) chain.unshift(r);
  return chain.map((r) => ({ label: r.label, href: r.path }));
}

export function pageMetadata(path: string): Metadata {
  const r = route(path);
  const image = { url: `/og/${r.slug}`, width: 1200, height: 630, alt: r.heading };
  return {
    title: { absolute: r.title },
    description: r.description,
    alternates: { canonical: path },
    openGraph: {
      title: r.title,
      description: r.description,
      url: path,
      siteName: site.name,
      locale: "en_GB",
      type: "website",
      images: [image],
    },
    twitter: { card: "summary_large_image", title: r.title, description: r.description, images: [image] },
  };
}
