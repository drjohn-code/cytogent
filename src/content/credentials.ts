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
    status: "pending",
    value: "info@cytogent.com",
    note: "Legacy README: cytogent.com had no MX records; the legacy form mailed request@. Confirm the mailbox exists and is read.",
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
    status: "pending",
    value: "Member of the NVIDIA Inception Program.",
    note: "Needs written confirmation of membership AND badge-use rights. Badge files exist in source/static/brand/ (legacy).",
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
