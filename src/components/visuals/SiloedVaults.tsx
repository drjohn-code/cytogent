/** Siloed project vaults for /data-governance. Labelled as intended design; the page text carries the meaning. */
const vaults = ["PROJECT A", "PROJECT B", "PROJECT C"];

export function SiloedVaults() {
  return (
    <figure className="glass p-4 sm:p-6">
      <svg viewBox="0 0 640 330" aria-hidden="true" className="h-auto w-full">
        {vaults.map((v, i) => {
          const x = 30 + i * 205;
          return (
            <g key={v}>
              <rect x={x} y="30" width="170" height="130" rx="12" className="fill-elevated stroke-line-strong" />
              <text x={x + 16} y="58" className="fill-text font-mono" fontSize="12">
                {v}
              </text>
              <text x={x + 16} y="80" className="fill-muted" fontSize="12">
                own data, own terms
              </text>
              <rect x={x + 16} y="100" width="138" height="40" rx="8" className="fill-none stroke-line" strokeDasharray="3 4" />
              <text x={x + 85} y="125" textAnchor="middle" className="fill-muted font-mono" fontSize="11">
                AUDIT LOG
              </text>
              <path d={`M${x + 85} 160 L${x + 85} 214`} className="stroke-line-strong" strokeWidth="1.2" />
              <rect x={x + 60} y="200" width="50" height="26" rx="6" className="fill-canvas stroke-signal" />
              <text x={x + 85} y="218" textAnchor="middle" className="fill-signal font-mono" fontSize="10">
                GATE
              </text>
              <path d={`M${x + 85} 226 L320 268`} className="stroke-signal" strokeWidth="1" strokeDasharray="4 5" />
            </g>
          );
        })}
        <rect x="230" y="268" width="180" height="44" rx="10" className="fill-canvas stroke-signal" />
        <text x="320" y="295" textAnchor="middle" className="fill-text" fontSize="13">
          Loop, per project
        </text>
      </svg>
      <figcaption className="mt-3 text-sm text-muted">
        Intended design, not a description of audited systems. Each project reaches the loop only through its own
        permission gate.
      </figcaption>
    </figure>
  );
}
