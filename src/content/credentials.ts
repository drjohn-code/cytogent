/**
 * Company facts are claims until confirmed (BRIEF §1.1).
 *   verified: may be published
 *   planned:  may be described only as an aim
 *   pending:  never published
 * The `note` field is internal and must never be rendered. Open items live in docs/TODO_VERIFY.md.
 */
export type FactStatus = "verified" | "planned" | "pending";

export interface Fact<T> {
  status: FactStatus;
  value: T;
  note: string;
}

export const credentials = {
  email: {
    status: "verified",
    value: "info@cytogent.com",
    note: "Owner confirmed in chat on 3 Nov 2026 that the mailbox works and is monitored.",
  },
  address: {
    status: "pending",
    value: "Office street address, postcode and city, Sweden",
    note: "Placeholder. Owner to supply the office address for /contact; set to verified once it is real.",
  },
  linkedin: {
    status: "pending",
    value: "https://www.linkedin.com/company/cytogent/",
    note: "URL from the legacy site (source/src/content.py). Confirm it is the right page.",
  },
  affiliation: {
    status: "pending",
    value: "Cytogent is affiliated with WelloWork AB (Sweden).",
    note: "Legacy site says 'operated by' / 'the company behind'. Only 'affiliated with' may be used, after legal confirms.",
  },
  nvidiaInception: {
    status: "verified",
    value: "Member of the NVIDIA Inception Program.",
    note: "Owner asked in chat on 4 Nov 2026 for the membership badge in the footer. Badge: public/brand/partners/ (derived from NVIDIA's kit file).",
  },
  copyright: {
    status: "verified",
    value: "WelloWork AB",
    note: "Owner asked in chat on 4 Nov 2026 for '© 2026 WelloWork AB' in the footer.",
  },
  accelerators: {
    status: "pending",
    value: "Selected for two accelerator programmes in the Nordic–Baltic region.",
    note: "Do not name the programmes. NVIDIA Inception is not one of the two.",
  },
} satisfies Record<string, Fact<string>>;

export function isPublic<T>(fact: Fact<T>): boolean {
  return fact.status === "verified";
}
