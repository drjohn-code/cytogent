"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { loopSteps } from "@/content/loop";
import { seeded } from "@/lib/plate";

/**
 * The loop shown as the product at work: one resistance programme moving through the six steps.
 * Steps advance on their own (paused on hover or focus, and under reduced motion); any step can be picked.
 * Drug names, models and values are placeholders that show the shape of the work, not results.
 */
const STEP_MS = 5200;
const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

function Row({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div className="story-in" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Define() {
  return (
    <div className="space-y-6">
      <Row>
        <p className="font-mono text-xs tracking-[0.12em] text-muted uppercase">Question</p>
        <p className="mt-3 max-w-xl text-2xl font-light sm:text-3xl">
          Which partner drug restores response in osimertinib-resistant models?
        </p>
      </Row>
      <Row delay={250}>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Models", "3 resistant lines"],
            ["Budget", "One plate per wave"],
            ["Decision", "Go, adjust or stop"],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-line pt-3">
              <p className="font-mono text-xs text-muted">{k}</p>
              <p className="mt-1">{v}</p>
            </div>
          ))}
        </div>
      </Row>
    </div>
  );
}

function Connect() {
  const sources = [
    ["Tumour DNA", "EGFR C797S"],
    ["RNA", "MET signalling up"],
    ["Treatment history", "Osimertinib, then progression"],
    ["Baseline assays", "Viability of 3 models"],
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] sm:items-center">
      <ul className="space-y-1">
        {sources.map(([k, v], i) => (
          <li key={k} className="story-in flex items-center justify-between gap-4 border-b border-line py-3" style={{ animationDelay: `${i * 180}ms` }}>
            <span className="text-muted">{k}</span>
            <span className="flex items-center gap-2 text-right">
              {v}
              <span className="size-1.5 rounded-full bg-signal" />
            </span>
          </li>
        ))}
      </ul>
      <Row delay={500}>
        <div className="relative mx-auto aspect-square w-full max-w-[220px]">
          <Image src="/images/gen/tissue-multiplex-resistant.webp" alt="" fill sizes="220px" className="core-turn object-contain" />
        </div>
      </Row>
    </div>
  );
}

const ranked = [
  { pair: "Osimertinib + MET inhibitor", v: 0.84, u: 0.07 },
  { pair: "Osimertinib + MEK inhibitor", v: 0.66, u: 0.13 },
  { pair: "Osimertinib + AXL inhibitor", v: 0.52, u: 0.17 },
];

function Prioritize() {
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-xs text-muted">
        <span>Ranked by what the experiment would teach</span>
        <span className="hidden sm:inline">uncertainty ⟷</span>
      </div>
      <ul className="mt-5 space-y-5">
        {ranked.map((r, i) => (
          <li key={r.pair} className="story-in" style={{ animationDelay: `${i * 160}ms` }}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span>{r.pair}</span>
              <span className="font-mono text-xs text-signal">#{i + 1}</span>
            </div>
            <div className="relative mt-2 h-1.5 rounded-full bg-line">
              <span className="story-progress absolute inset-y-0 left-0 rounded-full bg-signal" style={{ width: `${r.v * 100}%`, animationDuration: "900ms" }} />
              <span className="absolute top-1/2 h-3 -translate-y-1/2 border-x border-text/70" style={{ left: `${(r.v - r.u) * 100}%`, width: `${r.u * 200}%` }} />
            </div>
          </li>
        ))}
        <li className="story-in text-sm" style={{ animationDelay: "500ms" }}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-muted">Osimertinib + drug X</span>
            <span className="font-mono text-xs text-alert">abstain · too uncertain</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-[repeating-linear-gradient(90deg,var(--line-strong)_0_6px,transparent_6px_12px)]" />
        </li>
      </ul>
    </div>
  );
}

function Test() {
  const rnd = seeded(21);
  const rows = 8;
  const cols = 12;
  const tone = (r: number, c: number) => {
    if (c === 0 || c === cols - 1) return "bg-line-strong/50";
    if (c >= 1 && c <= 3) return "bg-signal";
    if (c >= 4 && c <= 6) return "bg-shift";
    if (c >= 7 && c <= 9 && r < 6) return "bg-dose";
    return "bg-line";
  };
  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_10rem] sm:items-center">
      <div className="max-w-[440px] rounded-[var(--radius-card)] border border-line-strong/60 p-3 sm:p-4">
        <div className="grid grid-cols-12 gap-1 sm:gap-1.5">
          {Array.from({ length: rows * cols }, (_, k) => {
            const r = Math.floor(k / cols);
            const c = k % cols;
            return (
              <span key={k} className="story-in aspect-square rounded-full border border-line" style={{ animationDelay: `${c * 70 + r * 25}ms` }}>
                <span className={`block size-full rounded-full ${tone(r, c)}`} style={{ opacity: 0.25 + rnd() * 0.75 }} />
              </span>
            );
          })}
        </div>
      </div>
      <ul className="space-y-2 font-mono text-xs text-muted">
        <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-signal" /> + MET inhibitor</li>
        <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-shift" /> + MEK inhibitor</li>
        <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-dose" /> + AXL inhibitor</li>
        <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-line-strong" /> controls</li>
      </ul>
    </div>
  );
}

