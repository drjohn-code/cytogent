export interface NavItem {
  label: string;
  href: string;
}

/** Desktop and drawer navigation (BRIEF §5). */
export const mainNav: NavItem[] = [
  { label: "Platform", href: "/platform" },
  { label: "Science", href: "/science" },
  { label: "For Drug Teams", href: "/for-drug-developers" },
  { label: "Partners", href: "/partners" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Explore",
    items: [
      { label: "Platform", href: "/platform" },
      { label: "Science", href: "/science" },
      { label: "For drug teams", href: "/for-drug-developers" },
      { label: "Pilot programme", href: "/pilot-programme" },
      { label: "Investors", href: "/investors" },
    ],
  },
  {
    heading: "Collaborate",
    items: [
      { label: "Partners", href: "/partners" },
      { label: "Laboratories", href: "/partners/laboratories" },
      { label: "Biobanks", href: "/partners/biobanks" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Learn",
    items: [
      { label: "For people", href: "/for-people" },
      { label: "Insights", href: "/insights" },
      { label: "Glossary", href: "/glossary" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Policies",
    items: [
      { label: "Data governance", href: "/data-governance" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];
