import { notList } from "@/content/site";
import { toneStyle } from "@/components/ui/Icon";

/** "What Cytogent is not": intended use in plain words, not a legal classification (BRIEF §2). */
export function NotCards() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notList.map((item) => (
        <li key={item} data-spot className="card flex items-start gap-4 p-5" style={toneStyle("alert")}>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="icon-badge icon-badge-sm p-2.5 text-alert">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
