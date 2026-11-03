import { pageGraph } from "@/lib/jsonld";

/** JSON-LD for a manifest route. `<` is escaped so the payload cannot close the script tag. */
export function PageJsonLd({ path }: { path: string }) {
  const json = JSON.stringify(pageGraph(path)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
