// Scroll through a page like a reader and screenshot each viewport.
// node scripts/shot-scroll.mjs <url> <outDir> <width> [name] [--reduce]
import { chromium } from "playwright";
const [url, out, w = "1440", name = "page", flag] = process.argv.slice(2);
const width = +w;
const height = width < 600 ? 812 : width < 1100 ? 1024 : 900;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width, height }, isMobile: width < 600, hasTouch: width < 600, reducedMotion: flag === "--reduce" ? "reduce" : "no-preference" });
const p = await ctx.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(String(e)));
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await p.goto(url, { waitUntil: "networkidle" });
await p.addStyleTag({ content: "nextjs-portal{display:none!important}" });
await p.waitForTimeout(4500);
let i = 0;
let y = 0;
for (;;) {
  await p.screenshot({ path: `${out}/${name}-${width}-${String(i).padStart(2, "0")}.png` });
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  if (y + height >= total - 2 || i > 60) break;
  // Scroll in small wheel-like steps so scroll-driven scenes update naturally
  const step = Math.round(height * 0.9);
  for (let k = 0; k < 6; k++) {
    y += step / 6;
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await p.waitForTimeout(45);
  }
  await p.waitForTimeout(1300);
  i++;
}
const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log(`${i + 1} shots; horizontal overflow: ${overflow}px`);
if (errors.length) console.log("!! errors\n" + [...new Set(errors)].join("\n"));
await b.close();
