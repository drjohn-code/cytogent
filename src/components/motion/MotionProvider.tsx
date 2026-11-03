"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * App-wide Motion setup (BRIEF §6):
 * - reducedMotion="user" honours prefers-reduced-motion for every Motion animation.
 * - LazyMotion + domAnimation keeps the bundle small; components use `m.*`, not `motion.*`.
 *   `strict` makes an accidental `motion.*` import fail loudly. Load domMax only where layout/drag is used.
 * Children stay server components; this wrapper only provides context.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
