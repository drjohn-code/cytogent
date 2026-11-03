import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { routes } from "@/content/routes";

/**
 * 1200×630 Open Graph image per manifest route, prerendered at build from the page's real H1 and description.
 * Colours are the token values from src/styles/tokens.css (the image renderer cannot read CSS variables).
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return routes.map((r) => ({ slug: r.slug }));
}

const C = { canvas: "#050B14", line: "#1B3448", signal: "#42E8C8", text: "#EAF4F5", muted: "#8FA6B4" };

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = routes.find((x) => x.slug === slug);
  if (!r) return new Response("Not found", { status: 404 });

  const root = process.cwd();
  const [medium, bold, logo] = await Promise.all([
    readFile(join(root, "src/fonts/SpaceGrotesk-latin-500.woff")),
    readFile(join(root, "src/fonts/SpaceGrotesk-latin-700.woff")),
    readFile(join(root, "public/brand/cytogent-logo.svg")),
  ]);
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const kicker = r.path === "/" ? "EXPERIMENTAL INTELLIGENCE · ONCOLOGY R&D" : r.label.toUpperCase();
  const size = r.heading.length > 44 ? 60 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: C.canvas,
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          fontFamily: "Space Grotesk",
          color: C.text,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders <img>, not next/image */}
        <img src={logoSrc} alt="" width={234} height={40} />
        <div style={{ display: "flex", flexDirection: "column", background: C.canvas, padding: "8px 0" }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: C.signal, fontWeight: 500 }}>{kicker}</div>
          <div style={{ fontSize: size, fontWeight: 700, lineHeight: 1.08, marginTop: 18, maxWidth: 1000 }}>{r.heading}</div>
          <div style={{ fontSize: 28, color: C.muted, marginTop: 22, maxWidth: 960, lineHeight: 1.35 }}>{r.description}</div>
        </div>
        <div style={{ display: "flex", fontSize: 20, color: C.muted, background: C.canvas }}>
          cytogent.com · Decision-as-a-Service for oncology R&D
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Space Grotesk", data: medium, weight: 500, style: "normal" },
        { name: "Space Grotesk", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