/** Hill curve, x in 0..1 (log dose), returns viability 0..1. */
function curve(ic50: number, floor: number) {
  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = i / 39;
    const y = floor + (1 - floor) / (1 + Math.exp((x - ic50) * 12));
    return `${(20 + x * 360).toFixed(1)},${(20 + (1 - y) * 170).toFixed(1)}`;
  });
  return `M${pts.join("L")}`;
}

function Learn() {
  const lines = [
    { d: curve(0.95, 0.75), tone: "stroke-muted", label: "Osimertinib alone" },
    { d: curve(0.7, 0.45), tone: "stroke-shift", label: "+ MEK inhibitor" },
    { d: curve(0.42, 0.06), tone: "stroke-signal", label: "+ MET inhibitor" },
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-center">
      <svg viewBox="0 0 400 220" className="h-auto w-full" aria-hidden="true">
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1="20" x2="380" y1={20 + k * 56.7} y2={20 + k * 56.7} className="stroke-line" strokeWidth="1" />
        ))}
        <line x1="20" x2="20" y1="20" y2="190" className="stroke-line-strong" />
        <line x1="20" x2="380" y1="190" y2="190" className="stroke-line-strong" />
        <text x="20" y="210" className="fill-muted font-mono" fontSize="10">dose →</text>
        <text x="380" y="14" textAnchor="end" className="fill-muted font-mono" fontSize="10">live cells</text>
        {lines.map((l, i) => (
          <path key={l.label} d={l.d} pathLength={1} className={`draw fill-none ${l.tone}`} strokeWidth="2.2" style={{ animationDelay: `${i * 300}ms` }} />
        ))}
      </svg>
      <ul className="space-y-2 font-mono text-xs text-muted">
        {lines.map((l) => (
          <li key={l.label} className="flex items-center gap-2">
            <svg viewBox="0 0 16 2" className="h-0.5 w-4" aria-hidden="true"><line x1="0" x2="16" y1="1" y2="1" className={l.tone} strokeWidth="2" /></svg>
            {l.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Confirm() {
  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
      <div className="grid grid-cols-2 gap-4">
        {["Batch 1", "Batch 2 · independent"].map((b, i) => (
          <Row key={b} delay={i * 200}>
            <div className="relative aspect-square overflow-hidden rounded-full border border-line-strong/60">
              <Image src="/images/gen/well-combo.webp" alt="" fill sizes="180px" className={`object-cover ${i ? "core-turn-rev" : "core-turn"}`} />
            </div>
            <p className="mt-2 text-center font-mono text-xs text-muted">{b}</p>
          </Row>
        ))}
      </div>
      <Row delay={450}>
        <p className="font-mono text-xs tracking-[0.12em] text-actin uppercase">Reproduced</p>
        <p className="mt-3 text-2xl font-light">Osimertinib + MET inhibitor holds in an independent batch.</p>
        <p className="mt-3 text-muted">Decision brief: go to the next wave, with two more resistant models.</p>
      </Row>
    </div>
  );
}

const panels = [Define, Connect, Prioritize, Test, Learn, Confirm];

export function ProgrammeStory() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (paused || still) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % panels.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [step, paused, still]);

  const Panel = panels[step];

  return (
    <div
      data-spot
      className="reveal mt-12 overflow-hidden rounded-[calc(var(--radius-card)*1.4)] border border-line bg-elevated shadow-[0_60px_140px_-60px_color-mix(in_srgb,var(--signal)_30%,transparent)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 font-mono text-xs text-muted">
        <span>Programme · EGFR-mutant lung cancer · after osimertinib</span>
        <span className="inline-flex items-center gap-2">
          <span className="size-1.5 animate-pulse rounded-full bg-signal" />
          Wave 2
        </span>
      </div>
      <div className="grid lg:grid-cols-[15rem_minmax(0,1fr)]">
        <ol className="flex gap-1 overflow-x-auto border-b border-line p-2 lg:flex-col lg:border-r lg:border-b-0 lg:p-3">
          {loopSteps.map((s, i) => (
            <li key={s.label} className="shrink-0">
              <button
                type="button"
                onClick={() => setStep(i)}
                aria-current={i === step ? "step" : undefined}
                className={`relative flex min-h-11 w-full items-center gap-3 overflow-hidden rounded-[var(--radius-control)] px-3 text-left text-sm transition-colors ${
                  i === step ? "bg-canvas text-text" : "text-muted hover:text-text"
                }`}
              >
                <span className={`font-mono text-xs ${i === step ? "text-signal" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
                {title(s.label)}
                {i === step && !still && (
                  <span
                    key={`p-${step}-${paused}`}
                    className="story-progress absolute inset-x-0 bottom-0 h-px bg-signal"
                    style={{ animationDuration: `${STEP_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                  />
                )}
              </button>
            </li>
          ))}
        </ol>
        <div className="min-h-[380px] p-6 sm:p-10" aria-live="polite">
          <p className="sr-only">{`Step ${step + 1} of 6: ${title(loopSteps[step].label)}. ${loopSteps[step].line}`}</p>
          <div key={step} aria-hidden="true">
            <Panel />
          </div>
        </div>
      </div>
    </div>
  );
}
