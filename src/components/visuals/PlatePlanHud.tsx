import { ConceptualTag } from "@/components/ui/Section";
import { COLS, ROWS, batchWells } from "@/lib/plate";

/** "Decision brief → plate plan" HUD for /for-drug-developers. Illustrative fields; no numbers or compounds. */
const brief = [
  ["Question", "Which partner drug is worth testing against this resistance context?"],
  ["Models", "Authenticated resistant models, with matched parental controls"],
  ["Budget", "One bounded batch"],
  ["Decision", "Go, adjust or stop before the next wave"],
];

export function PlatePlanHud() {
  const { selected, controls } = batchWells();
  return (
    <figure className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
      <div className="glass p-5">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-signal">Decision brief</p>
        <dl className="mt-4 space-y-3 text-sm">
          {brief.map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-xs uppercase tracking-[0.1em] text-muted">{k}</dt>
              <dd className="mt-0.5">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto size-6 rotate-90 text-signal sm:rotate-0">
        <path d="M4 12h15M14 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>

      <div className="glass p-5">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-signal">Plate plan</p>
        <svg
          viewBox={`0 0 ${COLS * 20 + 8} ${ROWS * 20 + 8}`}
          role="img"
          aria-label="Illustrative plate layout: a small selected batch of wells, with control wells in the outer columns."
          className="mt-4 h-auto w-full max-w-[360px]"
        >
          <rect x="1" y="1" width={COLS * 20 + 6} height={ROWS * 20 + 6} rx="8" className="fill-none stroke-line-strong" />
          {Array.from({ length: ROWS * COLS }, (_, i) => {
            const cx = 14 + (i % COLS) * 20;
            const cy = 14 + Math.floor(i / COLS) * 20;
            if (selected.has(i)) return <circle key={i} cx={cx} cy={cy} r="6.5" className="fill-signal" />;
            if (controls.has(i)) return <circle key={i} cx={cx} cy={cy} r="6" className="fill-none stroke-shift" strokeWidth="1.4" />;
            return <circle key={i} cx={cx} cy={cy} r="6" className="fill-none stroke-line" strokeWidth="1.2" />;
          })}
        </svg>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-signal" /> selected batch
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2.5 rounded-full border border-shift" /> controls
          </span>
        </div>
      </div>
      <figcaption className="sm:col-span-3">
        <ConceptualTag>Illustrative layout, not a protocol</ConceptualTag>
      </figcaption>
    </figure>
  );
}
