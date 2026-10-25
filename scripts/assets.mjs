// Generates the static assets that need a real browser:
//   public/pdf/*.pdf  Resume (zh only), one A4 page, via the print stylesheet
//   public/og/*.png   1200×630 social cards rendered from /og/[slug]
// Usage: npm run assets  (builds, serves dist/ locally, renders, stops the server). Rerun after editing content.
import { spawn, spawnSync } from "node:child_process";
import { readFile, mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const PORT = 4399;
const jobs = [
  { path: "/resume/", out: "resume-zh.pdf", maxPages: 1 },
];

const server = spawn("node_modules/.bin/astro", ["preview", "--port", String(PORT)], { stdio: ["ignore", "pipe", "inherit"] });
await new Promise((ok, fail) => {
  server.stdout.on("data", (d) => String(d).includes(String(PORT)) && ok());
  server.on("exit", (c) => fail(new Error(`preview exited ${c}`)));
});

const browser = await chromium.launch();
let failed = false;
try {
  for (const j of jobs) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}${j.path}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const file = `public/pdf/${j.out}`;
    await page.pdf({ path: file, format: "A4", preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
    const pages = ((await readFile(file, "latin1")).match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    console.log(`${file.padEnd(24)} ${pages} page(s)`);
    if (j.maxPages && pages > j.maxPages) { console.error(`  ✗ ${j.path} must fit on ${j.maxPages} page`); failed = true; }
    await page.close();
  }
  await mkdir("public/og", { recursive: true });
  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const slug of ["home-zh", "home-en", "resume-zh"]) {
    await og.goto(`http://localhost:${PORT}/og/${slug}/`, { waitUntil: "networkidle" });
    await og.evaluate(() => document.fonts.ready);
    await og.screenshot({ path: `public/og/${slug}.png`, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  }
  console.log("public/og/*.png          3 cards");
} finally {
  await browser.close();
  server.kill();
  spawnSync("node_modules/.bin/astro", ["preview", "stop"], { stdio: "ignore" }); // in case an older server answered instead
}
process.exit(failed ? 1 : 0);
