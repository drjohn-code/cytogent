import Image from "next/image";
import { seeded } from "@/lib/plate";

/** Small data pictures for the three bottleneck cards. */
export function BottleneckData({ kind }: { kind: "pairs" | "time" | "samples" }) {
  if (kind === "pairs") {
    // drug × drug matrix: far more pairs than any lab can test; a few light up as worth testing
    const rnd = seeded(9);
    const n = 14;
    return (
      <svg viewBox="0 0 140 140" className="h-36 w-auto" aria-hidden="true">
        {Array.from({ length: n * n }, (_, k) => {
          const r = Math.floor(k / n);
          const c = k % n;
          if (c <= r) return null;
          const v = rnd();
          const hot = v > 0.93;
          return (
            <rect
              key={k}
              x={c * 10}
              y={r * 10}
              width="9"
              height="9"
              className={hot ? "pulse-cell fill-signal" : "fill-line"}
              opacity={hot ? undefined : 0.35 + v * 0.65}
              style={hot ? { animationDelay: `${(v * 40) % 4}s` } : undefined}
            />
          );
        })}
      </svg>
    );
  }
  if (kind === "time") {
    // one assay cycle after another: weeks per readout
    const bars = [
      { x: 0, w: 46, tone: "fill-line-strong" },
      { x: 50, w: 62, tone: "fill-shift" },
      { x: 116, w: 24, tone: "fill-line-strong" },
    ];
    return (
      <svg viewBox="0 0 140 140" className="h-36 w-auto" aria-hidden="true">
        {[0, 1, 2, 3].map((row) => (
          <g key={row}>
            {bars.map((b, i) => (
              <rect key={i} x={b.x} y={18 + row * 30} width={b.w} height="10" rx="2" className={`${b.tone} story-in`} style={{ animationDelay: `${row * 200 + i * 120}ms` }} />
            ))}
          </g>
        ))}
        {[0, 35, 70, 105, 140].map((x) => (
          <line key={x} x1={x} x2={x} y1="8" y2="132" className="stroke-line" strokeWidth="0.6" />
        ))}
      </svg>
    );
  }
  return (
    <div className="relative h-36 w-56 overflow-hidden rounded-[var(--radius-control)]" aria-hidden="true">
      <Image src="/images/gen/organoid-brightfield.webp" alt="" fill sizes="224px" className="drift object-cover" />
    </div>
  );
}
