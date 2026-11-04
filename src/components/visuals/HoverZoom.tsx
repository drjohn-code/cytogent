"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/** An image with a magnifier that appears under the pointer (×2.6). Touch and keyboard users see the image as is. */
export function HoverZoom({ src, sizes, className = "" }: { src: string; sizes: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const move = (e: React.PointerEvent) => {
    const el = box.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--zx", `${e.clientX - r.left}px`);
    el.style.setProperty("--zy", `${e.clientY - r.top}px`);
    el.style.setProperty("--zw", `${r.width}px`);
    el.style.setProperty("--zh", `${r.height}px`);
  };
  return (
    <div
      ref={box}
      className={`absolute inset-0 ${on ? "cursor-none" : ""}`}
      onPointerEnter={(e) => e.pointerType !== "touch" && setOn(true)}
      onPointerLeave={() => setOn(false)}
      onPointerMove={move}
    >
      <Image src={src} alt="" fill sizes={sizes} className={className} />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute size-48 -translate-1/2 overflow-hidden rounded-full border border-text/70 shadow-[0_20px_60px_-10px_black] transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`}
        style={{ left: "var(--zx, 50%)", top: "var(--zy, 50%)" }}
      >
        <div
          className="absolute"
          style={{
            width: "calc(var(--zw, 400px) * 2.6)",
            height: "calc(var(--zh, 400px) * 2.6)",
            left: "calc(6rem - var(--zx, 200px) * 2.6)",
            top: "calc(6rem - var(--zy, 200px) * 2.6)",
          }}
        >
          <Image src={src} alt="" fill sizes="1400px" className="object-contain" />
        </div>
      </div>
    </div>
  );
}
