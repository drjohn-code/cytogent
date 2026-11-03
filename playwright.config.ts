import { defineConfig, devices } from "@playwright/test";

/**
 * Tests run against a production build (`npm run build` first). Set BASE_URL to test a deployed preview instead,
 * e.g. BASE_URL=https://<preview>.vercel.app npm test
 * Protected Vercel previews: also set VERCEL_AUTOMATION_BYPASS_SECRET (Vercel → Settings → Deployment Protection →
 * Protection Bypass for Automation). It is read from the environment only; never commit it.
 */
const PORT = 3200;
const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: [["list"]],
  outputDir: "test-results",
  use: {
    baseURL,
    // Sent on every request, so no bypass cookie is needed (the cookie header would add a 307 hop to each response).
    extraHTTPHeaders: bypass ? { "x-vercel-protection-bypass": bypass } : undefined,
    // Headless Chromium needs this to create a WebGL context (SwiftShader), so the hero canvas path is tested.
    launchOptions: { args: ["--enable-unsafe-swiftshader"] },
  },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: `npx next start -p ${PORT}`, url: baseURL, reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] }, testIgnore: /screens\.spec\.ts/ },
    { name: "screens", testMatch: /screens\.spec\.ts/ },
  ],
});
