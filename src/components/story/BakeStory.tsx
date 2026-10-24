"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { bakeStages } from "@/lib/content";
import { asset } from "@/lib/site";
import { FrameSequence, drawCover } from "@/components/motion/FrameSequence";

/** Real footage for each stage: /public/frames/<name>, <count> frames, focal point */
const REELS: Record<(typeof bakeStages)[number]["id"], { name: string; count: number; fx: number; fy: number }> = {
  flour: { name: "flour", count: 30, fx: 0.55, fy: 0.5 },
  milk: { name: "milk", count: 30, fx: 0.42, fy: 0.55 },
  butter: { name: "butter", count: 26, fx: 0.5, fy: 0.5 },
  knead: { name: "knead", count: 30, fx: 0.5, fy: 0.5 },
  rise: { name: "rise", count: 24, fx: 0.3, fy: 0.6 },
  oven: { name: "oven", count: 24, fx: 0.3, fy: 0.6 },
  loaf: { name: "golden", count: 24, fx: 0.3, fy: 0.6 },
};

const FADE = 0.16; // share of each stage spent dissolving into the next

/**
 * The centrepiece: a pinned, scroll-scrubbed bake told with real footage.
 * flour → milk → butter → knead → rise → oven → golden loaf.
 * Each stage's clip plays forward as you scroll and dissolves into the next;
 * the copy changes with it. Reduced motion: a calm list beside a still of the
 * finished loaves.
 */
export function BakeStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const canvas = q(".bake-canvas")[0] as HTMLCanvasElement;
      const n = bakeStages.length;
      const reels = bakeStages.map((s) => new FrameSequence(REELS[s.id].name, REELS[s.id].count));
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        el.classList.remove("bake-static");
        const ctx = canvas.getContext("2d")!;
        let w = 0;
        let h = 0;
        let progress = 0;
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

        const draw = () => {
          if (!w) return;
          const t = progress * n;
          const i = Math.min(n - 1, Math.floor(t));
          const local = t - i;
          const a = REELS[bakeStages[i].id];
          const fa = reels[i].frame(local);
          ctx.fillStyle = "#2a1a11";
          ctx.fillRect(0, 0, w, h);
          if (fa) drawCover(ctx, fa, w, h, 1, a.fx, a.fy);
          // Dissolve into the next stage's opening frame
          if (i < n - 1 && local > 1 - FADE) {
            const b = REELS[bakeStages[i + 1].id];
            const fb = reels[i + 1].frame(0);
            const k = (local - (1 - FADE)) / FADE;
            if (fb) drawCover(ctx, fb, w, h, k * k * (3 - 2 * k), b.fx, b.fy);
          }
        };

        // Fetch stage clips in order once the section is within ~2 screens
        let loading = false;
        const load = () => {
          if (loading) return;
          loading = true;
          reels.forEach((r, i) => setTimeout(() => r.load(draw), i * 120));
        };

        // Copy: each stage's words come in as the last ones leave
        const texts = q(".bake-text");
        const words = gsap.timeline({ paused: true });
        texts.forEach((t, i) => {
          if (i === 0) gsap.set(t, { opacity: 1, y: 0 });
          else {
            gsap.set(t, { opacity: 0, y: 36 });
            words.to(texts[i - 1], { opacity: 0, y: -36, duration: 0.18, ease: "power2.in" }, i - 0.06);
            words.to(t, { opacity: 1, y: 0, duration: 0.32, ease: "expo" }, i + 0.06);
          }
        });
        q(".bake-dot").forEach((d, i) => i > 0 && words.to(d, { opacity: 1, duration: 0.1 }, i));
        words.fromTo(q(".bake-progress"), { scaleX: 0 }, { scaleX: 1, duration: n, ease: "none" }, 0);

        const state = { p: 0 };
        const render = () => {
          progress = state.p;
          words.progress(state.p);
          draw();
        };

        ScrollTrigger.create({ trigger: el, start: "top bottom+=150%", end: "max", once: true, onEnter: load });
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * n * 0.9}`,
          pin: q(".bake-pin")[0],
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            load();
            // Smoothed scrub: the footage eases toward the scroll position
            gsap.to(state, { p: self.progress, duration: 0.8, ease: "power3", overwrite: true, onUpdate: render });
          },
        });

        size();
        window.addEventListener("resize", size);
        return () => window.removeEventListener("resize", size);
      });

      mm.add(MQ.reduce, () => {
        el.classList.add("bake-static");
        gsap.set(q(".bake-text"), { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-dark className="on-dark bake-static relative bg-cocoa text-flour" aria-labelledby="bake-title">
      <div className="bake-pin relative flex min-h-[100svh] flex-col overflow-hidden">
        {/* The footage, full bleed */}
        <div aria-hidden className="bake-film absolute inset-0 max-md:bottom-auto max-md:h-[62svh]">
          <canvas className="bake-canvas absolute inset-0 h-full w-full" />
          {/* Still for reduced motion */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="bake-still absolute inset-0 hidden h-full w-full object-cover" src={asset("/frames/golden/023.webp")} alt="" loading="lazy" />
          {/* Shade for legibility: darker behind the copy, with a soft vignette */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,17,11,0.92)_0%,rgba(28,17,11,0.7)_34%,rgba(28,17,11,0.12)_62%,rgba(28,17,11,0.05)_100%)] max-md:bg-[linear-gradient(0deg,rgba(42,26,17,1)_0%,rgba(42,26,17,0.6)_22%,rgba(42,26,17,0)_50%)]" />
          <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.55)] max-md:shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]" />
        </div>

        <div className="shell relative flex flex-1 flex-col justify-end pb-10 pt-24 md:justify-center md:pb-12 md:pt-28">
          <div className="flex flex-col md:max-w-[34rem]">
            <h2 id="bake-title" className="font-display text-step-1 font-semibold tracking-[-0.015em] text-butter">
              How a loaf comes to life in our kitchen
            </h2>

            <ol className="bake-texts relative mt-5 md:mt-8 md:min-h-[17rem]">
              {bakeStages.map((s, i) => (
                <li key={s.id} className="bake-text">
                  <span className="tabular block font-display text-[0.9rem] font-semibold text-flour/60">
                    {String(i + 1).padStart(2, "0")} / {String(bakeStages.length).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block font-display text-step-6 font-bold leading-[0.95] tracking-[-0.05em]">{s.title}</span>
                  <span className="measure mt-4 block max-w-[30ch] text-[1.02rem] leading-[1.6] text-flour/85 md:text-step-1 md:leading-[1.5]">{s.line}</span>
                </li>
              ))}
            </ol>

            <div className="bake-track mt-8 hidden md:block" aria-hidden>
              <div className="flex gap-2">
                {bakeStages.map((s, i) => (
                  <span key={s.id} className="bake-dot h-1 flex-1 rounded-full bg-flour/20" style={{ opacity: i === 0 ? 1 : 0.4 }} />
                ))}
              </div>
              <div className="relative mt-3 h-px w-full bg-flour/15">
                <span className="bake-progress absolute inset-0 origin-left bg-butter" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
