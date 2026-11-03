"use client";

import { useEffect, useRef, useState } from "react";
import { loopSteps } from "@/content/loop";

/**
 * Six-step loop (BRIEF §6). The ordered list is the content; the ring is a decorative mirror of it.
 * Desktop: sticky ring beside the list. Mobile: a sticky progress strip above native scrolling.
 * No scroll hijacking: the active step only follows where the reader already is.
 */
const R = 132;
const C = 200;
const ANGLES = [45, 99, 153, 207, 261, 315]; // same geometry as the Cytogent mark

function pol(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C - r * Math.sin(a) };
}

function arc(r: number, a1: number, a2: number) {
  const p1 = pol(r, a1);
  const p2 = pol(r, a2);
  return `M${p1.x} ${p1.y}A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${p2.x} ${p2.y}`;
}

function LoopRing({ active }: { active: number }) {
  return (
    <svg viewBox="-56 0 512 400" aria-hidden="true" className="h-auto w-full max-w-[480px]">
      <path d={arc(R, 45, 315)} fill="none" className="stroke-line-strong" strokeWidth="1.5" />
      <path d={arc(R, 315, 405)} fill="none" className="stroke-line-strong" strokeWidth="1.2" strokeDasharray="3 6" />
      {ANGLES.map((a, i) => {
        const p = pol(R, a);
        const l = pol(R + 34, a);
        const on = i === active;
        const done = i < active;
        const anchor = Math.abs(l.x - C) < 20 ? "middle" : l.x > C ? "start" : "end";
        return (
          <g key={a}>
            <circle
              cx={p.x}
              cy={p.y}
              r={on ? 11 : 7}
              className={`transition-[fill] duration-300 ${on ? "fill-signal" : done ? "fill-text" : "fill-canvas stroke-line-strong"}`}
              strokeWidth="1.5"
            />
            {on && <circle cx={p.x} cy={p.y} r="18" className="fill-none stroke-signal" strokeWidth="1" opacity="0.6" />}
            <text
              x={l.x}
              y={l.y + 4}
              textAnchor={anchor}
              fontSize="12"
              className={`font-mono transition-colors duration-300 ${on ? "fill-signal" : "fill-muted"}`}
            >
              {loopSteps[i].label}
            </text>
          </g>
        );
      })}
      <text x={C} y={C - 6} textAnchor="middle" className="fill-muted font-mono" fontSize="12">
        {`STEP ${active + 1} / 6`}
      </text>
      <text x={C} y={C + 20} textAnchor="middle" className="fill-text" fontSize="20" fontWeight="600">
        {loopSteps[active].label}
      </text>
      <text x={C + R + 18} y={C + 4} textAnchor="start" className="fill-muted" fontSize="11">
        next
      </text>
    </svg>
  );
}

export function LoopTimeline() {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <div className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+3rem)] flex justify-center">
          <LoopRing active={active} />
        </div>
      </div>

      <div>
        <div
          aria-hidden="true"
          className="sticky top-[var(--header-h)] z-10 -mx-4 border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden"
        >
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-signal">{loopSteps[active].label}</span>
            <span className="text-muted">{`${active + 1} / 6`}</span>
          </div>
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded bg-line">
            <div
              className="h-full origin-left bg-signal transition-transform duration-300"
              style={{ transform: `scaleX(${(active + 1) / 6})` }}
            />
          </div>
        </div>

        <ol className="lg:py-[18svh]">
          {loopSteps.map((s, i) => (
            <li
              key={s.label}
              ref={(el) => {
                items.current[i] = el;
              }}
              data-index={i}
              className="border-b border-line py-8 last:border-b-0 lg:flex lg:min-h-[38svh] lg:flex-col lg:justify-center lg:border-b-0 lg:py-0"
            >
              <p className={`font-mono text-sm transition-colors duration-300 ${i === active ? "text-signal" : "text-muted"}`}>
                {String(i + 1).padStart(2, "0")} · {s.label}
              </p>
              <p className="mt-3 max-w-md text-xl">{s.line}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
