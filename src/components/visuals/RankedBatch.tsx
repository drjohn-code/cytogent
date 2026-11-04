import Image from "next/image";

/**
 * What a ranked batch looks like: candidates ordered by what they would teach, each with its uncertainty,
 * one the system declines to rank, and one finding re-tested before it counts. Labels are placeholders.
 */
const rows = [
  { pair: "Drug A + B", value: 0.86, spread: 0.08, status: "Confirmed", tone: "text-actin" },
  { pair: "Drug A + C", value: 0.71, spread: 0.12, status: "In test", tone: "text-signal" },
  { pair: "Drug A + D", value: 0.58, spread: 0.18, status: "Queued", tone: "text-muted" },
  { pair: "Drug B + C", value: 0.44, spread: 0.2, status: "Queued", tone: "text-muted" },
];

export function RankedBatch() {
  return (
    <div className="reveal relative overflow-hidden rounded-[var(--radius-card)] border border-line">
      <Image src="/images/gen/organoid-brightfield.webp" alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="drift object-cover opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--canvas)_30%,transparent),var(--canvas)_85%)]" />
      <div className="relative flex min-h-[520px] flex-col justify-end p-5 sm:p-8">
        <div className="glass p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-xs tracking-[0.14em] text-signal uppercase">Ranked batch · wave 2</p>
            <p className="font-mono text-xs text-muted">expected information</p>
          </div>
          <ul className="mt-5 space-y-4">
            {rows.map((r) => (
              <li key={r.pair} className="grid grid-cols-[6.5rem_1fr_5.5rem] items-center gap-3 text-sm sm:grid-cols-[8rem_1fr_6rem]">
                <span className="font-medium">{r.pair}</span>
                <span className="relative h-2 rounded-full bg-line">
                  <span className="fill-bar absolute inset-y-0 left-0 rounded-full bg-signal/80" style={{ width: `${r.value * 100}%` }} />
                  {/* uncertainty whisker */}
                  <span
                    className="absolute top-1/2 h-3 -translate-y-1/2 border-x border-text/70"
                    style={{ left: `${(r.value - r.spread) * 100}%`, width: `${r.spread * 200}%` }}
                  />
                </span>
                <span className={`text-right font-mono text-xs ${r.tone}`}>{r.status}</span>
              </li>
            ))}
            <li className="grid grid-cols-[6.5rem_1fr_5.5rem] items-center gap-3 text-sm opacity-70 sm:grid-cols-[8rem_1fr_6rem]">
              <span className="font-medium">Drug A + E</span>
              <span className="h-2 rounded-full bg-[repeating-linear-gradient(90deg,var(--line-strong)_0_6px,transparent_6px_12px)]" />
              <span className="text-right font-mono text-xs text-alert">Abstain</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
