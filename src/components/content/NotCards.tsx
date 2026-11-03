import { notList } from "@/content/site";

/** "What Cytogent is not": intended use in plain words, not a legal classification (BRIEF §2). */
export function NotCards() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {notList.map((item) => (
        <li key={item} className="flex gap-3 rounded-[var(--radius-card)] border border-line p-5">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-alert">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
