// Exports each React illustration to a static SVG file in /public/illustrations.
// Static files keep thousands of SVG nodes out of React hydration.
// Usage: copy scripts/render-route/page.tsx to src/app/dev-placeholders/page.tsx,
// run `npm run dev`, then: node scripts/make-illustrations.mjs http://localhost:3000
import { chromium } from "playwright";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
fs.mkdirSync("public/illustrations", { recursive: true });
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(`${base}/dev-placeholders/`, { waitUntil: "networkidle" });
const svgs = await p.$$eval("[data-illo]", (els) =>
  els.map((el) => {
    const c = el.cloneNode(true);
    c.removeAttribute("data-illo");
    c.removeAttribute("aria-hidden");
    c.removeAttribute("class");
    c.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return [el.getAttribute("data-illo"), c.outerHTML];
  }),
);
for (const [name, svg] of svgs) {
  // Trim float noise to keep files small
  const min = svg.replace(/(\d+\.\d{2})\d+/g, "$1");
  fs.writeFileSync(`public/illustrations/${name}.svg`, min);
}
console.log(`${svgs.length} illustrations written`);
await b.close();
