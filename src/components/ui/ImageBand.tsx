import { ColourLens } from "@/components/hero/ColourLens";
import { Container } from "./Section";

/** A full-width image with one short statement over it, revealed in colour by a lens that follows the pointer. */
export function ImageBand({ id, src, eyebrow, title, align = "left" }: { id: string; src: string; eyebrow: string; title: string; align?: "left" | "right" }) {
  const shade =
    align === "left"
      ? "bg-[linear-gradient(90deg,var(--canvas)_8%,color-mix(in_srgb,var(--canvas)_45%,transparent)_55%,transparent)]"
      : "bg-[linear-gradient(270deg,var(--canvas)_8%,color-mix(in_srgb,var(--canvas)_45%,transparent)_55%,transparent)]";
  return (
    <section aria-labelledby={`${id}-title`} className="relative isolate overflow-hidden border-y border-line">
      <div className="absolute inset-0 -z-10">
        <ColourLens src={src} lens={240} align="center" />
      </div>
      <div aria-hidden="true" className={`absolute inset-0 -z-10 ${shade}`} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--canvas),transparent_20%,transparent_80%,var(--canvas))]" />
      <Container className={`flex py-32 sm:py-48 ${align === "right" ? "justify-end text-right" : ""}`}>
        <div className="max-w-2xl">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`} className="mt-5 text-4xl sm:text-6xl">
            {title}
          </h2>
        </div>
      </Container>
    </section>
  );
}
