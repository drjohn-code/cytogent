/**
 * Three-branch escape diagram for /science (BRIEF §5). Decorative mirror of the HTML list on the page,
 * so the SVG is aria-hidden and the list carries the meaning and the citations.
 */
const branches = [
  { y: 70, label: "ON-TARGET", line: "The drug’s own target changes" },
  { y: 180, label: "BYPASS", line: "Another growth signal takes over" },
  { y: 290, label: "CELL-STATE SHIFT", line: "The tumour changes its type" },
];

export function EscapeRoutes() {
  return (
    <figure className="glass p-4 sm:p-6">
      <svg viewBox="0 0 640 360" aria-hidden="true" className="h-auto w-full">
        <rect x="16" y="140" width="190" height="80" rx="12" className="fill-elevated stroke-line-strong" />
        <text x="111" y="174" textAnchor="middle" className="fill-text" fontSize="15" fontWeight="600">
          EGFR-mutant tumour
        </text>
        <text x="111" y="196" textAnchor="middle" className="fill-muted" fontSize="13">
          under osimertinib
        </text>
        {branches.map((b, i) => (
          <g key={b.label}>
            <path
              d={`M206 180 C 280 180, 290 ${b.y}, 360 ${b.y}`}
              fill="none"
              className={i === 0 ? "stroke-signal" : i === 1 ? "stroke-shift" : "stroke-alert"}
              strokeWidth="1.6"
              strokeDasharray="5 5"
            />
            <circle cx="360" cy={b.y} r="5" className={i === 0 ? "fill-signal" : i === 1 ? "fill-shift" : "fill-alert"} />
            <text x="378" y={b.y - 4} className="fill-text font-mono" fontSize="13">
              {b.label}
            </text>
            <text x="378" y={b.y + 18} className="fill-muted" fontSize="13">
              {b.line}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-3 text-sm text-muted">
        Real tumours can combine these routes.
      </figcaption>
    </figure>
  );
}
