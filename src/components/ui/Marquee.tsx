/** An endless, slow strip of words (duplicated once so the loop is seamless). Pauses on hover. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-12 pr-12">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-12 font-mono text-xs tracking-[0.14em] whitespace-nowrap text-muted uppercase">
          {t}
          <span aria-hidden="true" className="size-1 rounded-full bg-signal" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee group flex overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="marquee-track flex group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
