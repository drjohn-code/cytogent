/** Cytogent's intended operating principles (BRIEF §3). Replaces any vendor comparison matrix. */
const principles = [
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

/** `compact` shows titles only (home, where the word budget is tight). */
export function DesignPrinciples({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Intended operating principles</p>
      <ol className={`mt-4 grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        {principles.map((p, i) => (
          <li key={p.title} className={compact ? "flex items-baseline gap-4 border-b border-line pb-4" : "glass p-6"}>
            <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
            <h3 className={`text-lg font-semibold ${compact ? "" : "mt-2"}`}>{p.title}</h3>
            {!compact && <p className="mt-2 text-muted">{p.body}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
