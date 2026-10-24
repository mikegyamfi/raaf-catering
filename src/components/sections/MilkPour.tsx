"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";

/**
 * Milk pours into a glass as the section scrolls by.
 * Scroll sets *how much* has been poured; a small simulation decides how it
 * looks: the stream bends with a little wobble, the surface waves harder
 * while milk is landing and settles afterwards, and droplets splash and
 * fall back under gravity. Paused whenever it's off-screen.
 */
const TOP = 132; // inside-rim y
const BOTTOM = 404; // inside-floor y
const FULL = 176; // fill line when the pour is done

export function MilkPour({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const surface = el.querySelector<SVGPathElement>(".mp-fill")!;
      const shine = el.querySelector<SVGPathElement>(".mp-shine")!;
      const stream = el.querySelector<SVGPathElement>(".mp-stream")!;
      const streamHi = el.querySelector<SVGPathElement>(".mp-stream-hi")!;
      const drops = Array.from(el.querySelectorAll<SVGCircleElement>(".mp-drop"));
      const jug = el.querySelector<SVGGElement>(".mp-jug")!;

      const mm = gsap.matchMedia();

      // Reduced motion: a full, still glass of milk
      mm.add(MQ.reduce, () => {
        surface.setAttribute("d", wave(FULL, 0, 0));
        shine.setAttribute("d", `M92 ${FULL + 10} L100 ${BOTTOM - 20}`);
        gsap.set([stream, streamHi], { opacity: 0 });
        gsap.set(jug, { opacity: 0 });
      });

      mm.add(MQ.motion, () => {
        const state = { pour: 0 }; // 0..1 scroll-driven
        let level = BOTTOM + 6;
        let amp = 0;
        let phase = 0;
        let flow = 0; // smoothed stream thickness 0..1
        type Drop = { x: number; y: number; vx: number; vy: number; life: number };
        const live: Drop[] = [];

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 75%",
          end: "bottom 35%",
          scrub: 0.6,
          onUpdate: (self) => (state.pour = self.progress),
        });

        const tick = (_t: number, dtMs: number) => {
          const dt = Math.min(0.033, dtMs / 1000);
          const p = state.pour;
          const pouring = p > 0.06 && p < 0.86;
          const target = BOTTOM + 6 - gsap.utils.clamp(0, 1, (p - 0.08) / 0.74) * (BOTTOM + 6 - FULL);
          level += (target - level) * Math.min(1, dt * 4);
          flow += ((pouring ? 1 : 0) - flow) * Math.min(1, dt * 7);

          // Surface: agitated by the falling stream, then damps out
          amp += ((pouring ? 5.5 : 0.6) - amp) * Math.min(1, dt * (pouring ? 3 : 1.4));
          phase += dt * (2.4 + flow * 3);
          surface.setAttribute("d", wave(level, amp, phase));
          shine.setAttribute("d", `M92 ${Math.min(BOTTOM - 30, level + 14)} L100 ${BOTTOM - 20}`);
          shine.style.opacity = level < BOTTOM - 30 ? "0.9" : "0";

          // Stream: from the spout, falling and narrowing, to the surface
          const impactX = 180 + Math.sin(phase * 1.7) * 1.6;
          // Spout position after the jug tilts about (300, 70)
          const ang = ((-8 - flow * 30) * Math.PI) / 180;
          const sx = 300 + -28 * Math.cos(ang) - -26 * Math.sin(ang);
          const sy = 70 + -28 * Math.sin(ang) + -26 * Math.cos(ang);
          const d = `M${sx} ${sy} C${sx - 34} ${sy + 18} ${impactX + 6} ${sy + 70} ${impactX} ${level - 2}`;
          stream.setAttribute("d", d);
          streamHi.setAttribute("d", d);
          stream.style.strokeWidth = String(4 + flow * 9);
          stream.style.opacity = String(Math.min(1, flow * 1.4));
          streamHi.style.opacity = String(flow * 0.7);
          gsap.set(jug, { svgOrigin: "300 70", rotation: -8 - flow * 30, opacity: Math.min(1, p * 8) * (1 - gsap.utils.clamp(0, 1, (p - 0.9) * 10)) });

          // Splash droplets
          if (pouring && flow > 0.6 && Math.random() < 0.45) {
            live.push({ x: impactX + (Math.random() - 0.5) * 10, y: level - 2, vx: (Math.random() - 0.5) * 70, vy: -60 - Math.random() * 90, life: 1 });
          }
          for (let i = live.length - 1; i >= 0; i--) {
            const k = live[i];
            k.vy += 520 * dt;
            k.x += k.vx * dt;
            k.y += k.vy * dt;
            if (k.y > level && k.vy > 0) live.splice(i, 1);
          }
          drops.forEach((c, i) => {
            const k = live[i];
            if (k) {
              c.setAttribute("cx", k.x.toFixed(1));
              c.setAttribute("cy", k.y.toFixed(1));
              c.style.opacity = "1";
            } else c.style.opacity = "0";
          });
          if (live.length > drops.length) live.splice(0, live.length - drops.length);
        };

        // Only simulate while visible
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)));
        io.observe(el);
        return () => {
          io.disconnect();
          gsap.ticker.remove(tick);
          st.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      <svg viewBox="0 0 320 440" className="h-full w-full overflow-visible" aria-hidden>
        <defs>
          <clipPath id="mp-inside">
            <path d={`M78 ${TOP} L242 ${TOP} L226 ${BOTTOM} C225 410 95 410 94 ${BOTTOM} Z`} />
          </clipPath>
          <linearGradient id="mp-milk" x1="0" x2="1">
            <stop offset="0%" stopColor="#efe7d8" />
            <stop offset="40%" stopColor="#fffdf8" />
            <stop offset="100%" stopColor="#e9e0cf" />
          </linearGradient>
          <linearGradient id="mp-glass" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="85%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Soft shadow + warm light pool */}
        <ellipse cx="160" cy="420" rx="96" ry="10" fill="#2a1a11" opacity="0.14" />
        <ellipse cx="160" cy="300" rx="150" ry="150" fill="#f2cf74" opacity="0.16" />

        {/* Glass back wall */}
        <path d={`M70 120 L250 120 L232 408 C230 418 90 418 88 408 Z`} fill="#f3eadb" opacity="0.55" />

        {/* Milk */}
        <g clipPath="url(#mp-inside)">
          <path className="mp-fill" d={wave(BOTTOM + 6, 0, 0)} fill="url(#mp-milk)" />
          <path className="mp-shine" d="" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0" />
        </g>

        {/* Stream + splash */}
        <path className="mp-stream" d="" stroke="#fffdf8" strokeLinecap="round" fill="none" style={{ opacity: 0 }} />
        <path className="mp-stream-hi" d="" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" transform="translate(-2 0)" style={{ opacity: 0 }} />
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={i} className="mp-drop" r={1.6 + (i % 3) * 0.8} fill="#fffdf8" style={{ opacity: 0 }} />
        ))}

        {/* Glass front: rim, walls and highlights */}
        <path d={`M70 120 L250 120 L232 408 C230 418 90 418 88 408 Z`} fill="url(#mp-glass)" stroke="#d9cbb3" strokeWidth="3" />
        <ellipse cx="160" cy="120" rx="90" ry="9" fill="none" stroke="#d9cbb3" strokeWidth="3" />
        <path d="M86 140 L100 392" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        <path d="M232 150 L226 260" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />

        {/* Jug */}
        <g className="mp-jug" style={{ opacity: 0 }}>
          <path d="M284 30 L352 30 L346 112 C345 120 294 120 292 112 Z" fill="#fffdf8" stroke="#e8dcc6" strokeWidth="2" />
          <path d="M284 30 L272 44 L292 48 Z" fill="#fffdf8" />
          <path d="M352 46 C374 46 376 90 348 94" stroke="#e8dcc6" strokeWidth="7" fill="none" />
          <rect x="296" y="66" width="44" height="44" rx="5" fill="#f3eadb" />
        </g>
      </svg>
    </div>
  );
}

/** Closed shape: a sine-wave surface at `y`, filled down past the glass floor */
function wave(y: number, amp: number, phase: number) {
  const left = 60;
  const right = 260;
  const seg = 10;
  let d = `M${left} ${y + Math.sin(phase) * amp}`;
  for (let i = 1; i <= seg; i++) {
    const x = left + ((right - left) * i) / seg;
    const t = i / seg;
    // Two waves layered: a long swell plus a short ripple from the impact
    const yy = y + Math.sin(phase + t * 6.2) * amp * 0.6 + Math.sin(phase * 1.9 - t * 13) * amp * 0.4 * Math.exp(-Math.abs(t - 0.6) * 3);
    d += ` L${x.toFixed(1)} ${yy.toFixed(2)}`;
  }
  return `${d} L${right} 440 L${left} 440 Z`;
}
