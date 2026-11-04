import { Container } from "./Section";

/** One large sentence whose words light up as it scrolls past (CSS scroll timeline; fully visible without it). */
export function Statement({ id, text }: { id: string; text: string }) {
  return (
    <section aria-labelledby={`${id}-title`} className="py-28 sm:py-40">
      <Container>
        <h2 id={`${id}-title`} className="max-w-5xl text-3xl leading-[1.15] sm:text-5xl lg:text-[3.6rem]">
          {text.split(" ").map((w, i) => (
            <span key={i} className="word">
              {w}{" "}
            </span>
          ))}
        </h2>
      </Container>
    </section>
  );
}
