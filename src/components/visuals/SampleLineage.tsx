/** Sample → model → assay lineage (/partners/biobanks). Conceptual; the page text carries the meaning. */
const steps = [
  { label: "CONSENTED SAMPLE", line: "with usage rights" },
  { label: "TREATMENT CONTEXT", line: "before and after therapy" },
  { label: "LIVING MODEL", line: "organoid or other PDM" },
  { label: "FUNCTIONAL READOUT", line: "with lineage recorded" },
];

export function SampleLineage() {
  return (
    <figure className="glass p-4 sm:p-6">
      <svg viewBox="0 0 360 400" aria-hidden="true" className="mx-auto h-auto w-full max-w-sm">
        <line x1="40" y1="40" x2="40" y2="350" className="stroke-line-strong" strokeWidth="1.2" strokeDasharray="4 5" />
        {steps.map((s, i) => {
          const y = 40 + i * 103;
          return (
            <g key={s.label}>
              <circle cx="40" cy={y} r={i === 3 ? 9 : 7} className={i === 3 ? "fill-signal" : "fill-canvas stroke-line-strong"} strokeWidth="1.5" />
              <text x="66" y={y - 2} className="fill-text font-mono" fontSize="12">
                {s.label}
              </text>
              <text x="66" y={y + 18} className="fill-muted" fontSize="13">
                {s.line}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-sm text-muted">Conceptual lineage. No real samples or patients.</figcaption>
    </figure>
  );
}
