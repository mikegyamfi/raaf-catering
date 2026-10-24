"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";

/**
 * Section divider: the domed top crust of a warm loaf, seen slightly from
 * above, with a cold pat of butter sitting on it. As you scroll past:
 *  - the pat softens: corners round, it slumps and spreads at the base, its
 *    sheen turns oily;
 *  - a glossy pool spreads across the crust and soaks in (the crust darkens
 *    where it's wet);
 *  - where the pool reaches the front edge, drips run down the crust. They
 *    neck in, the bead at the tip swells, and it lets go and falls under gravity.
 *
 * Realism comes from light, not outlines: SVG lighting filters give the
 * butter its gloss and the crust its bumpy, baked texture. Every butter shape
 * is recomputed per frame from a single melt value.
 */

const W = 1440;
const H = 330;
const CX = 720;

// Crust geometry: a gentle dome, seen a little from above
const front = (x: number) => 150 + 34 * ((x - CX) / CX) ** 2; // front (near) edge of the top surface
const back = (x: number) => front(x) - 36 + 8 * ((x - CX) / CX) ** 2; // far edge
const FACE = 78; // depth of the crust's front face

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Drips: where they run, how far, how thick
const DRIPS = [
  { x: 470, max: 92, w: 15 },
  { x: 548, max: 150, w: 19 },
  { x: 612, max: 70, w: 13 },
  { x: 676, max: 182, w: 22 },
  { x: 742, max: 118, w: 17 },
  { x: 806, max: 160, w: 20 },
  { x: 872, max: 84, w: 14 },
  { x: 938, max: 132, w: 17 },
  { x: 1004, max: 76, w: 13 },
];

function patPath(m: number) {
  // m: 0 = cold block, 1 = collapsed into the pool
  const baseY = front(CX) - 7;
  const h = 70 * (1 - m) ** 1.25 + 3;
  const w = 150 + 150 * m ** 1.4;
  const r = 9 + 30 * m;
  const dome = 9 * m * (1 - m * 0.6);
  const flare = 26 * m;
  const L = CX - w / 2;
  const R = CX + w / 2;
  const T = baseY - h;
  return [
    `M${L - flare} ${baseY}`,
    `C${L - flare * 0.3} ${baseY} ${L} ${baseY - h * 0.22} ${L} ${T + r}`,
    `C${L} ${T + r * 0.35} ${L + r * 0.45} ${T - dome * 0.4} ${L + r} ${T - dome * 0.7}`,
    `C${CX - w * 0.22} ${T - dome} ${CX + w * 0.22} ${T - dome} ${R - r} ${T - dome * 0.7}`,
    `C${R - r * 0.45} ${T - dome * 0.4} ${R} ${T + r * 0.35} ${R} ${T + r}`,
    `C${R} ${baseY - h * 0.22} ${R + flare * 0.3} ${baseY} ${R + flare} ${baseY}`,
    "Z",
  ].join(" ");
}

/** The pat's top face, seen from slightly above; flattens away as it melts */
function patTopPath(m: number) {
  const baseY = front(CX) - 7;
  const h = 70 * (1 - m) ** 1.25 + 3;
  const w = 150 + 150 * m ** 1.4;
  const depth = 22 * (1 - m) ** 1.5;
  const r = 9 + 30 * m;
  const T = baseY - h - 9 * m * (1 - m * 0.6) * 0.7;
  const L = CX - w / 2 + r * 0.7;
  const R = CX + w / 2 - r * 0.7;
  return `M${L} ${T} C${L + 6} ${T - depth} ${L + 14} ${T - depth} ${L + 22} ${T - depth} L${R + 6} ${T - depth} C${R + 10} ${T - depth} ${R + 6} ${T} ${R} ${T} Z`;
}

