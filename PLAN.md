# RAAF: site plan

## What the source changed
The brief assumed a bakery. Her notes describe **RAAF Professional Catering Services**, a home-based caterer whose kitchen turns out breads, pastries, cakes, small chops *and* Ghanaian meals (jollof, waakye, banku, fufu, ampesi) for special occasions. The site keeps the bakery soul the brief asked for (wheat, milk, butter, the bake) because pastries and bread are half of what she makes. It also gives the meals and small-chops packs the full menu treatment, because that is the other half of her business. There is no shopfront, so "Visit us" becomes "Order", built around WhatsApp and an enquiry form.

## Concept: "Dawn in a home kitchen"
Before the city wakes, one kitchen is already warm: flour in the air, butter softening, an oven light on. The site moves from that first pour of flour to a full table set for a celebration, which is her own line: *good food brings people together*.

## Tokens

| Token | Hex | Role |
|---|---|---|
| `flour` | `#FBF6EE` | page ground |
| `flour-deep` | `#F3EADB` | alternate ground, cards |
| `butter` | `#F2CF74` | highlight, glow, small fills |
| `crust` | `#C7832C` | golden crust: illustration, large display only (3.1:1 on flour) |
| `toast` | `#7A4520` | toasted brown: secondary text, rules (7.4:1 on flour) |
| `cocoa` | `#2A1A11` | ink, dark "night oven" sections (16:1 on flour) |
| `palm` | `#1F3D2C` | the one deep accent: primary buttons, open-state, focus ring (palm leaf / kontomire, a nod to her Ghanaian table) |

Type: **Montserrat Alternates** (display 600–800, tight -0.035em tracking at large sizes; nav and buttons in 600) and **Poppins** (body 400 at 1.7 line-height, labels and prices 500, tabular figures for prices). The fluid scale is a 1.25 ratio on mobile and 1.333 on desktop, using `clamp()`.

Layout: a 12-column grid with a 24px gutter (16px on mobile) and a max width of 1440. Headlines sit left-aligned and break the grid, often spanning columns 1–9 against a narrow column of body copy in 9–12. Centred text is reserved for the hero wordmark and the order call.

## Principles
1. **One hero moment, one centrepiece.** The flour pour that writes "RAAF" is the opening. The pinned bake story is the centrepiece. Everything else moves only in answer to the reader (scroll reveals with clip masks, hovers, taps).
2. **Type-led menu, not card grids.** Her menu reads like a menu: long rows of names with a drawn illustration that appears on hover or focus. This is how a real kitchen menu board feels.
3. **Her words first.** Values and story copy are lifted from her notes ("Quality is our priority", "Good food. Good mood."). There are no invented stats, reviews or prices.
4. **Warm light, not decoration.** Depth comes from light: the oven glow, flour motes in a beam, butter gloss. There are no gradient washes for their own sake.

## Generic-default check (and what changed)
- *Cream + serif + terracotta* is the common tell. The brief fixes cream and sans fonts, so I kept the cream but swapped the usual terracotta accent for **palm green**, which links to her food rather than to a template.
- *Centred hero with two buttons*: the hero is a canvas scene where the wordmark is *made of flour*. Buttons arrive afterwards, left-aligned under an offset line of copy.
- *Identical card grid for best-sellers*: replaced by a menu-board index with hover illustrations.
- *Numbered 01/02/03 markers*: used **only** in the bake story, because that really is a sequence.
- *ALL-CAPS eyebrows above every heading*: none. Labels are sentence case and only appear where they carry information (category, price).

## Sections (home)
1. Preloader: a loaf browns in the oven (≤1.2s, skipped on repeat visits)
2. Hero: canvas flour/wheat pour → grains settle into the RAAF wordmark → motes drift → tagline, intro, CTAs
3. From the oven: an index of signature pastries, breads and cakes with hover illustrations and steam
4. The bake (pinned, scrubbed): flour → milk → butter → knead → rise → oven glow → golden loaf
5. Fresh from the start: milk pour fills a glass beside "Fresh ingredients · Hygiene · On time · Together"
6. Butter-melt divider
7. Menu preview: tabs for Pastries / Small chops / Breads / Cakes / Meals, using a Flip filter
8. Small chops packs: her six real combos, drawn as boxes
9. About RAAF: her words, an owner-photo slot, rising dough
10. Gallery teaser → Order call (WhatsApp / form)
11. Footer

