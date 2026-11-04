import { seeded } from "@/lib/plate";

/**
 * A genome-browser view of sequencing reads over EGFR exon 20: coverage on top, reads below, and the
 * C797S change (G>C) lit in every read that carries it. Reads slide in when the card scrolls into view.
 */
const REF = "GCCCAGCTCATGCCCTTCGGCTGCCTCCTGGACTATG";
const COL = 22; // the mutated base
const W = 400;
const step = W / REF.length;

export function VariantTrack() {
  const rnd = seeded(12);
  const reads = Array.from({ length: 14 }, (_, i) => {
    const start = Math.floor(rnd() * 14);
    const len = 18 + Math.floor(rnd() * 16);
    return { row: i, start, end: Math.min(REF.length, start + len), carries: rnd() < 0.55 };
  }).filter((r) => r.start <= COL || rnd() < 0.5);
  const cover = REF.split("").map((_, c) => reads.filter((r) => r.start <= c && r.end > c).length);
  const max = Math.max(...cover);

  return (
    <svg viewBox="0 0 400 230" className="h-full w-full" aria-hidden="true">
      {/* coverage */}
      {cover.map((n, c) => (
        <rect key={c} x={c * step + 0.5} y={40 - (n / max) * 30} width={step - 1} height={(n / max) * 30} className={c === COL ? "fill-alert" : "fill-line-strong"} />
      ))}
      {/* reference */}
      {REF.split("").map((b, c) => (
        <text key={c} x={c * step + step / 2} y="58" textAnchor="middle" fontSize="8.5" className={`font-mono ${c === COL ? "fill-alert" : "fill-muted"}`}>
          {b}
        </text>
      ))}
      <line x1="0" x2={W} y1="64" y2="64" className="stroke-line" />
      {/* reads */}
      {reads.map((r, i) => {
        const y = 72 + i * 11;
        return (
          <g key={i} className="story-in" style={{ animationDelay: `${i * 70}ms` }}>
            <rect x={r.start * step} y={y} width={(r.end - r.start) * step - 1} height="7" rx="1" className="fill-line" />
            {r.carries && r.start <= COL && r.end > COL && <rect x={COL * step} y={y} width={step - 1} height="7" className="fill-alert" />}
          </g>
        );
      })}
      <line x1={COL * step + step / 2} x2={COL * step + step / 2} y1="0" y2="230" className="stroke-alert" strokeOpacity="0.35" strokeDasharray="2 3" />
      <text x={COL * step + step + 4} y="12" fontSize="9" className="fill-alert font-mono">
        C797S
      </text>
    </svg>
  );
}
