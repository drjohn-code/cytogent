/** Eight-node rail of proposed pilot deliverables (BRIEF §8 /pilot-programme). Wording is design, not completed ops. */
export const deliverables = [
  { title: "Decision brief", body: "The question, the constraints, the budget and the decision the pilot should inform." },
  { title: "Ranked batch", body: "A small set of combination experiments, each with a reason it was chosen." },
  { title: "Uncertainty map", body: "Where the ranking is confident, where it is not, and what we would decline to rank." },
  { title: "Lab coordination", body: "Assays run on authenticated models with a qualified laboratory partner." },
  { title: "QC & model update", body: "Readouts checked for quality, negatives included, then used to update the next plan." },
  { title: "Independent confirmation", body: "The most decision-relevant signals re-tested out of batch or with an orthogonal readout." },
  { title: "Executive package", body: "What to test next, what reproduced, what to stop, in plain language." },
  { title: "Audit trail", body: "A record of each choice, the data behind it and what changed it." },
];

export function DeliverableRail() {
  return (
    <ol className="relative grid gap-6 md:grid-cols-4 md:gap-x-6 md:gap-y-12">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-line md:hidden" />
      {deliverables.map((d, i) => (
        <li key={d.title} className="relative pl-8 md:pl-0">
          <span
            aria-hidden="true"
            className={`absolute top-1.5 left-0 size-[15px] rounded-full border-2 md:static md:block ${
              i === 1 ? "border-signal bg-signal" : "border-line-strong bg-canvas"
            }`}
          />
          {i % 4 !== 3 && (
            <span aria-hidden="true" className="absolute top-[7px] left-6 hidden h-px w-[calc(100%-0.5rem)] bg-line md:block" />
          )}
          <p className="font-mono text-xs text-muted md:mt-4">{String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-1 text-lg font-semibold">{d.title}</h3>
          <p className="mt-1 text-[0.95rem] text-muted">{d.body}</p>
        </li>
      ))}
    </ol>
  );
}
