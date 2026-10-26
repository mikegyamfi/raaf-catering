// Renders favicon/app icons from the dev route (share cards: scripts/make-og.mjs).
// Usage: node scripts/make-brand.mjs http://localhost:3000
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 1400 } });
await p.goto(`${base}/dev-placeholders/`, { waitUntil: "networkidle" });
await p.addStyleTag({ content: "body::after{display:none!important} header,footer,.skip-link,canvas,.cursor-dot,nextjs-portal{display:none!important}" });
await p.waitForTimeout(2500);

const icon = await p.locator("#brand-icon").screenshot();
await b.close();

const rounded = (size) =>
  Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.22}" ry="${size * 0.22}"/></svg>`);
const roundIcon = async (size) =>
  sharp(icon).resize(size, size).composite([{ input: rounded(size), blend: "dest-in" }]).png().toBuffer();

fs.writeFileSync("public/icon-512.png", await sharp(icon).resize(512, 512).png().toBuffer());
fs.writeFileSync("public/icon-192.png", await sharp(icon).resize(192, 192).png().toBuffer());
fs.writeFileSync("public/apple-icon.png", await sharp(icon).resize(180, 180).png().toBuffer());
fs.writeFileSync("public/icon.png", await roundIcon(96));

// favicon.ico holding 16, 32 and 48px PNGs
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map(roundIcon));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
fs.writeFileSync("public/favicon.ico", Buffer.concat([header, ...entries, ...pngs]));
console.log("brand assets written");
