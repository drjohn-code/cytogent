import type { CSSProperties, ReactNode } from "react";

/**
 * Line icons for feature cards: 24px grid, 1.6 stroke, round joins, drawn in currentColor.
 * Decorative only (aria-hidden): the card heading always carries the meaning.
 */
const paths = {
  /* Principles */
  wells: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" />
      <circle cx="7.5" cy="7.5" r="1.6" />
      <circle cx="12" cy="7.5" r="1.6" fill="currentColor" />
      <circle cx="16.5" cy="7.5" r="1.6" />
      <circle cx="7.5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="16.5" cy="12" r="1.6" />
      <circle cx="7.5" cy="16.5" r="1.6" />
      <circle cx="12" cy="16.5" r="1.6" />
      <circle cx="16.5" cy="16.5" r="1.6" fill="currentColor" />
    </>
  ),
  uncertainty: (
    <>
      <path d="M2.5 20.5h19" />
      <path d="M3 18.5c3.2 0 4.2-12 9-12s5.8 12 9 12" />
      <path d="M12 6.5v14" strokeDasharray="1.6 2.2" />
      <path d="M7.5 13h-1.5M17.5 13H16" />
    </>
  ),
  repeat: (
    <>
      <path d="M17 2.5l3 3-3 3" />
      <path d="M4 11.5v-2a4 4 0 0 1 4-4h12" />
      <path d="M7 21.5l-3-3 3-3" />
      <path d="M20 12.5v2a4 4 0 0 1-4 4H4" />
    </>
  ),
  shieldLock: (
    <>
      <path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z" />
      <rect x="9" y="11" width="6" height="5" rx="1" />
      <path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" />
    </>
  ),

  /* Gates and horizons */
  magnet: (
    <>
      <path d="M5 3.5h4v7.5a3 3 0 0 0 6 0V3.5h4V11a7 7 0 0 1-14 0z" />
      <path d="M5 7.5h4M15 7.5h4" />
    </>
  ),
  cells: (
    <>
      <circle cx="8.5" cy="9" r="5" />
      <circle cx="16.5" cy="8" r="3.5" />
      <circle cx="13.5" cy="17" r="4" />
      <circle cx="8.5" cy="9" r="1.2" fill="currentColor" />
      <circle cx="13.5" cy="17" r="1" fill="currentColor" />
    </>
  ),
  compare: (
    <>
      <path d="M3 20.5h18" />
      <rect x="4.5" y="11" width="3" height="9.5" rx="1" />
      <rect x="8.5" y="6" width="3" height="14.5" rx="1" fill="currentColor" fillOpacity="0.25" />
      <rect x="13.5" y="13" width="3" height="7.5" rx="1" />
      <rect x="17.5" y="4" width="3" height="16.5" rx="1" fill="currentColor" fillOpacity="0.25" />
    </>
  ),
  trend: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 6-6" />
      <path d="M16 8h4v4" />
    </>
  ),
  network: (
    <>
      <circle cx="5.5" cy="6" r="2.5" />
      <circle cx="18.5" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M8 6h8M7 8.2l3.8 7.6M17 8.2l-3.8 7.6" />
    </>
  ),
  waves: (
    <>
      <path d="M2 7c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
      <path d="M2 12c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
      <path d="M2 17c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    </>
  ),
  branch: (
    <>
      <circle cx="6" cy="5" r="2.2" />
      <circle cx="6" cy="19" r="2.2" />
      <circle cx="18" cy="7" r="2.2" />
      <path d="M6 7.2v9.6" />
      <path d="M18 9.2v.8a5 5 0 0 1-5 5H9a3 3 0 0 0-3 1.8" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 4.5-9 4.5-9-4.5z" />
      <path d="M3 12l9 4.5 9-4.5" />
      <path d="M3 16.5l9 4.5 9-4.5" />
    </>
  ),

  /* Decisions */
  ranked: (
    <>
      <path d="M4 6h13M4 12h9M4 18h5" />
      <path d="M15 15l3 3-3 3" />
      <path d="M12 18h6" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.7 2.7L16.2 9.6" />
    </>
  ),
  stop: (
    <>
      <path d="M8.2 2.5h7.6l5.7 5.7v7.6l-5.7 5.7H8.2l-5.7-5.7V8.2z" />
      <path d="M8 12h8" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21.5V3.5" />
      <path d="M5 4h12.5l-2.5 4.5 2.5 4.5H5" />
    </>
  ),

  /* Biology */
  dna: (
    <>
      <path d="M7 2.5c0 4.8 10 4.8 10 9.5s-10 4.7-10 9.5" />
      <path d="M17 2.5c0 4.8-10 4.8-10 9.5s10 4.7 10 9.5" />
      <path d="M8.6 5.5h6.8M8.6 18.5h6.8" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </>
  ),
  bypass: (
    <>
      <path d="M2.5 17h4.5M17 17h2.5" />
      <path d="M12 14v6" />
      <path d="M7 17c0-7.5 10-7.5 10 0" />
      <path d="M19 15l2 2-2 2" />
    </>
  ),
  shift: (
    <>
      <circle cx="6" cy="12" r="3.5" />
      <path d="M10.5 12h3.5M12.5 10l2 2-2 2" />
      <path d="M18.5 8.5l3 1.75v3.5l-3 1.75-3-1.75v-3.5z" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" />
      <path d="M7.4 15h9.2" />
    </>
  ),
  flaskCheck: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" />
      <path d="M9.5 16.2l1.8 1.8 3.4-3.4" />
    </>
  ),
  vials: (
    <>
      <path d="M5 3h6M13 3h6" />
      <path d="M6 3v14a2 2 0 0 0 4 0V3M14 3v14a2 2 0 0 0 4 0V3" />
      <path d="M6 11h4M14 14h4" />
    </>
  ),
  microscope: (
    <>
      <path d="M6 18h8M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </>
  ),

  /* Governance */
  vault: (
    <>
      <rect x="3" y="4" width="18" height="15" rx="2" />
      <circle cx="11" cy="11.5" r="3.5" />
      <path d="M11 8v1M11 14v1M17.5 9.5v4M6 19v1.5M18 19v1.5" />
    </>
  ),
  key: (
    <>
      <circle cx="7.5" cy="12" r="3.8" />
      <path d="M11.3 12H21M18 12v3M15 12v2" />
    </>
  ),
  lineage: (
    <>
      <circle cx="12" cy="4.5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="6" cy="19.5" r="2" />
      <circle cx="18" cy="19.5" r="2" />
      <path d="M12 6.5v3.5M10.8 13.6l-3.6 4.3M13.2 13.6l3.6 4.3" />
    </>
  ),
  consent: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 14l2 2 4-4" />
    </>
  ),
  userOff: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      <path d="M3 3l18 18" />
    </>
  ),
  separate: (
    <>
      <circle cx="6.5" cy="12" r="4" />
      <circle cx="17.5" cy="12" r="4" />
      <path d="M12 3.5v17" strokeDasharray="1.6 2.2" />
    </>
  ),

  /* People and process */
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18M12 12v2" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  pie: (
    <>
      <path d="M20.5 13.5A8.5 8.5 0 1 1 10.5 3.5v10z" />
      <path d="M14 2.8a8.5 8.5 0 0 1 7.2 7.2H14z" />
    </>
  ),
  chat: (
    <>
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1.4-4.4a8.5 8.5 0 1 1 15.6-4.6z" />
      <path d="M8.5 10.5h7M8.5 13.5h4" />
    </>
  ),
  scope: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </>
  ),
  inspect: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.3 15.3L21 21" />
      <path d="M8 10.5l1.8 1.8L13 9" />
    </>
  ),
  contract: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M8.5 12h7" />
      <path d="M8.5 17c1.4-1.8 2.3.9 3.6-.8s1.8.9 3.4 0" />
    </>
  ),
  inbox: (
    <>
      <path d="M3 13h5l1.5 2.5h5L16 13h5" />
      <path d="M5.5 5h13L21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z" />
    </>
  ),
  send: (
    <>
      <path d="M21 3L10.5 13.5" />
      <path d="M21 3l-6.5 18-4-7.5L3 9.5z" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;
export type Tone = "signal" | "shift" | "alert" | "dose" | "actin" | "marker" | "dapi";

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

/** Sets the card / badge accent colour from a design-token name. */
export const toneStyle = (tone: Tone) => ({ "--tone": `var(--${tone})` }) as CSSProperties;

/** A tinted, softly lit tile holding one icon. */
export function IconBadge({ name, tone, size = "md" }: { name: IconName; tone?: Tone; size?: "sm" | "md" }) {
  return (
    <span className={size === "sm" ? "icon-badge icon-badge-sm" : "icon-badge"} style={tone ? toneStyle(tone) : undefined}>
      <Icon name={name} />
    </span>
  );
}
