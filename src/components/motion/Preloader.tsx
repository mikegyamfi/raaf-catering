"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

declare global {
  interface Window {
    __raafReady?: boolean;
  }
}

/** Fires once the intro is out of the way, so the hero can start its pour */
export function onSiteReady(cb: () => void) {
  if (window.__raafReady) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("raaf:ready", handler, { once: true });
  return () => window.removeEventListener("raaf:ready", handler);
}

const markReady = () => {
  window.__raafReady = true;
  window.dispatchEvent(new Event("raaf:ready"));
};

/**
 * A loaf bakes: pale dough swells, browns to gold, glows, and the panel
 * lifts away. Max ~1.3s, shown once per visit, skipped for reduced motion.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    let seen = false;
    try {
      seen = sessionStorage.getItem("raaf-intro") === "1";
      sessionStorage.setItem("raaf-intro", "1");
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduce) {
      gsap.to(el, { opacity: 0, duration: reduce ? 0.4 : 0.25, ease: "power1.out", onComplete: () => (gsap.set(el, { display: "none" }), markReady()) });
      return;
    }

    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({ defaults: { ease: "expo" } });
    tl.fromTo(q(".pl-loaf"), { scale: 0.55, y: 14 }, { scale: 1, y: 0, duration: 0.85, ease: "back.out(1.4)" }, 0.05)
      .to(q(".pl-crust"), { opacity: 1, duration: 0.7, ease: "power2.inOut" }, 0.2)
      .to(q(".pl-shine"), { opacity: 0.9, duration: 0.4 }, 0.6)
      .fromTo(q(".pl-glow"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1.15, duration: 0.8, ease: "power2.out" }, 0.25)
      .fromTo(q(".pl-steam"), { drawSVG: "0% 0%", opacity: 0 }, { drawSVG: "0% 100%", opacity: 0.8, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.55)
      .to(q(".pl-stage"), { y: -30, opacity: 0, duration: 0.45, ease: "quint" }, 0.95)
      .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "quint", onStart: markReady }, 1.0)
      // Hidden without a React state update, so hydration is never forced to finish early
      .set(el, { display: "none" });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="fixed inset-0 z-[150] grid place-items-center bg-cocoa" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
      <div className="pl-stage relative grid place-items-center">
        <div className="pl-glow absolute h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(242,207,116,0.45),rgba(199,131,44,0.12)_45%,transparent_70%)] opacity-0" />
        <svg viewBox="0 0 200 160" className="relative w-40">
          <g fill="none" stroke="#f8e4ab" strokeWidth="3" strokeLinecap="round">
            <path className="pl-steam" opacity="0" d="M80 46 C70 36 90 28 80 14" />
            <path className="pl-steam" opacity="0" d="M100 40 C90 28 110 20 100 4" />
            <path className="pl-steam" opacity="0" d="M120 46 C110 36 130 28 120 14" />
          </g>
          <g className="pl-loaf" style={{ transformOrigin: "100px 130px" }}>
            <path d="M28 132 C22 92 52 56 100 56 C148 56 178 92 172 132 Q100 144 28 132 Z" fill="#f3eadb" />
            <g className="pl-crust" opacity="0">
              <path d="M28 132 C22 92 52 56 100 56 C148 56 178 92 172 132 Q100 144 28 132 Z" fill="#c7832c" />
              <path d="M28 132 C26 116 32 100 42 90 C46 114 70 132 120 138 Q70 142 28 132 Z" fill="#a9661d" />
              <path d="M72 76 L84 102 M100 70 L106 100 M128 76 L124 102" stroke="#8a4f17" strokeWidth="5" strokeLinecap="round" opacity="0.45" />
            </g>
            <path className="pl-shine" d="M58 84 C78 66 122 66 142 84" stroke="#f2cf74" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0" />
          </g>
        </svg>
      </div>
    </div>
  );
}
