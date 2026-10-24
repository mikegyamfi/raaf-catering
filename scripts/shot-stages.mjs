// Screenshot each stage of the pinned bake story.
// node scripts/shot-stages.mjs <url> <outDir> <width>
import { chromium } from "playwright";
const [url, out, w = "1440"] = process.argv.slice(2);
const width = +w;
const height = width < 600 ? 812 : 900;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width, height }, isMobile: width < 600, hasTouch: width < 600 });
const errors = [];
p.on("pageerror", (e) => errors.push(String(e)));
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await p.goto(url, { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
const top = await p.evaluate(() => document.querySelector("[aria-labelledby='bake-title']").getBoundingClientRect().top + window.scrollY);
for (let i = 0; i < 7; i++) {
  const y = top + height * 0.9 * (i + 0.7);
  await p.evaluate((y) => window.scrollTo(0, y), y);
  await p.waitForTimeout(2600);
  await p.screenshot({ path: `${out}/bake-${width}-${i}.png` });
  console.log(`${out}/bake-${width}-${i}.png`);
}
if (errors.length) console.log("!! errors\n" + errors.join("\n"));
await b.close();
