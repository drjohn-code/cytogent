/** The decision-and-learning loop (BRIEF §3). Labels are fixed, including the spelling of PRIORITIZE. */
export const loopSteps = [
  { label: "DEFINE", line: "Frame the resistance question, the constraints and the experimental budget." },
  { label: "CONNECT", line: "Bring molecular state, treatment history and baseline assay context into one structured view." },
  { label: "PRIORITIZE", line: "Rank a feasible batch by expected information, with explicit uncertainty and the option to abstain." },
  { label: "TEST", line: "Coordinate functional assays on authenticated living models with qualified laboratory partners." },
  { label: "LEARN", line: "Take in quality-checked readouts, negatives included, and update the next plan." },
  { label: "CONFIRM", line: "Seek reproduction out of batch or with an orthogonal readout, then deliver an auditable recommendation." },
] as const;
