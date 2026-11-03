"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color, type Points } from "three";
import { heroPoints } from "./hero-geometry";

/**
 * Point-cloud organoid that regroups into a well plate and back (conceptual, BRIEF §6).
 * Animated with R3F useFrame only. `active` pauses rendering off-screen or in a hidden tab.
 */
const HOLD_ORGANOID = 3.2;
const MORPH = 2.6;
const HOLD_PLATE = 4;
const CYCLE = HOLD_ORGANOID + MORPH + HOLD_PLATE + MORPH;
const STAGGER = 0.35; // share of the morph spread across plate columns

function token(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/** 0 = organoid, 1 = plate, for a point whose column is `col` (0..11). */
function mix(t: number, col: number) {
  const c = t % CYCLE;
  const delay = (col / 11) * STAGGER;
  const span = 1 - STAGGER;
  if (c < HOLD_ORGANOID) return 0;
  if (c < HOLD_ORGANOID + MORPH) return smooth(((c - HOLD_ORGANOID) / MORPH - delay) / span);
  if (c < HOLD_ORGANOID + MORPH + HOLD_PLATE) return 1;
  return 1 - smooth(((c - HOLD_ORGANOID - MORPH - HOLD_PLATE) / MORPH - delay) / span);
}

function Cloud() {
  const ref = useRef<Points>(null);
  const clock = useRef(0);
  const pts = useMemo(() => heroPoints(), []);

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pts.length * 3), 3));
    const colors = new Float32Array(pts.length * 3);
    const palette = {
      responds: new Color(token("--signal", "#42e8c8")),
      resists: new Color(token("--shift", "#8b7cff")),
      idle: new Color(token("--line-strong", "#56748a")),
    };
    pts.forEach((p, i) => palette[p.state].toArray(colors, i * 3));
    g.setAttribute("color", new BufferAttribute(colors, 3));
    return g;
  }, [pts]);

  useFrame((_, delta) => {
    clock.current += Math.min(delta, 0.1); // no jump after a pause
    const t = clock.current;
    const spin = t * 0.18;
    const cos = Math.cos(spin);
    const sin = Math.sin(spin);
    const pos = geometry.getAttribute("position") as BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const m = mix(t, p.col);
      const [ox, oy, oz] = p.organoid;
      const rx = ox * cos + oz * sin;
      const rz = -ox * sin + oz * cos;
      arr[i * 3] = rx + (p.plate[0] - rx) * m;
      arr[i * 3 + 1] = oy + (p.plate[1] - oy) * m;
      arr[i * 3 + 2] = rz + (p.plate[2] - rz) * m;
    }
    pos.needsUpdate = true;
  });

  // Soft round sprite so points read as glowing cells, not square pixels.
  const sprite = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.85)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new CanvasTexture(c);
  }, []);

  return (
    <points ref={ref} geometry={geometry} rotation={[-0.42, 0.18, 0]}>
      <pointsMaterial
        size={0.085}
        map={sprite}
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export default function OrganoidScene({ active, onReady }: { active: boolean; onReady: () => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      onCreated={() => onReady()}
    >
      <Cloud />
    </Canvas>
  );
}
