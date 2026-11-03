// Copies the approved logo system from brand/ into the app (BRIEF §6B).
// brand/*.svg            -> public/brand/
// brand/favicon/icon.svg, favicon.ico, apple-icon.png -> src/app/ (Next.js file conventions)
// brand/favicon/icon-*.png -> public/icons/ (web manifest)
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const brand = join(root, "brand");
const fav = join(brand, "favicon");

mkdirSync(join(root, "public/brand"), { recursive: true });
mkdirSync(join(root, "public/icons"), { recursive: true });

for (const f of readdirSync(brand).filter((n) => n.endsWith(".svg"))) {
  copyFileSync(join(brand, f), join(root, "public/brand", f));
}
for (const f of ["icon.svg", "favicon.ico", "apple-icon.png"]) {
  copyFileSync(join(fav, f), join(root, "src/app", f));
}
for (const f of readdirSync(fav).filter((n) => n.startsWith("icon-") && n.endsWith(".png"))) {
  copyFileSync(join(fav, f), join(root, "public/icons", f));
}
console.log("brand files copied");
