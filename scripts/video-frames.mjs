// Frame tools built on the installed Google Chrome (decodes H.264; no ffmpeg needed).
//   sheet:   node scripts/video-frames.mjs sheet <video.mp4> <out.png> [cols=6]
//   extract: node scripts/video-frames.mjs extract <video.mp4> <outDir> <from> <to> <count> <width> [crop x,y,w,h as fractions] [quality]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";

const [mode, video, out, ...rest] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage();
// Serve the clip over local HTTP so the canvas isn't tainted (file:// is)
const file = path.resolve(video);
const server = http
  .createServer((req, res) => {
    if (req.url === "/") {
      res.writeHead(200, { "content-type": "text/html" });
      return res.end(`<video id="v" src="/v.mp4" muted preload="auto"></video><canvas id="c"></canvas>`);
    }
    const size = fs.statSync(file).size;
    const m = /bytes=(\d+)-(\d*)/.exec(req.headers.range || "");
    const start = m ? +m[1] : 0;
    const end = m && m[2] ? +m[2] : size - 1;
    res.writeHead(m ? 206 : 200, { "content-type": "video/mp4", "accept-ranges": "bytes", "content-length": end - start + 1, ...(m ? { "content-range": `bytes ${start}-${end}/${size}` } : {}) });
    fs.createReadStream(file, { start, end }).pipe(res);
  })
  .listen(0);
await p.goto(`http://127.0.0.1:${server.address().port}/`);
await p.waitForFunction(() => document.getElementById("v").readyState >= 1, null, { timeout: 30000 });
const meta = await p.evaluate(() => {
  const v = document.getElementById("v");
  return { d: v.duration, w: v.videoWidth, h: v.videoHeight };
});

const grab = (t, w, crop, q, type) =>
  p.evaluate(
    async ({ t, w, crop, q, type }) => {
      const v = document.getElementById("v");
      await new Promise((r) => {
        v.onseeked = r;
        v.currentTime = t;
      });
      const [cx, cy, cw, ch] = crop;
      const sw = v.videoWidth * cw;
      const sh = v.videoHeight * ch;
      const c = document.getElementById("c");
      c.width = w;
      c.height = Math.round((w * sh) / sw);
      c.getContext("2d").drawImage(v, v.videoWidth * cx, v.videoHeight * cy, sw, sh, 0, 0, c.width, c.height);
      return c.toDataURL(type, q);
    },
    { t, w, crop, q, type },
  );

if (mode === "sheet") {
  const cols = +(rest[0] ?? 6);
  const frames = [];
  for (let i = 0; i < cols; i++) frames.push(await grab((meta.d * (i + 0.5)) / cols, 320, [0, 0, 1, 1], 0.8, "image/jpeg"));
  const html = `<body style="margin:0;background:#111;display:flex;flex-wrap:wrap;width:${320 * cols}px">${frames.map((f, i) => `<div style="position:relative"><img src="${f}" style="display:block;width:320px"><span style="position:absolute;left:6px;top:4px;color:#fff;font:14px sans-serif;text-shadow:0 0 3px #000">${((meta.d * (i + 0.5)) / cols).toFixed(1)}s</span></div>`).join("")}</body>`;
  await p.setContent(html);
  await p.setViewportSize({ width: 320 * cols, height: 400 });
  await p.screenshot({ path: out, fullPage: true });
  console.log(`${path.basename(video)}: ${meta.d.toFixed(1)}s ${meta.w}x${meta.h}`);
} else if (mode === "extract") {
  const [from, to, count, width, crop = "0,0,1,1", quality = "0.8"] = rest;
  const cr = crop.split(",").map(Number);
  fs.mkdirSync(out, { recursive: true });
  const n = +count;
  let bytes = 0;
  for (let i = 0; i < n; i++) {
    const t = Math.min(meta.d - 0.05, +from + ((+to - +from) * i) / Math.max(1, n - 1));
    const data = await grab(t, +width, cr, +quality, "image/webp");
    const buf = Buffer.from(data.split(",")[1], "base64");
    bytes += buf.length;
    fs.writeFileSync(path.join(out, `${String(i).padStart(3, "0")}.webp`), buf);
  }
  console.log(`${n} frames → ${out} (${(bytes / 1024 / 1024).toFixed(2)} MB)`);
}
await b.close();
server.close();
