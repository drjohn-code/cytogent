// Builds the wordmark "CYTOGENT" in Lexend 400 with wide tracking, as outlines (logo files carry no live text),
// and rewrites every lockup and wordmark file in public/brand/ and brand/. Run after scripts/build-mark.py.
//   node scripts/build-wordmark.mjs
// Font: docs/brand/fonts/Lexend-400.woff (SIL OFL 1.1, licence beside it).
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const buf = readFileSync(join(root, "docs/brand/fonts/Lexend-400.woff"));
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

const TEXT = "CYTOGENT";
const CAP = 28; // cap height in wordmark units; baseline at y = 0
const TRACK = 0.22; // em
const size = (CAP * font.unitsPerEm) / font.tables.os2.sCapHeight;

// Lay the glyphs out by hand: advance + kerning + tracking, no tracking after the last letter.
let x = 0;
let d = "";
const glyphs = font.stringToGlyphs(TEXT);
glyphs.forEach((g, i) => {
  d += g.getPath(x, 0, size).toPathData(2);
  x += (g.advanceWidth * size) / font.unitsPerEm;
  if (i < glyphs.length - 1) x += (font.getKerningValue(g, glyphs[i + 1]) * size) / font.unitsPerEm + TRACK * size;
});
const box = new opentype.Path();
box.commands = font.getPath(TEXT, 0, 0, size).commands;
const W = +x.toFixed(2);

const fmt = (n) => +n.toFixed(2);
const fillsOf = (s) => [...s.matchAll(/fill="(#[0-9A-Fa-f]{6})"/g)].map((m) => m[1]);
const most = (arr) => arr.sort((a, b) => arr.filter((v) => v === b).length - arr.filter((v) => v === a).length)[0];
const word = (fill) => `<path fill="${fill}" d="${d}"/>`;

// Horizontal lockup: mark at its usual place, wordmark caps centred on the mark (mark centre y ≈ 32.4).
const LOCK = { x: 66, scale: 0.78 };
const lockBaseline = fmt(32.4 + (CAP * LOCK.scale) / 2);
const lockWidth = fmt(LOCK.x + W * LOCK.scale - 7.5 + 2);

function rewrite(file) {
  let s = readFileSync(file, "utf8");
  const name = file.split("/").pop();
  const groups = [...s.matchAll(/<g transform="([^"]*)">(.*?)<\/g>/gs)];
  if (name.includes("wordmark")) {
    const fill = most(fillsOf(s));
    s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 ${-CAP - 0.5} ${fmt(W + 1)} ${CAP + 1}" role="img"><title>Cytogent</title>${word(fill)}</svg>`;
  } else if (name.includes("stacked") && groups.length === 2) {
    const [markG, wordG] = groups;
    const fill = most(fillsOf(wordG[2]));
    const sc = 0.9;
    const ww = W * sc;
    const markScale = 1.5;
    const markX = fmt(ww / 2 - 30.65 * markScale);
    const baseline = 122;
    s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 8.8 ${fmt(ww + 2)} ${fmt(baseline - 8.8 + 1)}" role="img"><title>Cytogent</title><g transform="translate(${markX} 0) scale(${markScale})">${markG[2]}</g><g transform="translate(0 ${baseline}) scale(${sc})">${word(fill)}</g></svg>`;
  } else if (name.includes("logo") && groups.length === 2) {
    const [markG, wordG] = groups;
    const fill = most(fillsOf(wordG[2]));
    s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="7.5 5.9 ${lockWidth} 51.6" role="img"><title>Cytogent</title><g transform="${markG[1]}">${markG[2]}</g><g transform="translate(${LOCK.x} ${lockBaseline}) scale(${LOCK.scale})">${word(fill)}</g></svg>`;
  } else return;
  writeFileSync(file, s);
  console.log("wordmark ->", file.replace(root, ""));
}

for (const dir of ["public/brand", "brand"]) {
  for (const f of readdirSync(join(root, dir)).filter((n) => n.startsWith("cytogent-") && n.endsWith(".svg"))) {
    if (f.includes("mark") && !f.includes("wordmark")) continue;
    rewrite(join(root, dir, f));
  }
}
console.log(`lockup viewBox width ${lockWidth} × 51.6; wordmark ${W} × ${CAP}`);
