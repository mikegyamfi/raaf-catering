// Screenshot the butter-melt divider at several scroll positions.
import { chromium } from "playwright";
const [url, out, w = "1440"] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: 900 } });
const errors = [];
p.on("pageerror", (e) => errors.push(String(e)));
await p.goto(url, { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
const top = await p.evaluate(() => {
  const el = document.querySelector("#bm-crust").closest("div");
  return el.getBoundingClientRect().top + window.scrollY;
});
for (const [i, off] of [[0, 760], [1, 600], [2, 450], [3, 300], [4, 150]].entries ? [[0, 760], [1, 600], [2, 450], [3, 300], [4, 150]] : []) {
  await p.evaluate((y) => window.scrollTo(0, y), top - off);
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `${out}/butter-${w}-${i}.png`, clip: { x: 0, y: off - 60, width: +w, height: 420 } });
}
if (errors.length) console.log(errors.join("\n"));
await b.close();
