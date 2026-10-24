"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/**
 * A dough ball proving in its bowl, tied to scroll: it swells and domes
 * (stretching up more than out), the surface tightens and little air
 * bubbles surface. A soft squash on the way up keeps it feeling alive.
 */
export function RisingDough({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      gsap.set(q(".rd-dough"), { svgOrigin: "200 250" });
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 20%", scrub: 1 } });
        tl.fromTo(q(".rd-dough"), { scaleX: 0.78, scaleY: 0.6 }, { scaleX: 1.06, scaleY: 1.2, ease: "sine.inOut", duration: 0.7 })
          .to(q(".rd-dough"), { scaleX: 1.12, scaleY: 1.1, ease: "sine.inOut", duration: 0.3 })
          .fromTo(q(".rd-bubble"), { scale: 0, opacity: 0, svgOrigin: "200 200" }, { scale: 1, opacity: 1, stagger: 0.06, duration: 0.25, ease: "back.out(3)" }, 0.45)
          .fromTo(q(".rd-shine"), { opacity: 0 }, { opacity: 0.85, duration: 0.4 }, 0.5)
          .fromTo(q(".rd-cloth"), { y: 0, rotate: 0 }, { y: -36, rotate: -8, svgOrigin: "120 160", duration: 0.5, ease: "power1.inOut" }, 0.3);
      });
      mm.add(MQ.reduce, () => {
        gsap.set(q(".rd-dough"), { scaleX: 1.06, scaleY: 1.15 });
        gsap.set(q(".rd-bubble, .rd-shine"), { opacity: 1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className} aria-hidden>
      <svg viewBox="0 0 400 340" className="h-full w-full overflow-visible">
        <ellipse cx="200" cy="318" rx="150" ry="14" fill="#2a1a11" opacity="0.12" />
        {/* Bowl back */}
        <ellipse cx="200" cy="230" rx="160" ry="34" fill="#b9a78a" />
        {/* Dough */}
        <g className="rd-dough">
          <path d="M70 250 C70 170 130 120 200 120 C270 120 330 170 330 250 Z" fill="#f1e2c4" />
          <path d="M70 250 C76 210 96 186 122 172 C110 206 116 236 140 250 Z" fill="#e3cfa6" />
          <path className="rd-shine" d="M150 150 C176 136 220 134 248 146" stroke="#fffaf0" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0" />
          {[[176, 196, 5], [232, 176, 4], [262, 214, 3.5], [150, 222, 3], [212, 226, 2.5]].map(([x, y, r], i) => (
            <circle key={i} className="rd-bubble" cx={x} cy={y} r={r} fill="#e8d5ae" stroke="#d6bd8d" strokeWidth="1" opacity="0" />
          ))}
        </g>
        {/* Bowl front */}
        <path d="M40 230 C46 300 110 330 200 330 C290 330 354 300 360 230 C352 254 290 268 200 268 C110 268 48 254 40 230 Z" fill="#efe4d1" />
        <path d="M58 250 C76 292 120 314 170 320" stroke="#fffdf8" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
        <path d="M40 230 C48 254 110 268 200 268 C290 268 352 254 360 230" stroke="#d9cbb3" strokeWidth="4" fill="none" />
        {/* Tea towel draped over the rim, lifted as the dough grows */}
        <g className="rd-cloth">
          <path d="M28 214 C60 200 110 198 150 210 L140 270 C110 262 70 266 36 278 Z" fill="#f2cf74" />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${44 + i * 32} ${206 - i * 1} L${38 + i * 32} ${272 - i * 4}`} stroke="#c7832c" strokeWidth="5" opacity="0.6" />
          ))}
        </g>
      </svg>
    </div>
  );
}
