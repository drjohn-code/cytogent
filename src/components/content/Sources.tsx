import { references, referencesDisclaimer } from "@/content/references";

/** Numbered sources. In-text markers use <Cite n={…}/> with the same order as `ids`. */
export function Sources({ ids }: { ids: string[] }) {
  return (
    <section aria-labelledby="sources-title" className="border-t border-line pt-10">
      <h2 id="sources-title" className="text-2xl font-semibold">
        Sources
      </h2>
      <p className="mt-2 text-sm text-muted">{referencesDisclaimer}</p>
      <ol className="mt-6 space-y-4">
        {ids.map((id, i) => {
          const r = references[id];
          return (
            <li key={id} id={`source-${i + 1}`} className="grid grid-cols-[2rem_1fr] gap-2 text-[0.95rem]">
              <span className="font-mono text-muted">[{i + 1}]</span>
              <span>
                {r.citation}{" "}
                <span className="text-muted">({r.kind})</span>{" "}
                <a href={r.url} rel="noopener noreferrer" className="inline-block min-h-6 break-all text-signal underline underline-offset-4">
                  {r.url.replace(/^https:\/\//, "")}
                </a>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function Cite({ n }: { n: number }) {
  return (
    <sup>
      <a href={`#source-${n}`} className="ml-0.5 font-mono text-xs text-signal no-underline hover:underline" aria-label={`Source ${n}`}>
        [{n}]
      </a>
    </sup>
  );
}
