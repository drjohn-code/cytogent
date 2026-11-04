import { HoverZoom } from "./HoverZoom";

/** Two multiplex-stained tissue cores side by side, on a measurement crosshair, with a slow scan line. */
const cores = [
  { src: "/images/gen/tissue-multiplex.webp", label: "Before treatment", code: "T0" },
  { src: "/images/gen/tissue-multiplex-resistant.webp", label: "At resistance", code: "T1" },
];

const markers = [
  { name: "Tumour", tone: "bg-signal" },
  { name: "Resistant clone", tone: "bg-shift" },
  { name: "Stroma", tone: "bg-dose" },
  { name: "T cells", tone: "bg-marker" },
  { name: "DNA", tone: "bg-dapi" },
];

export function TissueCores() {
  return (
    <div className="relative overflow-x-clip px-6 sm:px-0">
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-6 lg:gap-16">
        {cores.map((c) => (
          <figure key={c.code} className="reveal relative">
            <div className="relative mx-auto aspect-square w-full max-w-[520px]">
              {/* crosshair */}
              <span aria-hidden="true" className="absolute top-1/2 -right-6 -left-6 h-px bg-line-strong/60" />
              <span aria-hidden="true" className="absolute -top-6 -bottom-6 left-1/2 w-px bg-line-strong/60" />
              <div className="core-zoom absolute inset-0 rounded-full">
                <HoverZoom src={c.src} sizes="(min-width: 1024px) 520px, (min-width: 640px) 45vw, 90vw" className="object-cover" />
                <span aria-hidden="true" className="core-scan absolute inset-x-0 h-24" />
              </div>
              <span aria-hidden="true" className="absolute top-1/2 left-1/2 size-5 -translate-1/2 rounded-full border border-text/80" />
              <span className="absolute top-2 left-0 font-mono text-xs text-muted">{c.code}</span>
            </div>
            <figcaption className="mt-6 text-center font-mono text-xs tracking-[0.14em] text-muted uppercase">{c.label}</figcaption>
          </figure>
        ))}
      </div>
      <ul aria-label="Stains" className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
        {markers.map((m) => (
          <li key={m.name} className="inline-flex items-center gap-2">
            <span aria-hidden="true" className={`h-px w-6 ${m.tone}`} />
            {m.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
