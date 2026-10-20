// Subsets the site fonts to the glyphs the site actually uses and writes woff2 files to public/fonts.
// CJK fonts keep only characters that are rendered: with --dist they are read from the built HTML
// (and the fonts are written into dist/ as well); without it, from src/ as a superset for development.
// Latin fonts keep a fixed Latin + punctuation range.
// Source fonts (OFL, google/fonts) are downloaded once into .fonts-cache/.
import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, relative } from "node:path";
import subsetFont from "subset-font";

const ROOT = new URL("..", import.meta.url).pathname;
const CACHE = join(ROOT, ".fonts-cache");
const OUT = join(ROOT, "public/fonts");
const FROM_DIST = process.argv.includes("--dist");
const SRC_DIRS = FROM_DIST ? ["dist"] : ["src"];
const TEXT_EXT = new Set(FROM_DIST ? [".html"] : [".astro", ".ts", ".md", ".mdx", ".json", ".css"]);
// internal pages that may fall back to system fonts rather than grow every visitor's download
const SKIP = new Set(["src/pages/styleguide.astro", "dist/styleguide/index.html"]);
const GF = "https://raw.githubusercontent.com/google/fonts/main/ofl/";

const DISPLAY = "Fearnot";
// ASCII plus the typographic marks copy actually uses; full Latin-1 would add ~100 unused accented glyphs
const LATIN = range(0x20, 0x7e) + "\u00a0©·×éèüöä–—‘’“”…•→←↑↓↗€";

const fonts = [
  // body text: optical size pinned to text size, which halves the file
  { src: "literata/Literata[opsz,wght].ttf", out: "literata.woff2", text: () => LATIN, axes: { opsz: 18, wght: { min: 400, max: 600 } } },
  // display: only the glyphs of the hero name, cut at the display optical size
  { src: "literata/Literata[opsz,wght].ttf", out: "literata-display.woff2", text: () => DISPLAY, axes: { opsz: 72, wght: 600 } },
  { src: "fragmentmono/FragmentMono-Regular.ttf", out: "fragment-mono.woff2", text: () => LATIN },
  // two static cuts are ~40% smaller than one variable file; bold only needs the glyphs that are ever set bold
  { src: "notoseriftc/NotoSerifTC[wght].ttf", out: "noto-serif-tc-400.woff2", text: cjk, axes: { wght: 400 } },
  { src: "notoseriftc/NotoSerifTC[wght].ttf", out: "noto-serif-tc-600.woff2", text: cjkBold, axes: { wght: 600 } },
];

function range(a, b) { let s = ""; for (let i = a; i <= b; i++) s += String.fromCodePoint(i); return s; }

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    if ((await stat(p)).isDirectory()) out.push(...(await walk(p)));
    else if (TEXT_EXT.has(extname(p)) && !SKIP.has(relative(ROOT, p))) out.push(p);
  }
  return out;
}

let cjkCache;
async function cjk() {
  if (cjkCache) return cjkCache;
  const files = (await Promise.all(SRC_DIRS.map((d) => walk(join(ROOT, d))))).flat();
  const chars = new Set();
  for (const f of files) {
    let text = await readFile(f, "utf8");
    if (FROM_DIST) text = text.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, ""); // JSON-LD and CSS are not rendered
    for (const ch of text) if (ch.codePointAt(0) > 0x2e7f) chars.add(ch);
  }
  // always keep CJK punctuation and full-width forms so new copy never falls back mid-sentence
  for (const ch of "，。、；：？！「」『』（）《》〈〉【】—…・～　％＃＆＊＋－／＝") chars.add(ch);
  return (cjkCache = " " + [...chars].join("")); // Latin comes from Literata / Fragment Mono
}

// bold CJK appears only in section headings, entry titles and the real name; read them from the source itself
async function cjkBold() {
  const data = await import(new URL("../src/data/profile.ts", import.meta.url).href);
  const { ui } = await import(new URL("../src/i18n.ts", import.meta.url).href);
  const titles = [data.person.name, ...Object.values(ui), ...[data.experience, data.education, data.projects].flat().flatMap((e) => [e.title, e.org])];
  return " " + [...new Set(titles.flatMap((t) => [...t.zh]).filter((ch) => ch.codePointAt(0) > 0x2e7f))].join("") + "，、（）／";
}

async function source(path) {
  const file = join(CACHE, path.split("/").pop());
  if (!existsSync(file)) {
    const url = GF + path.replace("[", "%5B").replace("]", "%5D");
    const res = await fetch(url);
    if (!res.ok) throw new Error(`download failed ${res.status}: ${url}`);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
  }
  return readFile(file);
}

// Deploy servers have no .fonts-cache: rather than download ~30 MB per build (and fail when GitHub
// is slow), keep the committed public/fonts, which a local `npm run build` already narrowed.
if (FROM_DIST && fonts.some((f) => !existsSync(join(CACHE, f.src.split("/").pop())))) {
  console.log("fonts: no local source cache, keeping committed subsets in public/fonts");
  process.exit(0);
}

await mkdir(CACHE, { recursive: true });
await mkdir(OUT, { recursive: true });
for (const f of fonts) {
  const text = await f.text();
  const buf = await subsetFont(await source(f.src), text, { targetFormat: "woff2", variationAxes: f.axes });
  await writeFile(join(OUT, f.out), buf);
  if (FROM_DIST) await writeFile(join(ROOT, "dist/fonts", f.out), buf);
  console.log(`${f.out.padEnd(22)} ${(buf.length / 1024).toFixed(1).padStart(7)} KB  (${[...text].length} glyphs requested)`);
}
