"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { bakeStages } from "@/lib/content";
import { BakeScene, LOAF_PATH, BUTTER_MELT } from "./BakeScene";

/**
 * The centrepiece: a pinned, scroll-scrubbed bake.
 * flour → milk → butter → knead → rise → oven → golden loaf.
 * Each stage owns one unit of the timeline; its copy crossfades in as the
 * scene plays. Reduced motion gets a calm static version: the finished loaf
 * beside the whole method as a list.
 */
export function BakeStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      const build = () => {
        const tl = gsap.timeline({ defaults: { ease: "expo", duration: 0.4 } });
        
        gsap.set(q(".bk-milkstream"), { drawSVG: "0% 0%" });
        gsap.set(q(".bk-score"), { drawSVG: "0%" });
        gsap.set(q(".bk-mound"), { scale: 0 });
        gsap.set(q(".bk-flourfall"), { scaleY: 0, opacity: 1 });
        gsap.set(q(".bk-milk"), { y: 46, opacity: 0 });
        gsap.set(q(".bk-butter, .bk-butter-gloss"), { y: -340 });
        gsap.set(q(".bk-jug"), { x: 220, opacity: 0, svgOrigin: "470 120" });
        gsap.set(q(".bk-bowl"), { svgOrigin: "300 500" });
        gsap.set(q(".bk-doughwrap"), { svgOrigin: "300 490" });
        gsap.set(q(".bk-flourfall"), { svgOrigin: "300 88" });
        gsap.set(q(".bk-mound"), { svgOrigin: "300 372" });
        gsap.set(q(".bk-glow"), { svgOrigin: "300 420" });

        // 0 · Flour
        tl.to(q(".bk-sifter"), { rotate: 4, duration: 0.08, yoyo: true, repeat: 11, ease: "sine.inOut", svgOrigin: "300 60" }, 0.05)
          .to(q(".bk-flourfall"), { scaleY: 1, duration: 0.3, ease: "power2.in" }, 0)
          .to(q(".bk-mound"), { scale: 1, duration: 0.65, ease: "power2.out" }, 0.25)
          .to(q(".bk-mound-shade"), { opacity: 1, duration: 0.4 }, 0.5)
          .to(q(".bk-flourfall"), { y: 120, opacity: 0, duration: 0.22, ease: "power2.in" }, 1.0)
          .to(q(".bk-sifter"), { y: -160, opacity: 0, duration: 0.3, ease: "quint" }, 1.02)
          .addLabel("s0", 0.92)

          // 1 · Milk
          .to(q(".bk-jug"), { x: 0, opacity: 1, duration: 0.25 }, 1.08)
          .to(q(".bk-jug"), { rotate: -32, duration: 0.22, ease: "quint" }, 1.25)
          .to(q(".bk-milkstream"), { drawSVG: "0% 100%", duration: 0.18, ease: "power2.in" }, 1.36)
          .to(q(".bk-milk"), { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 1.42)
          .to(q(".bk-mound, .bk-mound-shade"), { y: 50, opacity: 0, duration: 0.45, ease: "power2.in" }, 1.45)
          .fromTo(q(".bk-ripple"), { scale: 0.3, opacity: 0.9, svgOrigin: "318 346" }, { scale: 3.2, opacity: 0, duration: 0.35, stagger: 0.12, ease: "power1.out" }, 1.45)
          .to(q(".bk-milkstream"), { drawSVG: "100% 100%", duration: 0.18, ease: "power2.in" }, 1.78)
          .to(q(".bk-milkstream"), { opacity: 0, duration: 0.04 }, 1.95)
          .to(q(".bk-jug"), { rotate: 0, x: 240, opacity: 0, duration: 0.3, ease: "quint" }, 1.84)
          .addLabel("s1", 1.95)

          // 2 · Butter: drops with weight, lands, then melts slowly and glossy
          .to(q(".bk-butter, .bk-butter-gloss"), { y: 50, duration: 0.3, ease: "power3.in" }, 2.0)
          .to(q(".bk-butter"), { scaleY: 0.86, scaleX: 1.08, svgOrigin: "300 292", duration: 0.08, ease: "power1.out" }, 2.3)
          .to(q(".bk-butter"), { scaleY: 1, scaleX: 1, duration: 0.12, ease: "back.out(3)" }, 2.38)
          .fromTo(q(".bk-ripple"), { scale: 0.4, opacity: 0.8, svgOrigin: "300 346" }, { scale: 3.8, opacity: 0, duration: 0.35, stagger: 0.1, ease: "power1.out", immediateRender: false }, 2.3)
          .to(q(".bk-butter"), { morphSVG: BUTTER_MELT, y: 0, duration: 0.5, ease: "viscous" }, 2.45)
          .to(q(".bk-butter-gloss"), { opacity: 0, duration: 0.2 }, 2.45)
          .fromTo(q(".bk-butter-spec"), { opacity: 0, scaleX: 0.4, svgOrigin: "276 338" }, { opacity: 0.95, scaleX: 1.6, duration: 0.5, ease: "viscous" }, 2.55)
          .addLabel("s2", 2.95)

          // 3 · Knead: the bowl gives way to a dough ball worked on the board
          .to(q(".bk-bowl"), { scale: 0.82, y: 40, opacity: 0, duration: 0.35, ease: "quint" }, 3.0)
          .fromTo(q(".bk-dough"), { opacity: 0 }, { opacity: 1, duration: 0.25 }, 3.15)
          .fromTo(q(".bk-doughwrap"), { scale: 0.55 }, { scale: 1, duration: 0.35, ease: "back.out(1.6)" }, 3.15)
          .to(q(".bk-dough-shadow"), { opacity: 0.22, duration: 0.3 }, 3.2)
          .to(q(".bk-flourdust"), { opacity: 0.9, duration: 0.3, stagger: 0.04 }, 3.25)
          .to(q(".bk-doughwrap"), { scaleX: 1.16, scaleY: 0.86, duration: 0.12, ease: "sine.inOut", yoyo: true, repeat: 3 }, 3.5)
          .fromTo(q(".bk-fold"), { opacity: 0, drawSVG: "0%" }, { opacity: 1, drawSVG: "100%", duration: 0.2, ease: "power1.inOut" }, 3.55)
          .to(q(".bk-fold"), { opacity: 0, duration: 0.15 }, 3.85)
          .addLabel("s3", 3.95)

          // 4 · Rise: slow, soft, a little top-heavy
          .to(q(".bk-doughwrap"), { scaleX: 1.22, scaleY: 1.3, duration: 0.85, ease: "sine.inOut" }, 4.05)
          .to(q(".bk-dough-shine"), { opacity: 0.8, duration: 0.5 }, 4.2)
          .to(q(".bk-dough-shadow"), { attr: { rx: 150 }, duration: 0.85, ease: "sine.inOut" }, 4.05)
          .addLabel("s4", 4.92)

          // 5 · Oven: the glow comes up and the dough browns
          .to(q(".bk-oven"), { opacity: 1, duration: 0.4, ease: "power2.out" }, 5.0)
          .to(q(".bake-warm"), { opacity: 1, duration: 0.6, ease: "power1.inOut" }, 5.0)
          .to(q(".bk-flourdust"), { opacity: 0, duration: 0.3 }, 5.0)
          .to(q(".bk-dough-crust"), { opacity: 1, duration: 0.6, ease: "power1.inOut" }, 5.25)
          .to(q(".bk-dough-shine"), { opacity: 0, duration: 0.3 }, 5.3)
          .addLabel("s5", 5.92)

          // 6 · Golden loaf
          .to(q(".bk-dough, .bk-dough-crust"), { morphSVG: LOAF_PATH, duration: 0.4, ease: "expo" }, 6.0)
          .to(q(".bk-doughwrap"), { scaleX: 1.04, scaleY: 1.08, duration: 0.4, ease: "expo" }, 6.0)
          .to(q(".bk-score"), { drawSVG: "100%", duration: 0.3, stagger: 0.08, ease: "power2.out" }, 6.25)
          .to(q(".bk-loaf-shine"), { opacity: 1, duration: 0.3 }, 6.45)
          .to(q(".bk-steam"), { opacity: 1, duration: 0.3 }, 6.5)
          .addLabel("s6", 7);

        // Copy: each stage's words come in as the last ones leave
        const texts = q(".bake-text");
        texts.forEach((t, i) => {
          if (i === 0) {
            gsap.set(t, { opacity: 1, y: 0 });
          } else {
            gsap.set(t, { opacity: 0, y: 40 });
            tl.to(texts[i - 1], { opacity: 0, y: -40, duration: 0.2, ease: "power2.in" }, i - 0.02);
            tl.to(t, { opacity: 1, y: 0, duration: 0.35, ease: "expo" }, i + 0.12);
          }
        });
        const dots = q(".bake-dot");
        dots.forEach((d, i) => {
          if (i > 0) tl.to(d, { opacity: 1, duration: 0.1 }, i);
        });
        tl.fromTo(q(".bake-progress"), { scaleX: 0 }, { scaleX: 1, duration: 7, ease: "none" }, 0);
        return tl;
      };

      mm.add(MQ.motion, () => {
        el.classList.remove("bake-static");
        // The pin exists from the start (so page height never jumps), but the
        // scene's timeline, with its path measuring and morph prep, is only
        // built when the section is about a screen away. Keeps first load light.
        let tl: gsap.core.Timeline | null = null;
        let progress = 0;
        const ensure = () => {
          if (tl) return;
          tl = build().pause();
          tl.progress(progress);
        };
        ScrollTrigger.create({ trigger: el, start: "top bottom+=100%", end: "max", once: true, onEnter: ensure });
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * bakeStages.length * 0.85}`,
          pin: q(".bake-pin")[0],
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progress = self.progress;
            ensure();
            // Smoothed scrub (same feel as scrub: 1)
            gsap.to(tl!, { progress, duration: 1, ease: "power3", overwrite: true });
          },
        });

        // The oven breathes on its own once it's lit (paused off-screen)
        const breathe = gsap.to(q(".bk-glow"), { scale: 1.07, opacity: 0.82, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true });
        ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? breathe.play() : breathe.pause()) });
      });

      mm.add(MQ.reduce, () => {
        el.classList.add("bake-static");
        build().progress(1).pause();
        gsap.set(q(".bake-text"), { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-dark className="on-dark bake-static relative bg-cocoa text-flour" aria-labelledby="bake-title">
      <div className="bake-pin relative flex min-h-[100svh] flex-col overflow-hidden">
        {/* Warmth that rises with the oven */}
        <div aria-hidden className="bake-warm pointer-events-none absolute inset-0 opacity-0">
          <div className="absolute left-1/2 top-[55%] h-[120vh] w-[120vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(242,163,60,0.32),rgba(166,77,20,0.12)_40%,transparent_68%)]" />
        </div>

        <div className="shell relative grid flex-1 grid-rows-[auto_1fr] gap-4 pb-8 pt-24 md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-[var(--gutter)] md:pb-12 md:pt-28">
          <div className="order-2 flex flex-col md:order-1 md:col-span-5">
            <h2 id="bake-title" className="font-display text-step-1 font-semibold tracking-[-0.015em] text-butter">
              How a loaf comes to life in our kitchen
            </h2>

            <ol className="bake-texts relative mt-5 md:mt-8 md:min-h-[17rem]">
              {bakeStages.map((s, i) => (
                <li key={s.id} className="bake-text">
                  <span className="tabular block font-display text-[0.95rem] font-semibold text-flour/55">
                    {String(i + 1).padStart(2, "0")} / {String(bakeStages.length).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block font-display text-step-6 font-bold leading-[0.95] tracking-[-0.05em]">{s.title}</span>
                  <span className="measure mt-4 block max-w-[30ch] text-[1.08rem] leading-[1.6] text-flour/80 md:text-step-1 md:leading-[1.5]">{s.line}</span>
                </li>
              ))}
            </ol>

            <div className="bake-track mt-8 hidden md:block" aria-hidden>
              <div className="flex gap-2">
                {bakeStages.map((s, i) => (
                  <span key={s.id} className="bake-dot h-1.5 flex-1 rounded-full bg-flour/15" style={{ opacity: i === 0 ? 1 : 0.4 }} />
                ))}
              </div>
              <div className="relative mt-3 h-px w-full bg-flour/15">
                <span className="bake-progress absolute inset-0 origin-left bg-butter" />
              </div>
            </div>
          </div>

          <div className="order-1 flex items-center justify-center md:order-2 md:col-span-7">
            <BakeScene className="h-[44svh] w-auto max-w-full md:h-[78svh]" />
          </div>
        </div>
      </div>
    </section>
  );
}
