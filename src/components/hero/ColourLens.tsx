"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * An image shown as raw greyscale micrograph, with a lens of full colour that follows the pointer
 * (and drifts on its own until the pointer arrives, or on touch screens). The image also leans slightly
 * with the pointer. Positions are written to CSS variables, so React does not re-render per frame.
 * Under reduced motion the lens stays put and nothing leans.
 */
export function ColourLens({ src, priority = false, lens = 260, align = "right" }: { src: string; priority?: boolean; lens?: number; align?: "right" | "center" }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let t = Math.random() * 10;
    let last = performance.now();
    let pointer: { x: number; y: number } | null = null;
    let idleSince = 0;
    const cur = { x: 0.68, y: 0.45 };
    const lean = { x: 0, y: 0 };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) {
        pointer = null;
        return;
      }
      pointer = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
      idleSince = performance.now();
    };
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      t += dt;
      if (pointer && now - idleSince > 4000) pointer = null; // drift again after a pause
      const target = pointer ?? { x: 0.66 + 0.18 * Math.sin(t * 0.23), y: 0.48 + 0.2 * Math.sin(t * 0.31 + 1.3) };
      const k = pointer ? 0.14 : 0.04;
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      lean.x += ((cur.x - 0.5) * -2 - lean.x) * 0.05;
      lean.y += ((cur.y - 0.5) * -2 - lean.y) * 0.05;
      el.style.setProperty("--lx", `${(cur.x * 100).toFixed(2)}%`);
      el.style.setProperty("--ly", `${(cur.y * 100).toFixed(2)}%`);
      el.style.setProperty("--tx", `${(lean.x * 1.2).toFixed(3)}%`);
      el.style.setProperty("--ty", `${(lean.y * 1.2).toFixed(3)}%`);
      raf = requestAnimationFrame(frame);
    };
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const pos = align === "right" ? "object-[70%_50%]" : "object-center";
  const mask = `radial-gradient(circle ${lens}px at var(--lx, 66%) var(--ly, 48%), black 55%, transparent 100%)`;

  return (
    <div ref={box} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="lens-lean absolute -inset-[3%]">
        <Image src={src} alt="" fill priority={priority} sizes="100vw" className={`object-cover ${pos} opacity-55 grayscale`} />
        <div className="absolute inset-0" style={{ WebkitMaskImage: mask, maskImage: mask }}>
          <Image src={src} alt="" fill sizes="100vw" className={`object-cover ${pos}`} />
        </div>
      </div>
      <span
        className="absolute -translate-1/2 rounded-full border border-text/40"
        style={{ left: "var(--lx, 66%)", top: "var(--ly, 48%)", width: lens * 1.55, height: lens * 1.55 }}
      >
        <span className="absolute top-1/2 -left-3 h-px w-3 bg-text/50" />
        <span className="absolute top-1/2 -right-3 h-px w-3 bg-text/50" />
        <span className="absolute -top-3 left-1/2 h-3 w-px bg-text/50" />
        <span className="absolute -bottom-3 left-1/2 h-3 w-px bg-text/50" />
      </span>
    </div>
  );
}
