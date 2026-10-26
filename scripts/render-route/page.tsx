// Render route for placeholder photos and brand assets.
// To regenerate: copy this file to src/app/dev-placeholders/page.tsx, run `npm run dev`,
// run scripts/make-placeholders.mjs and scripts/make-brand.mjs, then delete the copy.
// (Share cards don't need this route: see scripts/make-og.mjs.)
import { Illustration, illustrationNames, type IllustrationName } from "@/components/illustrations";
import { gallery } from "@/lib/content";
import { SteamCurl } from "@/components/layout/Wordmark";

const plated = new Set<IllustrationName>(["jollof", "friedRice", "riceStew", "waakye", "tilapia", "yam", "plantain", "soupBowl", "banku", "chips", "table", "wheat"]);

const slots: { id: string; illo: IllustrationName; w: number; h: number; bg: string }[] = [
  { id: "owner", illo: "table", w: 1200, h: 1500, bg: "#efe2c9" },
  { id: "kitchen", illo: "table", w: 1600, h: 1200, bg: "#f3e6cf" },
  ...gallery.map((g, i) => ({
    id: `gallery-${String(i + 1).padStart(2, "0")}`,
    illo: g.illustration,
    w: g.ratio === "wide" ? 1600 : g.ratio === "tall" ? 1200 : 1400,
    h: g.ratio === "wide" ? 1200 : g.ratio === "tall" ? 1500 : 1400,
    bg: ["#f3e6cf", "#efe0c4", "#f6ead6", "#ecdcc0"][i % 4],
  })),
];

export default function Page() {
  return (
    <div style={{ background: "#fff" }}>
      {/* Every illustration, exported to /public/illustrations/*.svg */}
      <div id="illos">
        {illustrationNames.map((n) => (
          <Illustration key={n} name={n} data-illo={n} width={200} height={200} />
        ))}
      </div>
      {/* App icon */}
      <div id="brand-icon" style={{ width: 512, height: 512, background: "#2a1a11", display: "grid", placeItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 62%, rgba(242,163,60,0.45), transparent 62%)" }} />
        <span style={{ position: "relative", fontFamily: "var(--font-montserrat-alt)", fontWeight: 800, fontSize: 330, letterSpacing: "-0.06em", lineHeight: 1, color: "#f2cf74", marginTop: -20 }}>R</span>
        <div style={{ position: "absolute", right: 92, top: 70, width: 70, height: 140, color: "#c7832c", transform: "rotate(18deg)" }}>
          <SteamCurl />
        </div>
      </div>
      {slots.map((s) => (
        <div
          key={s.id}
          id={`ph-${s.id}`}
          style={{
            width: s.w,
            height: s.h,
            position: "relative",
            overflow: "hidden",
            background: `radial-gradient(120% 90% at 30% 20%, #fff8ea 0%, ${s.bg} 55%, #d9c29b 120%)`,
          }}
        >
          {/* linen texture lines */}
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
            <defs>
              <pattern id={`lin-${s.id}`} width="14" height="14" patternUnits="userSpaceOnUse">
                <path d="M0 7 H14 M7 0 V14" stroke="#b58a52" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#lin-${s.id})`} />
          </svg>
          {/* warm light leak */}
          <div style={{ position: "absolute", right: "-15%", top: "-25%", width: "70%", height: "80%", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,226,160,0.7), transparent 65%)" }} />
          {/* plate (skipped when the drawing brings its own) */}
          {plated.has(s.illo) ? null : <div
            style={{
              position: "absolute",
              left: "50%",
              top: "54%",
              width: Math.min(s.w, s.h) * 0.72,
              height: Math.min(s.w, s.h) * 0.72,
              transform: "translate(-50%,-50%)",
              borderRadius: "50%",
              background: "radial-gradient(circle at 40% 35%, #fffdf8, #f1e8d8 70%, #e2d3b8)",
              boxShadow: "0 40px 80px -30px rgba(42,26,17,0.45), inset 0 -10px 30px rgba(122,69,32,0.12)",
            }}
          />}
          <Illustration
            name={s.illo}
            style={{ position: "absolute", left: "50%", top: "52%", width: Math.min(s.w, s.h) * (plated.has(s.illo) ? 0.82 : 0.6), height: Math.min(s.w, s.h) * (plated.has(s.illo) ? 0.82 : 0.6), transform: "translate(-50%,-50%)", filter: "drop-shadow(0 30px 30px rgba(42,26,17,0.25))" }}
          />
          <div
            style={{
              position: "absolute",
              left: 40,
              bottom: 36,
              fontFamily: "var(--font-poppins)",
              fontSize: Math.min(s.w, s.h) * 0.02,
              color: "rgba(122,69,32,0.75)",
              letterSpacing: "0.01em",
            }}
          >
            Photo coming soon
          </div>
        </div>
      ))}
    </div>
  );
}
