# RAAF Professional Catering Services: website

*Good food. Great moments.*

A static website for RAAF, built with Next.js (App Router), TypeScript, Tailwind CSS, GSAP and Lenis smooth scrolling, plus Framer Motion. It exports to plain HTML/CSS/JS, so it can be hosted anywhere.

Pages: **Home**, **Menu**, **Our story**, **Gallery**, **Order**.

---

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000, updates live as you edit
```

To build the finished site:

```bash
npm run build      # writes the static site to ./out
npm start          # preview ./out at http://localhost:3000
```

---

## Edit the content

Almost everything lives in one file: **`src/lib/content.ts`**.

| What | Where in `content.ts` |
|---|---|
| Phone, WhatsApp, email, area/address, socials | `business` |
| Opening / order hours (powers the "Open now" badge) | `hours` and `timeZone` |
| Menu items, descriptions, prices | `menu` |
| Small-chops packs and their prices | `packs` |
| About text ("About RAAF", "Why choose us?") | `about` |
| The four promises | `promises` |
| Bake-story lines | `bakeStages` |
| Gallery captions | `gallery` |

**Placeholders.** Anything not known yet is written like `{{PHONE}}`. Search the file for `{{` to find every gap. The site never shows these tokens. It shows a graceful fallback instead, such as "Phone number coming soon" or "Price on request", and hides the WhatsApp/Call buttons and the map until real details are filled in.

- **Phone / WhatsApp**: digits only with the country code, for example `233201234567`. This switches on click-to-call, the WhatsApp buttons, and the order form's WhatsApp hand-off.
- **Prices**: set `price: "60"` on a menu item or pack, and set `business.currency` (e.g. `"GH₵"`).
- **Hours**: see the example in the comment above `hours`. Times are 24-hour.
- **Map**: appears on the Order page once `area` or `address` is set.

### Order form

The form validates in the browser. With no backend, it opens WhatsApp (or email) with the order details filled in. To receive submissions directly, paste a form endpoint (e.g. from Formspree) into `ORDER_ENDPOINT` at the top of `src/components/order/OrderForm.tsx`.

---

## Replace the photos

Drawn placeholders live in `public/photos/`, named `REPLACE-*.webp`:

| File | Used for |
|---|---|
| `REPLACE-owner.webp` | Portrait on Home and Our story (4:5 portrait) |
| `REPLACE-kitchen.webp` | Spare kitchen shot |
| `REPLACE-gallery-01.webp` … `-12.webp` | Gallery, in the order listed in `content.ts` → `gallery` |

Save the real photo as WebP **with the same file name** and it appears everywhere that slot is used. If you have a JPG, either convert it to WebP or put it in `public/photos/` and change the matching `src` in `content.ts` to the `.jpg` name (don't just rename a JPG to `.webp`). About 1600px on the long side is plenty. Update the caption in `content.ts` if needed.

---

## Deploy

**Vercel** (simplest): push this folder to GitHub, import it at vercel.com, and accept the defaults. Every push redeploys.

**Netlify**: import the repo with build command `npm run build` and publish directory `out`. Or run `npm run build` and drag the `out` folder onto app.netlify.com/drop.

**Any web host**: upload the contents of `out/`.

After deploying, set `business.siteUrl` in `content.ts` to the real domain (used in the sitemap, social previews and search data).

---

## How it's put together

```
src/
  app/                 pages (home, menu, story, gallery, order), layout, SEO files
  components/
    hero/              flour & wheat pour (canvas particle engine)
    story/             pinned scroll-scrubbed bake story (SVG + GSAP)
    sections/          home sections: milk pour, butter melt, rising dough, packs…
    menu/              filterable menu (GSAP Flip)
    gallery/           masonry + lightbox
    motion/            smooth scroll, reveals, preloader, cursor, steam
    illustrations/     the hand-drawn food art (React source)
  lib/content.ts       ← all the business content
  lib/gsap.ts          GSAP plugins + easing tokens
public/illustrations/  the same food art exported as static SVGs (used on the site)
public/photos/         photo slots
scripts/               dev tools: screenshots, asset generators, export fix
```

**Motion.** All animation respects *reduced motion*. Visitors who ask for less motion get a calm, fully designed version with static scenes and soft fades. Canvas and continuous loops pause when off-screen.

**Editing the illustrations.** The food drawings are React SVG in `src/components/illustrations/index.tsx`. After changing them, regenerate the static files:

1. Copy `scripts/render-route/page.tsx` to `src/app/dev-placeholders/page.tsx`.
2. Run `npm run dev`.
3. Run `node scripts/make-illustrations.mjs http://localhost:3000`. Use `make-placeholders.mjs` for the photo placeholders and `make-brand.mjs` for the favicon and social image.
4. Delete `src/app/dev-placeholders/` again before building.

**Windows note.** `npm run build` runs `scripts/fix-export-paths.mjs` afterwards. It works around a Next.js bug that misnames prefetch files when building on Windows. It does nothing on macOS/Linux.

---

Source notes: `_source/` holds the original WhatsApp photos, a transcript (`TRANSCRIPT.md`) and the business inventory (`INVENTORY.md`). Design notes are in `PLAN.md`.
