"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { asset } from "@/lib/site";
import { FrameSequence, drawCover } from "@/components/motion/FrameSequence";

/**
 * A real glass of milk filling as the section scrolls by: footage of a steady
 * stream pouring into a glass, played frame-by-frame from scroll position.
 * Reduced motion shows the full glass as a still.
 */
export function MilkPour({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const canvas = el.querySelector("canvas")!;
      const reel = new FrameSequence("glass", 40);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        el.classList.add("is-live");
        const ctx = canvas.getContext("2d")!;
        let w = 0;
        let h = 0;
        const state = { p: 0 };
        const draw = () => {
          const f = reel.frame(state.p);
          if (!f || !w) return;
          drawCover(ctx, f, w, h);
        };
        const size = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const r = canvas.getBoundingClientRect();
          w = r.width;
          h = r.height;
          canvas.width = Math.round(w * dpr);
          canvas.height = Math.round(h * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          draw();
        };
        ScrollTrigger.create({ trigger: el, start: "top bottom+=100%", once: true, onEnter: () => reel.load(draw) });
        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          end: "bottom 30%",
          onUpdate: (self) => gsap.to(state, { p: self.progress, duration: 0.6, ease: "power2", overwrite: true, onUpdate: draw }),
        });
        size();
        window.addEventListener("resize", size);
        return () => window.removeEventListener("resize", size);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`milk-film relative overflow-hidden rounded-[28px] bg-[#d9dad6] shadow-[0_40px_80px_-40px_rgba(42,26,17,0.45)] ${className ?? ""}`}>
      <canvas aria-hidden className="absolute inset-0 h-full w-full" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img aria-hidden className="milk-still absolute inset-0 h-full w-full object-cover" src={asset("/frames/glass/039.webp")} alt="" loading="lazy" />
    </div>
  );
}
