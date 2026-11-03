/**
 * Citation registry (BRIEF §8). Appendix A was empty, so each source was located by its description in the brief.
 * Checked 3 November 2026: every URL was fetched (HTTP 200 after redirects); journal metadata confirmed on Crossref.
 * How each was found and any quirks are in `checked`. These describe the scientific field, not Cytogent performance.
 */
export interface Reference {
  id: string;
  kind: "review" | "primary study" | "reference" | "database" | "guideline";
  citation: string;
  url: string;
  checked: string;
}

export const referencesDisclaimer =
  "These primary sources describe the scientific field, not Cytogent product performance.";

export const references: Record<string, Reference> = {
  "REF-01": {
    id: "REF-01",
    kind: "review",
    citation:
      "Leonetti A, Sharma S, Minari R, Perego P, Giovannetti E, Tiseo M. Resistance mechanisms to osimertinib in EGFR-mutated non-small cell lung cancer. British Journal of Cancer. 2019;121(9):725–737.",
    url: "https://doi.org/10.1038/s41416-019-0573-8",
    checked: "DOI resolves to nature.com; title, authors, volume and pages from Crossref.",
  },
  "REF-02": {
    id: "REF-02",
    kind: "reference",
    citation:
      "PDQ Adult Treatment Editorial Board. Non-Small Cell Lung Cancer Treatment (PDQ®) – Health Professional Version. National Cancer Institute.",
    url: "https://www.cancer.gov/types/lung/hp/non-small-cell-lung-treatment-pdq",
    checked: "Page title confirmed. Continuously updated; no fixed date.",
  },
  "REF-03": {
    id: "REF-03",
    kind: "reference",
    citation: "National Cancer Institute. Drug resistance. NCI Dictionary of Cancer Terms.",
    url: "https://www.cancer.gov/publications/dictionaries/cancer-terms/def/drug-resistance",
    checked: "HTTP 200.",
  },
  "REF-04": {
    id: "REF-04",
    kind: "reference",
    citation: "World Health Organization. Lung cancer. Fact sheet.",
    url: "https://www.who.int/news-room/fact-sheets/detail/lung-cancer",
    checked: "HTTP 200. Figures on that page change over time; this site quotes none of them.",
  },
  "REF-05": {
    id: "REF-05",
    kind: "primary study",
    citation:
      "Kim M, Mun H, Sung CO, et al. Patient-derived lung cancer organoids as in vitro cancer models for therapeutic screening. Nature Communications. 2019;10:3991.",
    url: "https://doi.org/10.1038/s41467-019-11867-6",
    checked: "DOI resolves to nature.com; metadata from Crossref.",
  },
  "REF-06": {
    id: "REF-06",
    kind: "database",
    citation:
      "Perova Z, Martinez M, Mandloi T, et al. PDCM Finder: an open global research platform for patient-derived cancer models. Nucleic Acids Research. 2023;51(D1):D1360–D1366. (The resource now operates as CancerModels.org.)",
    url: "https://doi.org/10.1093/nar/gkac1021",
    checked:
      "cancermodels.org now redirects to an EMBL-EBI BioStudies collection, so the peer-reviewed resource paper is cited instead. DOI resolves to academic.oup.com (which returns 403 to scripts, 200 in a browser); metadata from Crossref.",
  },
  "REF-07": {
    id: "REF-07",
    kind: "reference",
    citation: "U.S. Food and Drug Administration. Oncology (Cancer)/Hematologic Malignancies Approval Notifications.",
    url: "https://www.fda.gov/drugs/resources-information-approved-drugs/oncology-cancerhematologic-malignancies-approval-notifications",
    checked: "The FDA moved this page (old slug redirects); new URL used. Page title confirmed.",
  },
  "REF-08": {
    id: "REF-08",
    kind: "review",
    citation:
      "Reker D, Schneider G. Active-learning strategies in computer-assisted drug discovery. Drug Discovery Today. 2015;20(4):458–465.",
    url: "https://doi.org/10.1016/j.drudis.2014.12.004",
    checked: "DOI resolves to Elsevier; metadata from Crossref.",
  },
  "REF-09": {
    id: "REF-09",
    kind: "guideline",
    citation:
      "Markossian S, Grossman A, et al., editors. Assay Guidance Manual. Bethesda (MD): Eli Lilly & Company and the National Center for Advancing Translational Sciences; 2004–.",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK53196/",
    checked: "HTTP 200, but NCBI served a bot check to the script, so the title was not read automatically. Editors as listed on NCBI Bookshelf; recheck in a browser.",
  },
};
