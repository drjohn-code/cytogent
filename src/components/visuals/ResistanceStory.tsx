import { seeded } from "@/lib/plate";

/** Three-frame resistance story for /for-people. Each frame's text is real HTML; the drawings are decorative. */
const frames = [
  { title: "1. The drug works", body: "Most of the tumour’s cells depend on the signal the drug blocks, so the tumour shrinks." },
  { title: "2. A few cells adapt", body: "Some cells survive. They may change the drug’s target, switch to another growth signal, or change type." },
  { title: "3. The tumour returns, changed", body: "The survivors grow back. The tumour now responds differently, and the same drug no longer works as well." },
];

function cells(frame: number) {
  const rnd = seeded(31);
  return Array.from({ length: 70 }, () => {
    const a = rnd() * Math.PI * 2;
    const r = Math.sqrt(rnd()) * 62;
    const resistant = rnd() < 0.12;
    return { x: 80 + Math.cos(a) * r, y: 80 + Math.sin(a) * r, resistant, keep: rnd() };
  }).map((c) => {
    if (frame === 0) return { ...c, show: true, shift: c.resistant };
    if (frame === 1) return { ...c, show: c.resistant, shift: true };
    return { ...c, show: c.resistant || c.keep < 0.75, shift: c.resistant || c.keep < 0.75 };
  });
}

export function ResistanceStory() {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {frames.map((f, i) => (
        <li key={f.title} className="glass p-5">
          <svg viewBox="0 0 160 160" aria-hidden="true" className="mx-auto h-auto w-full max-w-[200px]">
            <circle cx="80" cy="80" r="74" className="fill-none stroke-line" strokeWidth="1" strokeDasharray="3 5" />
            {cells(i).map((c, k) =>
              c.show ? (
                <circle key={k} cx={c.x.toFixed(1)} cy={c.y.toFixed(1)} r="4.2" className={c.shift ? "fill-shift" : "fill-signal"} opacity="0.9" />
              ) : (
                <circle key={k} cx={c.x.toFixed(1)} cy={c.y.toFixed(1)} r="4.2" className="fill-none stroke-line-strong" strokeWidth="0.8" opacity="0.5" />
              ),
            )}
          </svg>
          <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
          <p className="mt-2 text-muted">{f.body}</p>
        </li>
      ))}
    </ol>
  );
}