/** The pool hugging the crust's top surface, spreading from the pat */
function poolPath(spread: number, wobble = 1) {
  const rx = 70 + 520 * spread;
  const pts: string[] = [];
  const back: string[] = [];
  const n = 36;
  for (let i = 0; i <= n; i++) {
    const x = CX - rx + (2 * rx * i) / n;
    const u = (x - CX) / rx;
    const q = Math.sqrt(Math.max(0, 1 - u * u));
    const noise = (Math.sin(x * 0.043 + 1.3) * 0.6 + Math.sin(x * 0.11) * 0.4) * wobble;
    const depth = Math.min(30, 10 + 30 * spread) * q;
    pts.push(`${x.toFixed(1)} ${(front(x) + 2.2 * q + noise * q).toFixed(1)}`);
    back.unshift(`${x.toFixed(1)} ${(front(x) - depth + noise * 2 * q).toFixed(1)}`);
  }
  return `M${pts.join(" L")} L${back.join(" L")} Z`;
}

function dripPath(x: number, L: number, w0: number) {
  if (L < 3) return "";
  const y0 = front(x) + 1;
  const prog = Math.min(1, L / 60);
  const w1 = Math.max(4, w0 * 0.42);
  const rb = Math.min(w0 * 0.5, 3.5 + 4.5 * prog);
  const yt = y0 + L - rb;
  return [
    `M${x - w0 / 2} ${y0 - 2}`,
    `C${x - w0 / 2} ${y0 + L * 0.28} ${x - w1 / 2} ${y0 + L * 0.38} ${x - w1 / 2} ${yt - rb * 1.5}`,
    `C${x - w1 / 2} ${yt - rb * 0.8} ${x - rb} ${yt - rb * 0.7} ${x - rb} ${yt}`,
    `A${rb} ${rb} 0 0 0 ${x + rb} ${yt}`,
    `C${x + rb} ${yt - rb * 0.7} ${x + w1 / 2} ${yt - rb * 0.8} ${x + w1 / 2} ${yt - rb * 1.5}`,
    `C${x + w1 / 2} ${y0 + L * 0.38} ${x + w0 / 2} ${y0 + L * 0.28} ${x + w0 / 2} ${y0 - 2}`,
    "Z",
  ].join(" ");
}

// Static crust shapes
const topSurface = (() => {
  const f: string[] = [];
  const b: string[] = [];
  for (let x = -20; x <= W + 20; x += 20) {
    f.push(`${x} ${front(x).toFixed(1)}`);
    b.unshift(`${x} ${back(x).toFixed(1)}`);
  }
  return `M${f.join(" L")} L${b.join(" L")} Z`;
})();
const frontFace = (() => {
  const f: string[] = [];
  const bottom: string[] = [];
  for (let x = -20; x <= W + 20; x += 20) {
    f.push(`${x} ${front(x).toFixed(1)}`);
    bottom.unshift(`${x} ${(front(x) + FACE + 6 * Math.sin(x * 0.01)).toFixed(1)}`);
  }
  return `M${f.join(" L")} L${bottom.join(" L")} Z`;
})();
const rimLine = (() => {
  const f: string[] = [];
  for (let x = -20; x <= W + 20; x += 20) f.push(`${x} ${(front(x) + 0.5).toFixed(1)}`);
  return `M${f.join(" L")}`;
})();

