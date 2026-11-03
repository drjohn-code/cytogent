import Image from "next/image";

/** Horizontal lockup (brand/cytogent-logo.svg, viewBox 302.9 × 51.6). Minimum width 120px (docs/BRAND.md). */
export function Logo({ height = 26, priority = false }: { height?: number; priority?: boolean }) {
  const width = Math.round((height * 302.9) / 51.6);
  return (
    <Image
      src="/brand/cytogent-logo.svg"
      alt="Cytogent"
      width={width}
      height={height}
      priority={priority}
      unoptimized
    />
  );
}
