import Image from "next/image";

/** Four wells under the microscope, side by side: untreated, each drug alone, and the pair. */
const wells: { condition: string; label: string; live: number; tone: string }[] = [
  { condition: "control", label: "Untreated", live: 0.96, tone: "bg-actin" },
  { condition: "drug-a", label: "Drug A", live: 0.5, tone: "bg-signal" },
  { condition: "drug-b", label: "Drug B", live: 0.76, tone: "bg-dose" },
  { condition: "combo", label: "A + B", live: 0.16, tone: "bg-marker" },
];

export function CombinationWells() {
  return (
    <div className="glass reveal relative overflow-hidden p-4 sm:p-8">
      <div className="pointer-events-none absolute -top-32 left-1/3 size-96 rounded-full bg-dapi/10 blur-3xl" />
      <ul className="group/wells relative grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {wells.map((w, i) => (
          <li key={w.condition} className="transition duration-500 group-hover/wells:opacity-50 hover:!opacity-100 hover:-translate-y-1">
            <div className="relative aspect-square overflow-hidden rounded-full border border-line-strong/60 bg-[radial-gradient(circle,var(--elevated),var(--canvas))] shadow-[inset_0_0_40px_var(--canvas)]">
              <Image
                src={`/images/gen/well-${w.condition}.webp`}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className={`object-cover ${i % 2 ? "core-turn-rev" : "core-turn"}`}
              />
              <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_30px_12px_var(--canvas)]" />
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-2">
              <span className="font-semibold">{w.label}</span>
              <span className="font-mono text-xs text-muted">live cells</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
              <div className={`fill-bar h-full rounded-full ${w.tone}`} style={{ width: `${w.live * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <div className="relative mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-dapi" /> DNA
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-actin" /> Actin
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-marker" /> Cell death
        </span>
      </div>
    </div>
  );
}
