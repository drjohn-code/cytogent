/** Visible FAQ (BRIEF §8). If FAQPage JSON-LD is emitted, it must be generated from this exact text. */
export interface Faq {
  q: string;
  a: string;
  link?: { label: string; href: string };
}

export const faqGroups: { heading: string; items: Faq[] }[] = [
  {
    heading: "What we do",
    items: [
      {
        q: "What does Cytogent do?",
        a: "Cytogent has built an experimental intelligence layer for oncology R&D. It helps drug teams choose which combination experiments to run next in treatment-resistant cancer, run them with laboratory partners, and update the plan from the results. It is delivered as a managed service: Decision-as-a-Service.",
        link: { label: "How the loop works", href: "/platform" },
      },
      {
        q: "Is the platform available today?",
        a: "Yes. The platform is built, and we are ready to start pilots with oncology asset teams and to partner with model laboratories. We have not published any client results yet.",
      },
      {
        q: "Why start with osimertinib resistance?",
        a: "Resistance after osimertinib in EGFR-mutant lung cancer is well described and varied, which makes it a demanding first test. It is a starting R&D focus, not a patient population we treat.",
        link: { label: "The science", href: "/science" },
      },
    ],
  },
  {
    heading: "Proof and boundaries",
    items: [
      {
        q: "Is Cytogent a diagnostic or a treatment tool?",
        a: "No. It is not intended as a clinical diagnostic or as a tool to select treatment for any individual patient. Its intended use is preclinical and translational experiment selection for drug developers.",
      },
      {
        q: "Does it replace wet-lab scientists?",
        a: "No. Predictions are hypotheses; experiments decide. The aim is to help scientists spend scarce lab time and samples on the experiments most likely to teach them something.",
      },
      {
        q: "How will you know if it works?",
        a: "By measuring it. Our north-star aim is independently confirmed, decision-relevant findings per experimental budget. Each pilot compares loop-selected batches with how the team would otherwise choose, and we treat the calibration of uncertainty estimates as something to validate, not assume.",
      },
    ],
  },
  {
    heading: "Working together",
    items: [
      {
        q: "What does a pilot look like?",
        a: "One candidate, one resistance question, one decision. A pilot includes a decision brief, a ranked batch, an uncertainty map, lab coordination, quality-checked results, independent confirmation, an executive package and an audit trail.",
        link: { label: "The pilot structure", href: "/pilot-programme" },
      },
      {
        q: "Who are your laboratory partners?",
        a: "We do not name partners until agreements are in place and they have agreed to be named. Laboratories interested in working with us can read how we qualify partners.",
        link: { label: "For laboratories", href: "/partners/laboratories" },
      },
      {
        q: "How is my data handled?",
        a: "Each project’s data is kept separate, behind explicit permission gates, with an audit trail. Project data is handled only under a written agreement.",
        link: { label: "Data governance", href: "/data-governance" },
      },
      {
        q: "Can I send data or compound structures through the website?",
        a: "Please don’t. The site has no forms. In a first message, leave out patient-identifiable health data and confidential chemical structures; we will agree how to share data if a project goes ahead.",
      },
    ],
  },
  {
    heading: "For patients and the public",
    items: [
      {
        q: "Can you tell me which treatment I should have?",
        a: "No. We cannot give medical advice, and our work is not intended for choosing anyone’s treatment. Please talk to your doctor or care team about your own care.",
      },
      {
        q: "Why do cancer drugs stop working?",
        a: "A tumour is made of many cells. A drug may stop most of them, but a few can survive by changing the drug’s target, switching to another growth signal, or changing type. When they grow back, the drug may work less well.",
        link: { label: "Resistance in plain words", href: "/for-people" },
      },
    ],
  },
];
