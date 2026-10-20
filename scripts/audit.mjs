// Serves the production build and runs axe (every page, 1440 + 390) and Lighthouse (mobile + desktop).
// Usage: npm run audit   (expects a fresh `astro build`; the npm script runs it first)
import { spawn, spawnSync } from "node:child_process";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const PORT = 4398;
const BASE = `http://localhost:${PORT}`;
const PAGES = ["/", "/en/", "/resume/", "/en/resume/"];
const LH_PAGES = ["/", "/resume/"];

const server = spawn("node_modules/.bin/astro", ["preview", "--port", String(PORT)], { stdio: ["ignore", "pipe", "inherit"] });
await new Promise((ok, fail) => {
  server.stdout.on("data", (d) => String(d).includes(String(PORT)) && ok());
  server.on("exit", (c) => fail(new Error(`preview exited ${c}`)));
});

let problems = 0;
try {
  const browser = await chromium.launch();
  // the Resume pins the paper palette, so the colour scheme only matters on the home pages
  for (const path of PAGES) for (const width of [1440, 390]) for (const colorScheme of path.includes("resume") ? ["light"] : ["dark", "light"]) {
    // reduced motion: axe must judge final colours, not a frame of an entrance fade
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
    console.log(`axe ${path.padEnd(11)} ${width} ${colorScheme.padEnd(5)} ${violations.length ? "✗ " + violations.length : "✓"}`);
    for (const v of violations) { problems++; console.log(`   ${v.id} (${v.impact}): ${v.help} → ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`); }
    await context.close();
  }
  await browser.close();

  const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ["--headless=new"] });
  for (const path of LH_PAGES) for (const formFactor of ["mobile", "desktop"]) {
    const desktop = formFactor === "desktop";
    const { lhr } = await lighthouse(BASE + path, { port: chrome.port, output: "json", logLevel: "error" }, {
      extends: "lighthouse:default",
      settings: desktop
        ? { formFactor: "desktop", screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }, throttlingMethod: "simulate", throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } }
        : { formFactor: "mobile", throttlingMethod: "simulate" },
    });
    const s = Object.fromEntries(Object.entries(lhr.categories).map(([k, c]) => [k, Math.round(c.score * 100)]));
    const lcp = lhr.audits["largest-contentful-paint"].numericValue, cls = lhr.audits["cumulative-layout-shift"].numericValue;
    console.log(`lighthouse ${path.padEnd(8)} ${formFactor.padEnd(7)} perf ${s.performance} a11y ${s.accessibility} bp ${s["best-practices"]} seo ${s.seo} | LCP ${(lcp / 1000).toFixed(2)}s CLS ${cls.toFixed(3)}`);
    const lcpEl = lhr.audits["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet;
    if (lcp > 2000) console.log(`   LCP element: ${lcpEl}`);
    for (const a of Object.values(lhr.audits)) {
      if (a.score !== null && a.score < 1 && a.scoreDisplayMode === "binary") console.log(`   ✗ ${a.id}: ${a.title}`);
    }
    if (Object.values(s).some((v) => v < 95) || lcp > 2000 || cls > 0.01) problems++;
  }
  await chrome.kill();
} finally {
  server.kill();
  spawnSync("node_modules/.bin/astro", ["preview", "stop"], { stdio: "ignore" }); // in case an older server answered instead
}
process.exit(problems ? 1 : 0);
