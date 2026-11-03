/** Four-track ecosystem around the loop (/partners). Decorative mirror of the track list on the page. */
const tracks = [
  { x: 40, y: 40, label: "SPONSORS", line: "bring the question" },
  { x: 420, y: 40, label: "EXECUTION LABS", line: "run the assays" },
  { x: 40, y: 250, label: "BIOBANKS & MODELS", line: "supply living biology" },
  { x: 420, y: 250, label: "VALIDATION LABS", line: "confirm independently" },
];

export function TrackArchitecture() {
  return (
    <figure className="glass p-4 sm:p-6">
      <svg viewBox="0 0 640 340" aria-hidden="true" className="h-auto w-full">
        {tracks.map((t) => (
          <g key={t.label}>
            <path
              d={`M${t.x + 90} ${t.y + 30} L320 170`}
              className="stroke-line-strong"
              strokeWidth="1.2"
              strokeDasharray="4 5"
            />
            <rect x={t.x} y={t.y} width="180" height="60" rx="10" className="fill-elevated stroke-line-strong" />
            <text x={t.x + 16} y={t.y + 26} className="fill-text font-mono" fontSize="12">
              {t.label}
            </text>
            <text x={t.x + 16} y={t.y + 46} className="fill-muted" fontSize="13">
              {t.line}
            </text>
          </g>
        ))}
        <circle cx="320" cy="170" r="54" className="fill-canvas stroke-signal" strokeWidth="1.4" />
        <text x="320" y="166" textAnchor="middle" className="fill-signal font-mono" fontSize="12">
          THE LOOP
        </text>
        <text x="320" y="186" textAnchor="middle" className="fill-muted" fontSize="12">
          Cytogent
        </text>
      </svg>
      <figcaption className="mt-3 text-sm text-muted">
        How the tracks connect. It does not show signed partners.
      </figcaption>
    </figure>
  );
}
