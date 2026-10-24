"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { createPour } from "./pour-engine";
import { onSiteReady } from "@/components/motion/Preloader";
import { Button } from "@/components/ui/Button";
import { business, whatsappHref } from "@/lib/content";

/**
 * Hero: golden wheat grains pour from above and settle into the RAAF
 * wordmark. Then a glass jar of milk tilts in and pours over the grains,
 * travelling across the word; the milk soaks in behind the stream, and the
 * letters resolve into the finished golden wordmark as the grains lift away.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add({ motion: MQ.motion, reduce: MQ.reduce, mobile: MQ.mobile }, (ctx) => {
        const { reduce, mobile } = ctx.conditions as { reduce: boolean; mobile: boolean };
        el.classList.add("is-ready");

        const copy = gsap.timeline({ paused: true });
        if (reduce) {
          gsap.set(q(".hero-word"), { opacity: 0.07 });
          copy
            .to(q(".hero-beam"), { opacity: 1, duration: 1.2, ease: "power1.out" }, 0)
            .to(q(".hero-word"), { opacity: 1, duration: 1, ease: "power1.out" }, 0.1)
            .from(q(".hero-fade"), { opacity: 0, duration: 0.9, stagger: 0.1, ease: "power1.out" }, 0.4);
          return onSiteReady(() => copy.play());
        }

        const kicker = SplitText.create(q(".hero-kicker"), { type: "words", mask: "words", aria: "none" });
        // Tagline and intro keep their original text nodes (no splitting) so they
        // register as painted on first render; the tagline is revealed with a wipe.
        // The word waits as a faint stencil; the grains pour into it.
        gsap.set(q(".hero-word"), { opacity: 0.07 });

        copy
          .from(kicker.words, { yPercent: 110, duration: 0.9, stagger: 0.06, ease: "expo" }, 0)
          .fromTo(q(".hero-tagline"), { clipPath: "inset(0% 0% 100% 0%)", y: 40 }, { clipPath: "inset(0% 0% -10% 0%)", y: 0, duration: 1.2, ease: "expo" }, 0.12)
          .from(q(".hero-cta > *"), { y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: "expo" }, 0.42)
          .from(q(".hero-meta"), { opacity: 0, duration: 1, ease: "power1.out" }, 0.8);

        const pour = createPour({
          canvas: canvasRef.current!,
          textEl: wordRef.current!,
          host: el,
          mobile,
          onSettled: () => {
            // The grain-built word holds for a breath, then the milk comes
            milk.play(0);
          },
        });

        /* ── Milk from a jar ─────────────────────────────────────────── */
        const wrap = wrapRef.current!;
        const jar = q(".hw-jar")[0] as HTMLElement;
        const lip = q(".hw-lip")[0] as HTMLElement;
        const streams = Array.from(wrap.querySelectorAll<SVGPathElement>(".hw-stream path"));
        const jarMilk = wrap.querySelector<SVGRectElement>(".hw-jar-milk")!;
        const flow = { head: 0, tail: 0, level: 0, reveal: 0, drain: 0 };

        // The stream runs from the jar's lip, curving forward and falling onto
        // the grains; head/tail trim it as the pour starts and ends.
        const drawStream = () => {
          const w = wrap.getBoundingClientRect();
          const l = lip.getBoundingClientRect();
          const fs = parseFloat(getComputedStyle(wrap).fontSize);
          const sx = l.left - w.left;
          const sy = l.top - w.top;
          const ex = sx - fs * 0.035;
          const ey = fs * (0.14 + (1 - flow.level) * 0.5);
          const cx = sx - fs * 0.05;
          const cy = sy + fs * 0.05;
          const pt = (t: number) => [(1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * ex, (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * ey];
          const a = flow.tail;
          const b = Math.max(a, flow.head);
          let d = "";
          if (b - a > 0.001) {
            for (let i = 0; i <= 10; i++) {
              const [x, y] = pt(a + ((b - a) * i) / 10);
              d += (i ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
            }
          }
          const width = fs * 0.032;
          [width + 2, width, width * 0.22].forEach((wd, i) => {
            streams[i].setAttribute("d", d);
            streams[i].style.strokeWidth = String(wd);
          });
          // The milk soaks in a little ahead of where the stream lands
          if (flow.head > 0.95) flow.reveal = Math.max(flow.reveal, (ex / w.width) * 100 + 5);
          wrap.style.setProperty("--reveal", flow.reveal.toFixed(2) + "%");
          wrap.style.setProperty("--my", (0.92 - flow.level * 1.02).toFixed(3) + "em");
          jarMilk.setAttribute("y", String(46 + flow.drain * 66));
        };

        const milk = gsap.timeline({ paused: true, delay: 0.4, onUpdate: drawStream });
        milk
          // In comes the jar over the start of the word, and it tips
          .fromTo(jar, { opacity: 0, left: "6%", y: "-1.2em", rotate: 0 }, { opacity: 1, y: "0em", duration: 0.7, ease: "expo" }, 0)
          .to(jar, { rotate: -82, duration: 0.6, ease: "power2.inOut" }, 0.35)
          .to(flow, { head: 1, duration: 0.3, ease: "power2.in" }, 0.75)
          .set(q(".hw-milk"), { opacity: 0.8 }, 0.95)
          .add(() => copy.play(), 0.6)
          // Pour across the word while the milk soaks in and rises
          .to(jar, { left: "88%", duration: 2.0, ease: "sine.inOut" }, 0.95)
          .to(jar, { rotate: -104, duration: 2.0, ease: "power1.in" }, 0.95)
          .to(flow, { level: 1, duration: 2.2, ease: "power1.inOut" }, 0.95)
          .to(flow, { drain: 1, duration: 2.0, ease: "none" }, 0.95)
          .fromTo(wrap, { "--mx": "0em" }, { "--mx": "-1.4em", duration: 2.6, ease: "power2.out" }, 0.95)
          // The last of the milk: the tail falls, the jar rights itself and leaves
          .to(flow, { tail: 1, duration: 0.3, ease: "power2.in" }, 2.95)
          .add(() => {
            flow.reveal = 110;
          }, 3.0)
          .to(jar, { rotate: -10, duration: 0.5, ease: "power2.inOut" }, 3.05)
          .to(jar, { y: "-1.4em", opacity: 0, duration: 0.6, ease: "power2.in" }, 3.4)
          // The soaked grains resolve into the golden wordmark
          .add(() => pour.lift(), 3.2)
          .to(q(".hero-word"), { opacity: 1, duration: 1.2, ease: "power2.inOut" }, 3.2)
          .to(q(".hw-milk"), { opacity: 0, duration: 1.2, ease: "power2.inOut" }, 3.35);

        // Pause the canvas whenever the hero is off-screen
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? pour.resume() : pour.pause()), { rootMargin: "80px" });

        let started = false;
        const begin = () => {
          if (started) return;
          started = true;
          gsap.to(q(".hero-beam"), { opacity: 1, duration: 2, ease: "power1.out" });
          pour.start();
          io.observe(el);
        };
        // Wait for the real font so grains land exactly where the letters are
        const offReady = onSiteReady(() => {
          document.fonts.ready.then(() => requestAnimationFrame(begin));
        });

        let w = window.innerWidth;
        const onResize = () => {
          if (Math.abs(window.innerWidth - w) < 2) return;
          w = window.innerWidth;
          if (pour.phase === "pour" || pour.phase === "lift" || milk.isActive()) {
            pour.finish();
            milk.progress(1).pause();
            gsap.set(q(".hero-word"), { opacity: 1 });
            gsap.set(q(".hw-milk, .hw-jar"), { opacity: 0 });
            copy.progress(1);
          }
          pour.resize();
        };
        window.addEventListener("resize", onResize);

        // Gentle parallax as the hero scrolls away
        gsap.to(q(".hero-parallax"), { yPercent: -18, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(q(".hero-beam"), { yPercent: 12, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });

        return () => {
          offReady();
          io.disconnect();
          window.removeEventListener("resize", onResize);
          pour.destroy();
          milk.kill();
          kicker.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const orderHref = whatsappHref() ?? "/order/";

  return (
    <section ref={root} className="hero relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-28 md:pt-32" aria-labelledby="hero-title">
      {/* Warm light from the kitchen window */}
      <div aria-hidden className="hero-beam pointer-events-none absolute inset-0 -z-[2] opacity-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_75%_at_88%_0%,rgba(255,232,178,0.8),rgba(255,236,190,0)_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_8%_100%,rgba(242,207,116,0.26),rgba(242,207,116,0)_70%)]" />
      </div>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 -z-[1] h-full w-full" />

      <div className="shell hero-parallax relative flex flex-1 flex-col justify-end pb-10 md:pb-14">
        <p className="hero-kicker hero-fade font-display text-step-1 font-semibold tracking-[-0.015em] text-toast">Professional Catering Services</p>

        <h1 id="hero-title" className="relative -ml-[0.04em] mt-1 leading-[0.8]">
          <span ref={wrapRef} className="hero-wordwrap relative block w-fit font-display text-[length:var(--step-hero)] font-extrabold tracking-[-0.065em]">
            <span ref={wordRef} className="hero-word block w-fit bg-[linear-gradient(180deg,#c7832c_8%,#8a4f17_92%)] bg-clip-text pb-[0.06em] text-transparent">
              RAAF
            </span>
            {/* Milk soaking into the grains, clipped to the letters */}
            <span aria-hidden className="hw-milk absolute inset-0 pb-[0.06em]">
              RAAF
            </span>
            {/* The stream, drawn each frame from the jar's lip */}
            <svg aria-hidden className="hw-stream">
              <path fill="none" stroke="#e2d2b6" strokeLinecap="round" />
              <path fill="none" stroke="#fffdf8" strokeLinecap="round" />
              <path fill="none" stroke="#ffffff" strokeLinecap="round" opacity="0.9" transform="translate(-2 0)" />
            </svg>
            {/* A glass jar of milk */}
            <span aria-hidden className="hw-jar">
              <svg viewBox="0 0 100 130">
                <defs>
                  <clipPath id="hw-jar-inside">
                    <path d="M24 16 L76 16 L76 24 C86 26 88 32 88 40 L88 112 C88 120 82 124 74 124 L26 124 C18 124 12 120 12 112 L12 40 C12 32 14 26 24 24 Z" />
                  </clipPath>
                  <linearGradient id="hw-jar-milk-fill" x1="0" x2="1">
                    <stop offset="0" stopColor="#efe6d6" />
                    <stop offset="0.45" stopColor="#fffdf8" />
                    <stop offset="1" stopColor="#e6dac4" />
                  </linearGradient>
                </defs>
                {/* Milk inside, draining as it pours */}
                <g clipPath="url(#hw-jar-inside)">
                  <rect className="hw-jar-milk" x="0" y="46" width="100" height="90" fill="url(#hw-jar-milk-fill)" />
                </g>
                {/* Glass */}
                <path d="M20 12 L80 12 L80 23 C90 26 92 33 92 41 L92 113 C92 123 85 128 75 128 L25 128 C15 128 8 123 8 113 L8 41 C8 33 10 26 20 23 Z" fill="rgba(255,255,255,0.28)" stroke="#cdbd9f" strokeWidth="3.5" strokeLinejoin="round" />
                <rect x="16" y="6" width="68" height="10" rx="4" fill="rgba(255,255,255,0.4)" stroke="#cdbd9f" strokeWidth="3" />
                <path d="M18 44 L18 108" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
                <path d="M80 50 L80 70" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              </svg>
              <span className="hw-lip" />
            </span>
          </span>
          <span className="sr-only"> Professional Catering Services</span>
        </h1>

        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end md:gap-[var(--gutter)]">
          <p className="hero-tagline hero-fade font-display text-step-4 font-bold leading-[1] tracking-[-0.04em] md:col-span-6">{business.tagline}</p>
          <div className="md:col-span-5 md:col-start-8">
            <p className="hero-body hero-fade measure text-[0.95rem] text-cocoa/80">
              A home kitchen that cooks for your biggest days: meat pies and bofrot, butter bread and celebration cakes, jollof and fufu. Fresh, hygienic and always on time.
            </p>
            <div className="hero-cta hero-fade mt-7 flex flex-wrap gap-3">
              <Button href="/menu/">See the menu</Button>
              <Button href={orderHref} variant="ghost">
                Plan an order
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="shell hero-meta relative flex items-center justify-between border-t border-cocoa/10 py-4 text-[0.85rem] text-cocoa/70">
        <span>Pastries, breads, cakes, small chops and meals</span>
        <span className="hidden sm:inline">Home-based, made by hand</span>
      </div>
    </section>
  );
}
