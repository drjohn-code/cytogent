import { seeded } from "@/lib/plate";

/**
 * Conceptual contour of predicted effect vs uncertainty, with an abstention zone and a ranked batch.
 * No axes values, probabilities or compounds (BRIEF §6, §1.3). Meaning is also in the caption below.
 */
const W = 640;
const H = 420;
const X0 = 70;
const X1 = 610;
const Y0 = 30;
const Y1 = 360;
const ABSTAIN_Y = 118;

function candidates() {
  const rnd = seeded(23);
  return Array.from({ length: 46 }, () => ({ x: X0 + 20 + rnd() * (X1 - X0 - 40), y: Y0 + 14 + rnd() * (Y1 - Y0 - 28) }));
}

const batch = [
  { x: 438, y: 206 },
  { x: 476, y: 232 },
  { x: 402, y: 246 },
  { x: 512, y: 196 },
  { x: 454, y: 270 },
  { x: 372, y: 214 },
];

export function UncertaintyMap() {
  const clearOfLabels = (p: { x: number; y: number }) =>
    !(p.x < X0 + 300 && p.y < Y0 + 58) && !(p.x > 500 && p.y > 140 && p.y < 176);
  const pts = candidates().filter((p) => clearOfLabels(p) && !batch.some((b) => Math.hypot(b.x - p.x, b.y - p.y) < 22));
  return (
    <figure className="glass p-4 sm:p-6">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="umap-title umap-desc" className="h-auto w-full">
        <title id="umap-title">Conceptual uncertainty map</title>
        <desc id="umap-desc">
          Candidate combinations scattered by predicted effect (left to right) and uncertainty (bottom to top). Nested
          contours mark where an experiment is expected to be most informative. A ranked batch of six candidates sits
          inside them. The top band is an abstention zone, where the evidence is too thin to rank. Illustration only, no
          data.
        </desc>
        <defs>
          <pattern id="umap-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" className="stroke-line-strong" strokeWidth="1.2" opacity="0.5" />
          </pattern>
          <marker id="umap-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M0 0L8 4L0 8z" className="fill-muted" />
          </marker>
        </defs>

        {/* abstention zone */}
        <rect x={X0} y={Y0} width={X1 - X0} height={ABSTAIN_Y - Y0} fill="url(#umap-hatch)" />
        <line x1={X0} x2={X1} y1={ABSTAIN_Y} y2={ABSTAIN_Y} className="stroke-alert" strokeWidth="1" strokeDasharray="4 5" />
        <text x={X0 + 14} y={Y0 + 26} className="fill-alert font-mono" fontSize="13">
          ABSTENTION ZONE
        </text>
        <text x={X0 + 14} y={Y0 + 46} className="fill-muted" fontSize="13">
          Too uncertain to rank: say so, or test to learn
        </text>

        {/* contours of expected information (illustrative) */}
        {[
          { s: 1, o: 0.25 },
          { s: 0.72, o: 0.45 },
          { s: 0.46, o: 0.8 },
        ].map(({ s, o }) => (
          <ellipse
            key={s}
            cx="445"
            cy="234"
            rx={170 * s}
            ry={96 * s}
            transform="rotate(-14 445 234)"
            fill="none"
            className="stroke-signal"
            strokeWidth="1.4"
            opacity={o}
          />
        ))}

        {/* candidates */}
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            className={p.y < ABSTAIN_Y ? "fill-none stroke-muted" : "fill-muted"}
            strokeWidth="1.2"
            opacity={p.y < ABSTAIN_Y ? 0.8 : 0.45}
          />
        ))}

        {/* ranked batch */}
        {batch.map((b, i) => (
          <g key={i}>
            <circle cx={b.x} cy={b.y} r="10" className="fill-none stroke-signal" strokeWidth="1.2" />
            <circle cx={b.x} cy={b.y} r="5.5" className="fill-signal" />
          </g>
        ))}
        <path d="M519 189 L548 166" className="stroke-signal" strokeWidth="1" />
        <text x="604" y="160" className="fill-signal font-mono" fontSize="13" textAnchor="end">
          RANKED BATCH
        </text>

        {/* axes, no ticks or values */}
        <line x1={X0} y1={Y1} x2={X1} y2={Y1} className="stroke-muted" strokeWidth="1.2" markerEnd="url(#umap-arrow)" />
        <line x1={X0} y1={Y1} x2={X0} y2={Y0} className="stroke-muted" strokeWidth="1.2" markerEnd="url(#umap-arrow)" />
        <text x={X1} y={Y1 + 30} textAnchor="end" className="fill-muted" fontSize="13">
          Predicted combination effect
        </text>
        <text x={-Y0} y={X0 - 22} transform="rotate(-90)" textAnchor="end" className="fill-muted" fontSize="13">
          Uncertainty
        </text>
      </svg>
      <figcaption className="mt-3 text-sm text-muted">
        Where uncertainty is too high, the honest output is “we can’t rank this yet”.
      </figcaption>
    </figure>
  );
}
