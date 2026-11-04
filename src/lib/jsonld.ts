import { credentials, isPublic } from "@/content/credentials";
import { faqGroups } from "@/content/faq";
import { glossary } from "@/content/glossary";
import { absoluteUrl, crumbsFor, route } from "@/content/routes";
import { site } from "@/content/site";

/**
 * One @graph per page with stable @ids (BRIEF §10). Rules:
 * - Organization: email / sameAs only when verified; no parentOrganization or funder.
 * - Service only where `route.service` is set; never `offers`.
 * - FAQPage and DefinedTermSet are built from the same content files the page renders.
 * - Never: MedicalDevice, Drug, MedicalCondition, Physician, Patient, AggregateRating, Review, speakable.
 */
type Node = Record<string, unknown>;

const ORG = `${site.url}/#organization`;
const WEBSITE = `${site.url}/#website`;

function organization(): Node {
  const sameAs = isPublic(credentials.linkedin) ? [credentials.linkedin.value] : undefined;
  return {
    "@type": "Organization",
    "@id": ORG,
    name: site.name,
    url: site.url,
    logo: { "@type": "ImageObject", url: `${site.url}/icons/icon-512.png`, width: 512, height: 512 },
    description: isPublic(credentials.affiliation) ? `${site.mission} ${credentials.affiliation.value}` : site.mission,
    ...(isPublic(credentials.email) ? { email: credentials.email.value } : {}),
    ...(sameAs ? { sameAs } : {}),
  };
}

function website(): Node {
  return { "@type": "WebSite", "@id": WEBSITE, url: site.url, name: site.name, inLanguage: "en-GB", publisher: { "@id": ORG } };
}

const PAGE_TYPE = {
  home: "WebPage",
  page: "WebPage",
  about: "AboutPage",
  collection: "CollectionPage",
  contact: "ContactPage",
  faq: "FAQPage",
  glossary: "WebPage",
  legal: "WebPage",
} as const;

export function pageGraph(path: string) {
  const r = route(path);
  const url = absoluteUrl(path);
  const crumbs = crumbsFor(path);
  const nodes: Node[] = [organization(), website()];

  const page: Node = {
    "@type": PAGE_TYPE[r.kind],
    "@id": `${url}#webpage`,
    url,
    name: r.title,
    description: r.description,
    inLanguage: "en-GB",
    isPartOf: { "@id": WEBSITE },
    about: { "@id": ORG },
  };

  if (crumbs.length > 1) {
    page.breadcrumb = { "@id": `${url}#breadcrumb` };
    nodes.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: absoluteUrl(c.href) })),
    });
  }

  if (r.kind === "faq") {
    page.mainEntity = faqGroups.flatMap((g) =>
      g.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    );
  }

  if (r.kind === "glossary") {
    page.mainEntity = { "@id": `${url}#terms` };
    nodes.push({
      "@type": "DefinedTermSet",
      "@id": `${url}#terms`,
      name: "Cytogent glossary",
      hasDefinedTerm: glossary.map((t) => ({
        "@type": "DefinedTerm",
        "@id": `${url}#${t.slug}`,
        name: t.term,
        description: t.definition,
        url: `${url}#${t.slug}`,
      })),
    });
  }

  if (r.service) {
    nodes.push({
      "@type": "Service",
      "@id": `${site.url}/#service`,
      name: `${site.model} for resistant cancer`,
      serviceType: "Experiment selection for preclinical and translational oncology research",
      description:
        "A managed service that helps drug teams prioritise combination experiments in treatment-resistant cancer, test them with laboratory partners and learn from the results. Not intended as a clinical diagnostic or for selecting treatment for individual patients.",
      provider: { "@id": ORG },
      url: absoluteUrl("/platform"),
    });
    page.mainEntity = { "@id": `${site.url}/#service` };
  }

  nodes.push(page);
  return { "@context": "https://schema.org", "@graph": nodes };
}
