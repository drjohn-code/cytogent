/** Canonical facts (BRIEF §2). JSON-LD, footer, llms.txt and page copy read from here. */
export const site = {
  name: "Cytogent",
  url: "https://cytogent.com",
  locale: "en-GB",
  category: "The Experimental Intelligence Layer for Resistant Cancer",
  mission:
    "Cytogent connects molecular state and experimental response to drive smarter drug-development decisions in resistant cancer.",
  model: "Decision-as-a-Service (DaaS)",
  beachhead:
    "Combination experiment selection in treatment-resistant EGFR-mutant lung adenocarcinoma following osimertinib resistance.",
  northStar: "Independently confirmed, decision-relevant findings per experimental budget.",
  statusNote:
    "Initial focus: preclinical and translational experiment selection for resistant cancer. Not intended as a clinical diagnostic or as a tool for selecting treatment for individual patients.",
  primaryCta: { label: "Discuss a pilot programme", href: "/contact?intent=pilot" },
} as const;

/** Plain-language "what Cytogent is not" (intended use, not a legal classification). */
export const notList = [
  "Not intended as a clinical diagnostic or patient treatment-selection tool.",
  "Not a DNA-only / sequence-only oracle.",
  "Not a replacement for wet-lab scientists.",
  "Not a brick-and-mortar CRO or model marketplace.",
  "Not a de novo chemistry or protein-design shop.",
] as const;
