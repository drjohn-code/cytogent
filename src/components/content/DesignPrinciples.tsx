/** Cytogent's operating principles (BRIEF §3). Replaces any vendor comparison matrix. */
const principles: { title: string; body: string }[] = [
  {
    title: "Bounded experimental batches",
    body: "Each round is a small, feasible batch chosen for what it can teach, not an open-ended screen.",
  },
  {
    title: "Visible uncertainty and abstention",
    body: "Every ranking carries an uncertainty estimate. Where the evidence is too thin, the system should say so rather than guess.",
  },
  {
    title: "Planned reproducibility",
    body: "A signal counts once it has been seen again: out of batch, or with an orthogonal readout.",
  },
  {
    title: "Project-specific data governance",
    body: "Each sponsor's data stays in its own project, under the terms agreed for that project.",
  },
];

/** `compact`: one column of numbered rows (home, beside the ranked batch). */
export function DesignPrinciples({ compact = false }: { compact?: boolean }) {
  return (
    <ol className={compact ? "border-t border-line" : "grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2"}>
      {principles.map((p, i) => (
        <li key={p.title} data-spot className={compact ? "grid grid-cols-[3rem_1fr] border-b border-line py-6" : "bg-canvas p-8"}>
          <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
          <div className={compact ? "" : "mt-6"}>
            <h3 className="text-lg font-normal">{p.title}</h3>
            <p className="mt-1 text-muted">{p.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
