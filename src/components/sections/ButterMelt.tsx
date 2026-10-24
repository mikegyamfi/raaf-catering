"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/**
 * Section divider: the crust of a warm loaf with a pat of butter on top.
 * As you scroll past, the pat softens and slumps, the puddle spreads along
 * the crust and slow, glossy drips run over the edge into the next section.
 */
const DRIPS = [
  { left: 6, w: 26, len: 70 },
  { left: 14, w: 18, len: 120 },
  { left: 23, w: 34, len: 56 },
  { left: 33, w: 22, len: 150 },
  { left: 41, w: 30, len: 92 },
  { left: 52, w: 40, len: 180 },
  { left: 61, w: 22, len: 74 },
  { left: 69, w: 30, len: 130 },
  { left: 78, w: 20, len: 60 },
  { left: 86, w: 32, len: 110 },
  { left: 94, w: 22, len: 84 },
];

export function ButterMelt({ from = "var(--flour)", to = "var(--flour-deep)" }: { from?: string; to?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 30%", scrub: 1.2 } });
        // The pat softens: corners round off, it sinks and spreads
        tl.fromTo(q(".bm-pat"), { scaleY: 1, scaleX: 1, y: 0 }, { scaleY: 0.32, scaleX: 1.9, y: 22, ease: "viscous", duration: 1 }, 0)
          .fromTo(q(".bm-pat-gloss"), { scaleX: 1, opacity: 0.9 }, { scaleX: 2.2, opacity: 0.5, ease: "viscous", duration: 1 }, 0)
          .fromTo(q(".bm-pool"), { scaleX: 0.08 }, { scaleX: 1, ease: "viscous", duration: 1.1 }, 0.1)
          // Drips stretch slowly, each at its own pace (viscous, not falling)
          .fromTo(q(".bm-drip"), { scaleY: 0.02 }, { scaleY: 1, ease: "viscous", duration: 1, stagger: { each: 0.05, from: "center" } }, 0.35)
          .fromTo(q(".bm-bead"), { y: -10, opacity: 0 }, { y: 0, opacity: 1, ease: "viscous", duration: 0.6, stagger: { each: 0.05, from: "center" } }, 0.8);
      });
      mm.add(MQ.reduce, () => {
        gsap.set(q(".bm-pat"), { scaleY: 0.5, scaleX: 1.6, y: 16 });
        gsap.set(q(".bm-pool"), { scaleX: 1 });
        gsap.set(q(".bm-drip"), { scaleY: 0.7 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="relative h-[200px] overflow-visible md:h-[240px]" style={{ background: `linear-gradient(${from} 0 50%, ${to} 50% 100%)` }}>
      {/* Crust: a toasted band with a soft domed top edge */}
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 top-[34%] h-[64px] w-full md:h-[80px]">
        <path d="M0 40 C240 10 480 6 720 8 C960 6 1200 10 1440 40 L1440 120 L0 120 Z" fill="#a9661d" />
        <path d="M0 40 C240 10 480 6 720 8 C960 6 1200 10 1440 40 L1440 58 C1200 30 960 26 720 28 C480 26 240 30 0 58 Z" fill="#c7832c" />
        <path d="M0 70 C240 50 480 46 720 48 C960 46 1200 50 1440 70 L1440 120 L0 120 Z" fill={to} />
      </svg>

      {/* Butter puddle spreading along the crust */}
      <div className="bm-pool absolute left-[4%] right-[4%] top-[calc(34%+6px)] h-[16px] origin-center rounded-full bg-butter md:top-[calc(34%+8px)]">
        <span className="absolute left-[18%] top-[3px] h-[3px] w-[30%] rounded-full bg-[#fff6d6] opacity-80" />
      </div>

      {/* Drips over the edge */}
      {DRIPS.map((d, i) => (
        <span key={i} className="absolute top-[calc(34%+14px)] md:top-[calc(34%+16px)]" style={{ left: `${d.left}%`, width: d.w }}>
          <span className="bm-drip block origin-top" style={{ height: d.len }}>
            <svg viewBox="0 0 40 100" preserveAspectRatio="none" className="block h-full w-full">
              <path d="M0 0 L40 0 C36 30 30 60 30 78 C30 92 26 100 20 100 C14 100 10 92 10 78 C10 60 4 30 0 0 Z" fill="#f2cf74" />
              <path d="M14 6 C16 36 16 60 16 80" stroke="#fff6d6" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75" />
            </svg>
          </span>
          <span className="bm-bead absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-butter" style={{ bottom: -12 }} />
        </span>
      ))}

      {/* The pat */}
      <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-[78%]">
        <div className="bm-pat relative h-[56px] w-[92px] origin-bottom rounded-[14px] bg-butter shadow-[inset_0_-8px_0_rgba(201,150,40,0.35),0_10px_20px_rgba(42,26,17,0.12)] md:h-[64px] md:w-[110px]">
          <span className="bm-pat-gloss absolute left-[14%] top-[14%] h-[6px] w-[46%] origin-left rounded-full bg-[#fff6d6]" />
        </div>
      </div>
    </div>
  );
}
