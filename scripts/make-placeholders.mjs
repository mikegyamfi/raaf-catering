// Renders the drawn placeholder photos into /public/photos/REPLACE-*.webp
// Usage (with `npm run dev` running and src/app/dev-placeholders present):
//   node scripts/make-placeholders.mjs http://localhost:3000
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
fs.mkdirSync("public/photos", { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 1600 } });
await p.goto(`${base}/dev-placeholders/`, { waitUntil: "networkidle" });
await p.addStyleTag({ content: "body::after{display:none!important} header,footer,.skip-link,canvas,.cursor-dot,nextjs-portal{display:none!important}" });
await p.waitForTimeout(2500);
const ids = await p.$$eval("[id^=ph-]", (els) => els.map((e) => e.id));
for (const id of ids) {
  const buf = await p.locator(`#${id}`).screenshot({ animations: "disabled" });
  const out = `public/photos/REPLACE-${id.replace("ph-", "")}.webp`;
  await sharp(buf).resize({ width: 1400, height: 1400, fit: "inside" }).webp({ quality: 78 }).toFile(out);
  console.log(out);
}
await b.close();
