/**
 * Deterministic, illustrative 96-well layout shared by the hero (3D + SVG fallback) and the plate-plan HUD.
 * The pattern is decoration: it does not encode any measurement (BRIEF §1.3).
 */
export const ROWS = 8;
export const COLS = 12;

export type WellState = "responds" | "resists" | "idle";

/** mulberry32: small seeded PRNG so server and client draw the same picture. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function wellStates(seed = 7): WellState[] {
  const rnd = seeded(seed);
  return Array.from({ length: ROWS * COLS }, () => {
    const r = rnd();
    return r < 0.52 ? "responds" : r < 0.8 ? "resists" : "idle";
  });
}

/** A small bounded batch for the plate-plan HUD: selected wells, plus control columns. */
export function batchWells(): { selected: Set<number>; controls: Set<number> } {
  const selected = new Set([14, 17, 27, 30, 40, 45, 51, 56, 64, 69]);
  const controls = new Set<number>();
  for (let r = 0; r < ROWS; r++) {
    controls.add(r * COLS);
    controls.add(r * COLS + COLS - 1);
  }
  return { selected, controls };
}
