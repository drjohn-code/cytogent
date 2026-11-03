import { COLS, ROWS, seeded, wellStates, type WellState } from "@/lib/plate";

/**
 * Point positions for the hero illustration: a budding organoid (hollow, lumpy shell) and the same points
 * regrouped into the wells of a 96-well plate. Counts are rendering parameters, not sample sizes.
 */
export const POINTS_PER_WELL = 20;
export const WELL_PITCH = 0.36;
export const WELL_RADIUS = 0.11;

export interface HeroPoint {
  organoid: [number, number, number];
  plate: [number, number, number];
  col: number;
  state: WellState;
}

export function heroPoints(): HeroPoint[] {
  const rnd = seeded(11);
  const states = wellStates();
  const pts: HeroPoint[] = [];
  for (let w = 0; w < ROWS * COLS; w++) {
    const row = Math.floor(w / COLS);
    const col = w % COLS;
    const cx = (col - (COLS - 1) / 2) * WELL_PITCH;
    const cy = ((ROWS - 1) / 2 - row) * WELL_PITCH;
    for (let k = 0; k < POINTS_PER_WELL; k++) {
      // organoid: point on a lumpy shell, hollow lumen
      const u = rnd() * 2 - 1;
      const t = rnd() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const dir: [number, number, number] = [s * Math.cos(t), u, s * Math.sin(t)];
      const lump = 1 + 0.16 * Math.sin(3 * t) * Math.sin(2.2 * Math.acos(u)) + 0.08 * Math.sin(5 * t + 1);
      const r = 1.5 * lump * (0.8 + 0.2 * rnd());
      // plate: point inside its well disc
      const a = rnd() * Math.PI * 2;
      const d = Math.sqrt(rnd()) * WELL_RADIUS;
      pts.push({
        organoid: [dir[0] * r, dir[1] * r, dir[2] * r],
        plate: [cx + Math.cos(a) * d, cy + Math.sin(a) * d, (rnd() - 0.5) * 0.04],
        col,
        state: states[w],
      });
    }
  }
  return pts;
}
