import type { ReactNode } from "react";
import { IconBadge, toneStyle, type IconName, type Tone } from "@/components/ui/Icon";

/** Accent colours cycled across a grid when an item doesn't pick its own. */
export const TONES: Tone[] = ["signal", "shift", "actin", "dose", "marker", "alert"];
export const toneAt = (i: number) => TONES[i % TONES.length];

/**
 * A raised card: icon badge, optional kicker (step number, gate, tag) and heading, then free content.
 * Depth, accent line and hover lift come from `.card` in globals.css; `--tone` colours the accents.
 */
export function FeatureCard({
  icon,
  tone = "signal",
  kicker,
  title,
  titleClassName = "text-xl font-medium",
  as: Tag = "li",
  className = "",
  children,
}: {
  icon: IconName;
  tone?: Tone;
  kicker?: ReactNode;
  title?: ReactNode;
  titleClassName?: string;
  as?: "li" | "div";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Tag data-spot className={`card flex flex-col p-6 sm:p-7 ${className}`} style={toneStyle(tone)}>
      <div className="flex items-start justify-between gap-4">
        <IconBadge name={icon} />
        {kicker != null && <span className="pt-1 font-mono text-xs tracking-[0.08em] text-muted">{kicker}</span>}
      </div>
      {title != null && <h3 className={`mt-6 ${titleClassName}`}>{title}</h3>}
      {children}
    </Tag>
  );
}
