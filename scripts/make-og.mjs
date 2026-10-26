// Renders the Open Graph share cards shown when a link is shared on WhatsApp,
// Facebook, X, LinkedIn, iMessage, Slack… One card per page, 1200×630.
// Self-contained: no dev server needed (brand fonts load from Google Fonts,
// food art from public/illustrations).
// Usage: node scripts/make-og.mjs
//
// Cards are JPEGs kept well under 300 KB: WhatsApp drops larger images and
// falls back to a plain text link.
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";

const DOMAIN = "www.raafcatering.com";

/** The home card leads with the wordmark; the others with the page's own headline. */
const cards = [
  { out: "public/og.jpg", art: ["pie", "bofrot", "loaf"] },
  { out: "public/og/menu.jpg", title: "The menu", line: "Meat pies, bofrot, butter bread, jollof, waakye, banku & more", art: ["springRoll", "jollof", "sausageRoll"] },
  { out: "public/og/order.jpg", title: "Plan your order", line: "Birthdays, weddings, naming ceremonies, meetings & Sunday lunch", art: ["cake", "pie", "samosa"] },
  { out: "public/og/gallery.jpg", title: "From our kitchen", line: "Fresh from the oven, off the stove and onto your table", art: ["chocolateCake", "tilapia", "marbleLoaf"] },
  { out: "public/og/story.jpg", title: "Our story", line: "A home kitchen and a simple belief: good food brings people together", art: ["loaf", "rockBun", "bananaBread"] },
];

const illo = (name) => `data:image/svg+xml;base64,${fs.readFileSync(`public/illustrations/${name}.svg`).toString("base64")}`;

// The brand's steam curl (src/components/layout/Wordmark.tsx)
const steam = `<svg viewBox="0 0 24 40" fill="none" stroke="currentColor" stroke-linecap="round" style="width:100%;height:100%"><path d="M8 38 C3 31 13 27 8 20 C4 14 11 10 8 3" stroke-width="2.6"/><path d="M16.5 36 C12.5 30 20.5 27 16.5 21 C13.5 16.5 19 13.5 16.5 8" stroke-width="2" opacity="0.6"/></svg>`;

const card = ({ title, line, art }) => `
<div class="card">
  <div class="glow"></div><div class="glow2"></div>
  <div class="board"></div><div class="board top"></div>
  <img class="a0" src="${illo(art[0])}"><img class="a1" src="${illo(art[1])}"><img class="a2" src="${illo(art[2])}">
  ${
    title
      ? `<div class="mark small"><span class="raaf">RAAF<span class="curl">${steam}</span></span><span class="sub">Professional<br>Catering Services</span></div>
         <div class="head"><div class="title">${title}</div><div class="line">${line}</div></div>`
      : `<div class="mark"><span class="raaf">RAAF<span class="curl">${steam}</span></span></div>
         <div class="kicker">Professional Catering Services</div>
         <div class="head home"><div class="title">Good food.<br>Great moments.</div></div>`
  }
  <div class="pill">${DOMAIN}</div>
</div>`;

const css = `
* { margin: 0; box-sizing: border-box; }
body { background: #000; }
.card { width: 1200px; height: 630px; position: relative; overflow: hidden; background: #2a1a11; color: #fbf6ee; font-family: Poppins, sans-serif; }
.glow { position: absolute; right: -260px; top: -40px; width: 980px; height: 980px; border-radius: 50%; background: radial-gradient(circle, rgba(255,196,102,.5), rgba(199,131,44,.2) 38%, rgba(166,77,20,.06) 58%, transparent 70%); }
.glow2 { position: absolute; left: -200px; top: -260px; width: 700px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(242,207,116,.14), transparent 65%); }
.board { position: absolute; right: -10px; bottom: 44px; width: 560px; height: 156px; border-radius: 50%; background: #4a2a13; }
.board.top { bottom: 56px; height: 150px; background: radial-gradient(70% 80% at 45% 30%, #a56a36, #8a5427 70%); box-shadow: inset 0 -6px 0 rgba(0,0,0,.12); }
img { position: absolute; filter: drop-shadow(0 34px 34px rgba(0,0,0,.45)); }
/* Each drawing's own ground shadow sits at 86% of its height: back one at y≈452, front pair at y≈522 */
.a0 { right: 125px; top: 194px; width: 300px; height: 300px; }
.a1 { right: 300px; top: 316px; width: 240px; height: 240px; }
.a2 { right: 40px; top: 298px; width: 260px; height: 260px; }
.mark { position: absolute; left: 66px; top: 64px; display: flex; align-items: flex-end; color: #f2cf74; }
.raaf { position: relative; font-family: "Montserrat Alternates"; font-weight: 800; font-size: 236px; line-height: .86; letter-spacing: -.065em; }
.mark.small .raaf { font-size: 64px; }
.curl { position: absolute; right: -.3em; top: -.42em; width: .3em; height: .55em; color: #c7832c; }
.sub { font-family: "Montserrat Alternates"; font-weight: 600; font-size: 22px; line-height: 1.1; color: rgba(251,246,238,.75); margin: 0 0 4px 34px; }
.kicker { position: absolute; left: 74px; top: 296px; font-family: "Montserrat Alternates"; font-weight: 600; font-size: 32px; letter-spacing: -.015em; color: rgba(251,246,238,.8); }
.head { position: absolute; left: 72px; top: 196px; width: 640px; }
.head.home { top: 360px; }
.title { font-family: "Montserrat Alternates"; font-weight: 800; font-size: 92px; line-height: .98; letter-spacing: -.045em; }
.head.home .title { font-size: 58px; }
.line { margin-top: 22px; max-width: 560px; font-size: 25px; line-height: 1.4; color: rgba(251,246,238,.78); }
.pill { position: absolute; left: 72px; bottom: 54px; padding: 12px 24px; border-radius: 999px; background: #f2cf74; color: #2a1a11; font-family: "Montserrat Alternates"; font-weight: 700; font-size: 24px; letter-spacing: -.01em; }
`;

const fonts = "https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@600;700;800&family=Poppins:wght@400;500&display=block";

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
fs.mkdirSync("public/og", { recursive: true });
for (const c of cards) {
  await p.setContent(`<!doctype html><html><head><link rel="stylesheet" href="${fonts}"><style>${css}</style></head><body>${card(c)}</body></html>`, { waitUntil: "networkidle" });
  const ok = await p.evaluate(async () => {
    await Promise.all(['800 40px "Montserrat Alternates"', '600 40px "Montserrat Alternates"', '400 20px "Poppins"'].map((f) => document.fonts.load(f)));
    return document.fonts.check('800 40px "Montserrat Alternates"') && document.fonts.check('400 20px "Poppins"');
  });
  if (!ok) throw new Error("Brand fonts didn't load (needs internet for Google Fonts)");
  const shot = await p.locator(".card").screenshot();
  const info = await sharp(shot).jpeg({ quality: 86, mozjpeg: true }).toFile(c.out);
  console.log(`${c.out}  ${Math.round(info.size / 1024)} KB`);
}
await b.close();
