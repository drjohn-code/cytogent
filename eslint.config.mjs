import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Motion must come from `motion/react`; the old package name is banned (BRIEF §6).
      "no-restricted-imports": ["error", { paths: [{ name: "framer-motion", message: "Import from motion/react." }] }],
    },
  },
  // Legacy static site and its generator stay in the repo until cutover; they are not linted here.
  globalIgnores([".next/**", "out/**", "next-env.d.ts", "source/**", "site/**", "api/**", "docs/**", "brand/**"]),
]);