export function ButterMelt({ from = "var(--flour)", to = "var(--flour-deep)" }: { from?: string; to?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const $ = <T extends Element>(s: string) => el.querySelector<T>(s)!;
      const pat = $<SVGPathElement>(".bm-pat");
      const patTop = $<SVGPathElement>(".bm-pat-top");
      const patMarks = $<SVGGElement>(".bm-pat-marks");
      const patShadow = $<SVGEllipseElement>(".bm-pat-shadow");
      const pool = $<SVGPathElement>(".bm-pool");
      const stain = $<SVGPathElement>(".bm-stain");
      const drips = Array.from(el.querySelectorAll<SVGPathElement>(".bm-drip"));
      const beads = Array.from(el.querySelectorAll<SVGEllipseElement>(".bm-bead"));
      const fell = DRIPS.map(() => false);

      const render = (p: number, allowFall: boolean) => {
        const m = smooth(0.04, 0.62, p); // softening → collapse
        const spread = smooth(0.18, 0.95, p); // pool spreading
        pat.setAttribute("d", patPath(m));
        patTop.setAttribute("d", patTopPath(m));
        patTop.style.opacity = String(1 - smooth(0.3, 0.75, p));
        patMarks.style.opacity = String(0.55 * (1 - smooth(0.05, 0.35, p)));
        patShadow.setAttribute("rx", String(82 + 60 * m));
        patShadow.style.opacity = String(0.32 * (1 - m * 0.7));
        pool.setAttribute("d", poolPath(spread));
        pool.style.opacity = String(smooth(0.06, 0.2, p));
        stain.setAttribute("d", poolPath(Math.min(1, spread * 1.06 + 0.02), 1.6));
        stain.style.opacity = String(0.55 * smooth(0.25, 0.9, p));

        const rx = 70 + 520 * spread;
        DRIPS.forEach((d, i) => {
          // A drip starts once the pool has reached its spot on the edge
          const reach = (Math.abs(d.x - CX) - 40) / 520;
          const start = 0.18 + 0.77 * Math.max(0, reach) + 0.04;
          const k = smooth(start, Math.min(1, start + 0.35), p);
          const len = rx > Math.abs(d.x - CX) + 18 ? d.max * k ** 1.4 : 0;
          drips[i].setAttribute("d", dripPath(d.x, len, d.w));
          // Full length: the bead lets go and falls
          if (allowFall && k > 0.98 && !fell[i]) {
            fell[i] = true;
            const y = front(d.x) + d.max - 4;
            const bead = beads[i];
            gsap.killTweensOf(bead);
            gsap.set(bead, { attr: { cx: d.x, cy: y, rx: 4.2, ry: 4.6 }, opacity: 1 });
            gsap
              .timeline()
              .to(bead, { attr: { cy: H + 30, ry: 6.5, rx: 3.6 }, duration: 0.75 + Math.random() * 0.2, ease: "power2.in" })
              .to(bead, { opacity: 0, duration: 0.15 }, "-=0.15");
          }
          if (k < 0.9) fell[i] = false;
        });
      };

      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const state = { p: 0 };
        render(0, false);
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          end: "bottom 20%",
          onUpdate: (self) => gsap.to(state, { p: self.progress, duration: 1.1, ease: "power3", overwrite: true, onUpdate: () => render(state.p, true) }),
        });
        return () => st.kill();
      });
      mm.add(MQ.reduce, () => render(0.7, false));
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="relative h-[220px] overflow-hidden md:h-[300px]" style={{ background: `linear-gradient(${from} 0 48%, ${to} 48% 100%)` }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          {/* Baked crust: domed shape + fine bumpy noise, lit from the upper left */}
          <filter id="bm-crust" x="-5%" y="-30%" width="110%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.08" numOctaves={4} seed={7} result="noise" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="9" result="dome" />
            <feComposite in="noise" in2="dome" operator="arithmetic" k2={0.45} k3={1} result="bump" />
            <feDiffuseLighting in="bump" surfaceScale={7} diffuseConstant={1.15} lightingColor="#fff4dc" result="light">
              <feDistantLight azimuth={235} elevation={48} />
            </feDiffuseLighting>
            <feSpecularLighting in="bump" surfaceScale={7} specularConstant={0.35} specularExponent={18} lightingColor="#ffe6b0" result="spec">
              <feDistantLight azimuth={235} elevation={48} />
            </feSpecularLighting>
            <feComposite in="SourceGraphic" in2="light" operator="arithmetic" k1={1.1} result="lit" />
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
            <feComposite in="lit" in2="specIn" operator="arithmetic" k2={1} k3={0.5} result="all" />
            <feComposite in="all" in2="SourceAlpha" operator="in" />
          </filter>
          {/* Butter: a smooth, rounded, glossy surface with soft shading at the edges */}
          <filter id="bm-gloss" x="-10%" y="-30%" width="120%" height="160%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3.2" result="blur" />
            <feDiffuseLighting in="blur" surfaceScale={4} diffuseConstant={1.05} lightingColor="#ffffff" result="diff">
              <feDistantLight azimuth={235} elevation={62} />
            </feDiffuseLighting>
            <feSpecularLighting in="blur" surfaceScale={5} specularConstant={1.25} specularExponent={34} lightingColor="#fffbea" result="spec">
              <feDistantLight azimuth={235} elevation={52} />
            </feSpecularLighting>
            <feComposite in="SourceGraphic" in2="diff" operator="arithmetic" k1={1.08} result="shaded" />
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
            <feComposite in="shaded" in2="specIn" operator="arithmetic" k2={1} k3={0.85} result="all" />
            <feComposite in="all" in2="SourceAlpha" operator="in" />
          </filter>
          <filter id="bm-soft" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <linearGradient id="bm-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c98d45" />
            <stop offset="1" stopColor="#b8762f" />
          </linearGradient>
          <linearGradient id="bm-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a8651f" />
            <stop offset="0.6" stopColor="#874c17" />
            <stop offset="1" stopColor="#6c3a10" />
          </linearGradient>
          <linearGradient id="bm-butter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbe6a2" />
            <stop offset="0.55" stopColor="#f4d27a" />
            <stop offset="1" stopColor="#e9bd59" />
          </linearGradient>
          <linearGradient id="bm-melt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6d778" />
            <stop offset="1" stopColor="#e8b74c" />
          </linearGradient>
        </defs>

        {/* Shadow the crust casts onto the section below */}
        <path d={frontFace} transform="translate(0 10)" fill="#2a1a11" opacity="0.16" filter="url(#bm-soft)" />

        {/* The crust */}
        <g filter="url(#bm-crust)">
          <path d={frontFace} fill="url(#bm-face)" />
          <path d={topSurface} fill="url(#bm-top)" />
        </g>
        <path d={rimLine} stroke="#e2a85a" strokeWidth="1.6" fill="none" opacity="0.55" />

        {/* Where melted butter soaks in, the crust darkens and deepens */}
        <path className="bm-stain" fill="#7a3f0c" opacity="0" filter="url(#bm-soft)" style={{ mixBlendMode: "multiply" }} />

        {/* Soft contact shadow under the pat */}
        <ellipse className="bm-pat-shadow" cx={CX + 10} cy={front(CX) - 6} rx="82" ry="9" fill="#3a200c" opacity="0.32" filter="url(#bm-soft)" />

        {/* Everything butter shares one lit, glossy surface */}
        <g filter="url(#bm-gloss)">
          <path className="bm-pool" fill="url(#bm-melt)" opacity="0" />
          {DRIPS.map((d) => (
            <path key={d.x} className="bm-drip" fill="url(#bm-melt)" />
          ))}
          <path className="bm-pat" fill="url(#bm-butter)" />
          <path className="bm-pat-top" fill="#fdefc4" />
          {DRIPS.map((d) => (
            <ellipse key={d.x} className="bm-bead" fill="#eebf55" opacity="0" />
          ))}
        </g>
        {/* Knife marks on the cold pat, gone as soon as it softens */}
        <g className="bm-pat-marks" stroke="#d9a843" strokeWidth="1.4" strokeLinecap="round" opacity="0.55">
          <path d={`M${CX - 50} ${front(CX) - 58} L${CX + 34} ${front(CX) - 60}`} />
          <path d={`M${CX - 40} ${front(CX) - 46} L${CX + 50} ${front(CX) - 49}`} />
        </g>
      </svg>
    </div>
  );
}
