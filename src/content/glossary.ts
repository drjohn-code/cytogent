/** Glossary (BRIEF §8): 18 terms, 40–60 words each. DefinedTermSet JSON-LD, if emitted, reads from here. */
export interface Term {
  slug: string;
  term: string;
  definition: string;
}

export const glossary: Term[] = [
  {
    slug: "active-learning",
    term: "Active learning",
    definition:
      "A way of choosing experiments in which a model picks the next tests that are expected to teach it the most, rather than testing at random or testing everything. The results are fed back, the model updates, and it chooses again. In drug discovery it is used to reach useful answers with fewer experiments.",
  },
  {
    slug: "uncertainty-estimates",
    term: "Uncertainty estimates",
    definition:
      "A model’s statement of how sure it is about each prediction. Useful estimates let a team tell confident rankings from guesses. Whether the estimates are well calibrated, meaning stated confidence matches how often predictions turn out right, has to be tested against real outcomes. For Cytogent, that calibration is a validation goal.",
  },
  {
    slug: "abstention-zone",
    term: "Abstention zone",
    definition:
      "The set of cases where the evidence is too thin for a model to rank options responsibly. Instead of forcing a guess, the system should say it cannot rank them yet, or propose an experiment that would reduce the uncertainty. Making abstention visible is one of Cytogent’s intended operating principles.",
  },
  {
    slug: "combination-benefit",
    term: "Combination benefit",
    definition:
      "Whether two drugs given together have more effect than either drug alone, measured in the same model under the same conditions. A combination benefit in the lab is a reason to look further. It does not by itself show that the pair would help patients, or that it would be safe at the doses needed.",
  },
  {
    slug: "resistance-associated-differential-activity",
    term: "Resistance-associated differential activity",
    definition:
      "Whether a drug or combination acts differently on a resistant model than on its matched parental model, the version from before resistance developed. A difference suggests the treatment is hitting something resistance changed. The comparison is only as informative as the match between the two models.",
  },
  {
    slug: "therapeutic-window",
    term: "Therapeutic window",
    definition:
      "The range of doses or exposures at which a treatment is effective without causing unacceptable harm. Establishing it needs in vivo pharmacology and toxicology studies. A parental cancer cell line is not a stand-in for healthy tissue, so assays on cancer models cannot show a therapeutic window on their own.",
  },
  {
    slug: "pdo",
    term: "PDO (patient-derived organoid)",
    definition:
      "A small three-dimensional culture grown from a patient’s tumour tissue that can keep some features of the original tumour. Patient-derived organoids can be used to test how cancer cells respond to drugs in the lab. They are a research tool; results in organoids do not automatically predict what happens in a patient.",
  },
  {
    slug: "pdx",
    term: "PDX (patient-derived xenograft)",
    definition:
      "A model made by implanting a patient’s tumour tissue into an immunodeficient mouse, where it can grow and be studied. PDX models keep more of a tumour’s three-dimensional structure than cells in a dish, but they are slower and costlier to run, and the mouse lacks a normal human immune system.",
  },
  {
    slug: "functional-assay",
    term: "Functional assay",
    definition:
      "A laboratory test that measures what living cells do when something is done to them, for example whether they keep growing when exposed to a drug or a pair of drugs. It complements sequencing, which describes what changed in the cells but does not, by itself, show how they respond.",
  },
  {
    slug: "molecular-state",
    term: "Molecular state",
    definition:
      "A description of a tumour sample at the molecular level: for example its mutations, copy-number changes and which genes are switched on. Molecular state helps explain why a tumour behaves as it does, but two tumours with similar profiles can still respond differently to the same treatment.",
  },
  {
    slug: "treatment-history",
    term: "Treatment history",
    definition:
      "The record of which therapies a tumour, or the patient it came from, has already received, in what order and with what response. In resistance research it matters because a tumour that has escaped one drug may have changed in ways that affect how it responds to the next.",
  },
  {
    slug: "orthogonal-confirmation",
    term: "Orthogonal confirmation",
    definition:
      "Checking a result with a different kind of measurement from the one that produced it, for example confirming a growth readout with an independent assay of cell death. If two methods with different weaknesses agree, the finding is less likely to be an artefact of either method.",
  },
  {
    slug: "information-gain",
    term: "Information gain",
    definition:
      "How much an experiment is expected to reduce uncertainty about the question being asked. Experiments with high expected information gain can be worth running even when their outcome is hard to predict, because either result changes what the team believes. It is one of the quantities used to rank a batch.",
  },
  {
    slug: "decision-economics",
    term: "Decision economics",
    definition:
      "Weighing what an experiment costs in time, money and scarce material against how much its result could change a decision. An experiment that is cheap but cannot change any decision may be worth less than a costly one that could settle a go or no-go question.",
  },
  {
    slug: "audit-trail",
    term: "Audit trail",
    definition:
      "A record of each step behind a recommendation: which data was used, which model version ranked the options, what was tested, what came back and who decided what. It lets a team, a partner or a reviewer see why a choice was made and check it later.",
  },
  {
    slug: "experimental-allocation",
    term: "Experimental allocation",
    definition:
      "Deciding how to spend limited experimental resources, such as lab time, budget and patient-derived material, across the many experiments that could be run. In resistant cancer the options multiply quickly, so allocation, rather than a lack of ideas, is often the real bottleneck.",
  },
  {
    slug: "decision-as-a-service",
    term: "Decision-as-a-Service (DaaS)",
    definition:
      "Cytogent’s intended delivery model: a managed scientific service that helps a drug team reach a specific development decision, rather than software the team operates alone. It combines experiment selection, coordination with laboratory partners, learning from results and a clear recommendation. It is not a self-serve dashboard or a generic CRO.",
  },
  {
    slug: "closed-loop-experimentation",
    term: "Closed-loop experimentation",
    definition:
      "A way of working in which each round of experiments is chosen using the results of the rounds before it: plan, test, learn, repeat. Compared with running one large screen, a closed loop aims to reach a confident answer with fewer, better-chosen experiments.",
  },
];