Pages: `/menu`, `/story`, `/gallery`, `/order`.

## Animation list
Preloader loaf · flour-pour hero (canvas particles → text targets) · dust motes (canvas, paused off-screen) · SplitText line/word reveals · clip-mask image reveals · pinned bake story with MorphSVG dough → loaf · DrawSVG wheat · milk stream + wavy fill · butter melt with drips and gloss · rising dough (scrub) · oven glow breathing · steam curls · magnetic buttons · tilt-on-hover rows · wheat/flour cursor (desktop, fine pointer) · flour sprinkle on click · Flip menu filter · header shrink · full-screen mobile menu · route fade.

Easing: `expo-out cubic-bezier(.16,1,.3,1)` for reveals, `quint-in-out cubic-bezier(.83,0,.17,1)` for transitions, and a spring (stiffness 300, damping 22) for hovers.

## Self-critique scores (Awwwards SOTD standard, out of 10)
_Filled in as sections are built and screenshotted._

| Section | Pass 1 | Pass 2 | Notes |
|---|---|---|---|
| Hero: flour & wheat pour → wordmark | 7 (small wordmark, empty right half) | 9 | Wordmark enlarged to span the frame; grains sampled from the real glyphs land exactly in the letters; word waits as a faint stencil, holds as grain, then resolves |
| From the oven (signature index) | 8 | 8.5 | Type-led menu board; floating illustration follows the pointer on desktop, inline art on touch |
| Bake story (pinned) | 6 (static, layout broken) | 9 | Fixed pin CSS; powdery flour fall replaced a solid bar; glossy irregular butter melt; oven glow clipped to the oven mouth; removed snap (fought Lenis) |
| Quality is our priority + milk pour | 7 (glass too tall, icons tiny) | 8.5 | Glass sized to viewport; simulated stream, waves and splash |
| Butter-melt divider | 8 | 8.5 | Viscous drips with gloss and beads |
| Menu preview (Flip tabs) | 8 | 9 | Leavers fade, survivors glide, newcomers rise; only the active tab is in the DOM |
| Small chops packs | 6.5 (lids hid the food, sparse boxes) | 8.5 | Bigger food art; lids lift away as each box reaches centre |
| About / rising dough | 8 | 8.5 | Her own words, portrait slot, proving dough tied to scroll |
| Gallery teaser + page | 8 | 8.5 | Parallax tiles; shared-element lightbox with keys/swipe/focus return |
| Order page + form | 8 | 9 | Inline validation, WhatsApp/email hand-off, honest fallbacks |

Honest note: the bars below 9 are held back mainly by the absence of real photography. Every photo slot is a drawn placeholder. With her real pastries and portrait in the slots, those sections lift substantially.

## Performance & quality (final, static export served locally)

Lighthouse 12.8 (mobile = simulated Moto G Power with 4× CPU slowdown):

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop, all 5 pages | 96–99 | 100 | 100 | 100 |
| Mobile: Menu / Story / Gallery / Order | 83–90 | 100 | 100 | 100 |
| Mobile: Home | 76–81 typical (one run 58) | 100 | 100 | 100 |

CLS is 0.00 everywhere. Observed (real) LCP on mobile is about 0.25s. The higher simulated LCP comes from Lighthouse modelling the JS bundle (GSAP + plugins, Framer Motion, React). Fixes made along the way:
- Removed a full-screen `mix-blend-mode` grain layer and animated CSS blurs.
- Exported the 34 food illustrations as static SVGs, cutting the DOM roughly in half.
- Lazy-built the bake timeline and the reveal animations.
- Removed root-level state updates that forced hydration to finish in one task.
- Disabled viewport link prefetch, which re-rendered the router tree (~2s throttled).
- Worked around a Windows-only Next.js export bug.
