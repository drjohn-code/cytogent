import { COLS, ROWS, seeded, wellStates } from "@/lib/plate";

/**
 * Static SVG version of the hero: organoid points on the left, the same idea as a well plate on the right.
 * Used on the server, under reduced motion, without WebGL, with Save-Data, and on low-power devices.
 * Decorative: the caption under the hero says what it shows.
 */
const fills = { responds: "fill-signal", resists: "fill-shift", idle: "fill-line-strong" } as const;

export function ReducedMotionFallback({ className = "" }: { className?: string }) {
  const rnd = seeded(5);
  // A budding organoid seen in section: a thick, lumpy shell around a hollow lumen.
  const dots = Array.from({ length: 420 }, () => {
    const a = rnd() * Math.PI * 2;
    const lump = 1 + 0.07 * Math.sin(5 * a + 0.6) + 0.05 * Math.sin(2 * a + 1.9) + 0.04 * Math.sin(9 * a);
    const r = (58 + 52 * Math.sqrt(rnd())) * lump;
    return { x: 150 + Math.cos(a) * r, y: 210 + Math.sin(a) * r, o: 0.3 + rnd() * 0.7, s: rnd() < 0.6 };
  });
  const states = wellStates();
  return (
    <svg viewBox="0 0 640 420" aria-hidden="true" className={`h-full w-full ${className}`}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x.toFixed(2)} cy={d.y.toFixed(2)} r="2.2" className={d.s ? "fill-signal" : "fill-shift"} opacity={d.o.toFixed(2)} />
      ))}
      <path d="M272 210 C 300 210, 306 210, 334 210" className="stroke-muted" strokeWidth="1.4" strokeDasharray="4 5" fill="none" />
      <path d="M328 204 L336 210 L328 216" className="stroke-muted" strokeWidth="1.4" fill="none" />
      <rect x="352" y="104" width="272" height="196" rx="14" className="fill-elevated stroke-line-strong" />
      {states.map((s, i) => (
        <circle
          key={i}
          cx={372 + (i % COLS) * 21.5}
          cy={124 + Math.floor(i / COLS) * 22.3}
          r="7"
          className={fills[s]}
          opacity={s === "idle" ? 0.5 : 0.9}
        />
      ))}
      <text x="352" y="330" className="fill-muted font-mono" fontSize="12">
        {`${ROWS} × ${COLS} WELLS · ILLUSTRATIVE`}
      </text>
    </svg>
  );
}
