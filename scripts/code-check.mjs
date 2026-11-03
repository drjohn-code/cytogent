// Static checks from BRIEF §12 ("Generated code", "Logo"). Run: npm run check:code
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const failures = [];
const fail = (msg) => failures.push(msg);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (["node_modules", ".git", "cache"].includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const rel = (p) => relative(root, p);
const src = walk(join(root, "src")).filter((p) => /\.(tsx?|css|mjs)$/.test(p));

// 1. Motion: never framer-motion.
for (const f of src) if (/from\s+["']framer-motion["']/.test(readFileSync(f, "utf8"))) fail(`framer-motion import in ${rel(f)}`);
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
if (pkg.dependencies?.["framer-motion"] || pkg.devDependencies?.["framer-motion"]) fail("framer-motion listed in package.json");

// 2. Colours: hex values only in tokens.css, plus places that cannot read CSS variables (each says so in a comment).
const HEX_ALLOWED = [
  "src/styles/tokens.css",
  "src/proxy.ts", // self-contained 410 page
  "src/app/og/[slug]/route.tsx", // image renderer
  "src/app/layout.tsx", // viewport themeColor
  "src/app/manifest.ts", // web manifest
  "src/components/hero/OrganoidScene.tsx", // fallbacks if a CSS token cannot be read
];
for (const f of src) {
  if (HEX_ALLOWED.includes(rel(f))) continue;
  const hits = readFileSync(f, "utf8").match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-fA-F-])/g);
  if (hits) fail(`hard-coded colour ${hits.join(", ")} in ${rel(f)}`);
}

// 3. No remote fonts, images, scripts or stylesheets.
for (const f of src) {
  const s = readFileSync(f, "utf8");
  if (/fonts\.googleapis|fonts\.gstatic|@import\s+url\(\s*["']?https?:/.test(s)) fail(`remote font/CSS in ${rel(f)}`);
  if (/<(img|script|link)[^>]+(src|href)=["']https?:\/\//.test(s)) fail(`remote asset in ${rel(f)}`);
}

// 4. No 21st API key anywhere in the repo or build output. `.mcp.json` may only reference the env var.
const KEYISH = /(API_KEY_21ST|x-api-key)["'\s:=]+(?!["']?\$\{)["']?[A-Za-z0-9_-]{16,}/;
const scan = [
  ...walk(join(root, "src")),
  ...walk(join(root, "public")),
  ...walk(join(root, "docs")).filter((p) => !/\.(png|jpe?g|ico|woff2?)$/.test(p)),
  ...walk(join(root, ".next")).filter((p) => /\.(js|html|json|txt|body|rsc)$/.test(p)),
  ...[".mcp.json", "README.md", "package.json"].map((f) => join(root, f)).filter(existsSync),
];
for (const f of scan) if (KEYISH.test(readFileSync(f, "utf8"))) fail(`possible 21st API key in ${rel(f)}`);

// 5. Logo files: viewBox, title, no live text, strokes, masks or rasters.
for (const f of walk(join(root, "public/brand")).filter((p) => p.endsWith(".svg") && p.includes("cytogent-"))) {
  const s = readFileSync(f, "utf8");
  if (!/viewBox="/.test(s)) fail(`${rel(f)}: no viewBox`);
  if (!/<title>Cytogent<\/title>/.test(s)) fail(`${rel(f)}: no <title>`);
  if (/<text|<image|<mask|stroke=/.test(s)) fail(`${rel(f)}: contains text, image, mask or stroke`);
}

if (failures.length) {
  console.error(`code-check: ${failures.length} problem(s)\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`code-check: ok (${src.length} source files, ${scan.length} files scanned for keys)`);
