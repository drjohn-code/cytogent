"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ReducedMotionFallback } from "./ReducedMotionFallback";

const OrganoidScene = dynamic(() => import("./OrganoidScene"), { ssr: false });

type NavigatorHints = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

/** WebGL only when it helps: not under reduced motion, Save-Data, low-power hints, or without WebGL. */
function canUseWebGL() {
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return false;
  if ((nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroVisual() {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState(false);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [visible, setVisible] = useState(true);
  // WCAG 2.2.2: the loop runs longer than 5 s, so the user can pause it.
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // Decide once on the client; the server always renders the SVG.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(!reduce && canUseWebGL());
  }, [reduce]);

  useEffect(() => {
    if (!webgl || !box.current) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "120px" });
    io.observe(box.current);
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [webgl]);

  return (
    <div className="relative">
      <div ref={box} aria-hidden="true" className="relative aspect-[32/21] w-full">
        <ReducedMotionFallback
          className={`absolute inset-0 transition-opacity duration-500 ${webgl && ready ? "opacity-0" : "opacity-100"}`}
        />
        {webgl && (
          <div className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
            <OrganoidScene active={onScreen && visible && !paused} onReady={() => setReady(true)} />
          </div>
        )}
      </div>
      {webgl && ready && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="absolute right-0 bottom-0 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-canvas/80 px-4 font-mono text-xs text-muted backdrop-blur-sm hover:text-text"
        >
          <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3">
            {paused ? <path d="M3 2l7 4-7 4z" fill="currentColor" /> : <path d="M3 2h2v8H3zM7 2h2v8H7z" fill="currentColor" />}
          </svg>
          {paused ? "Play animation" : "Pause animation"}
        </button>
      )}
    </div>
  );
}
