// Screenshot helper used during development.
// node scripts/shot.mjs <url> <outDir> [--w=1440,375] [--times=500,1500] [--scroll=0] [--full] [--reduce] [--name=x]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [url, outDir, ...flags] = process.argv.slice(2);
const opt = Object.fromEntries(flags.map((f) => f.replace(/^--/, "").split("=")).map(([k, v]) => [k, v ?? true]));
const widths = String(opt.w ?? "1440,375").split(",").map(Number);
const times = String(opt.times ?? "4500").split(",").map(Number);
const scrolls = String(opt.scroll ?? "0").split(",").map(Number);
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
for (const w of widths) {
  const h = w < 600 ? 812 : w < 1100 ? 1024 : w >= 1900 ? 1080 : 900;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: opt.reduce ? "reduce" : "no-preference", hasTouch: w < 600, isMobile: w < 600 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  let elapsed = 0;
  for (const sc of scrolls) {
    if (sc) {
      // Scroll in steps so scroll-driven scenes update like a real user
      const steps = 12;
      const start = await page.evaluate(() => window.scrollY);
      for (let i = 1; i <= steps; i++) {
        await page.mouse.wheel(0, (sc - start) / steps);
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(1400);
    }
    for (const t of times) {
      await page.waitForTimeout(Math.max(0, t - elapsed));
      elapsed = t;
      const file = path.join(outDir, `${opt.name ?? "shot"}-${w}-s${sc}-t${t}.png`);
      await page.screenshot({ path: file, fullPage: !!opt.full });
      console.log(file);
    }
    elapsed = 0;
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) console.log(`!! horizontal overflow at ${w}px: ${overflow}px`);
  if (errors.length) console.log(`!! console errors at ${w}px:\n` + errors.join("\n"));
  await ctx.close();
}
await browser.close();
