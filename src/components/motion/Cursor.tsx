"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { fitCanvas } from "@/lib/hooks";

const INTERACTIVE = "a, button, [role='tab'], input, textarea, select, label, [data-cursor]";

/**
 * Desktop-only cursor: a little pat of butter that softens and melts (with
 * a drip) over anything clickable; every click splashes tiny butter drops.
 * Hidden for touch, coarse pointers and reduced motion.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!ok.matches) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");
    const dot = dotRef.current!;
    const canvas = canvasRef.current!;
    gsap.set(dot, { xPercent: -50, yPercent: -50, opacity: 0 });
    const xTo = gsap.quickTo(dot, "x", { duration: 0.35, ease: "expo" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.35, ease: "expo" });

    let hovering = false;
    let onDark = false;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(dot, { opacity: 1, duration: 0.3, overwrite: "auto" });
      const t = e.target as Element | null;
      const isHover = !!t?.closest?.(INTERACTIVE);
      const dark = !!t?.closest?.("[data-dark]");
      if (isHover !== hovering || dark !== onDark) {
        hovering = isHover;
        onDark = dark;
        dot.dataset.state = isHover ? "hover" : "idle";
        dot.dataset.dark = dark ? "1" : "0";
      }
    };
    const leave = () => gsap.to(dot, { opacity: 0, duration: 0.3 });

    // Flour sprinkle
    type P = { x: number; y: number; vx: number; vy: number; life: number; r: number };
    let parts: P[] = [];
    let raf = 0;
    let size = fitCanvas(canvas);
    const onResize = () => (size = fitCanvas(canvas));
    const step = () => {
      const { ctx, width, height } = size;
      ctx.clearRect(0, 0, width, height);
      parts = parts.filter((p) => p.life > 0);
      for (const p of parts) {
        p.vy += 0.09;
        p.vx *= 0.97;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.018;
        ctx.globalAlpha = Math.max(0, p.life) * 0.9;
        ctx.fillStyle = p.r > 1.6 ? "#e8ad4a" : "#f7d77e";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = parts.length ? requestAnimationFrame(step) : 0;
    };
    const click = (e: PointerEvent) => {
      for (let i = 0; i < 18; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 0.6 + Math.random() * 2.6;
        parts.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.6, life: 0.7 + Math.random() * 0.5, r: 0.8 + Math.random() * 1.8 });
      }
      gsap.fromTo(dot, { scale: 0.75 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      if (!raf) raf = requestAnimationFrame(step);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", click, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("resize", onResize);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", click);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[120] h-screen w-screen" />
      <div ref={dotRef} aria-hidden data-state="idle" className="cursor-dot pointer-events-none fixed left-0 top-0 z-[121]">
        {/* A firm little pat of butter */}
        <span className="cursor-dot__core" />
        {/* Over something clickable it softens into a glossy, dripping melt */}
        <svg className="cursor-dot__melt" viewBox="0 0 44 44">
          <defs>
            <linearGradient id="cur-butter" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fbe3a0" />
              <stop offset="0.55" stopColor="#f2cf74" />
              <stop offset="1" stopColor="#e2a845" />
            </linearGradient>
          </defs>
          <path
            className="cursor-dot__puddle"
            d="M8 17 C8 11 14 9 22 9 C30 9 36 11 36 17 C36 21 34 23 31 23 C30 23 29.5 24 29.5 26 C29.5 31 27.5 33 26 33 C24.5 33 23 31 23 27 C23 24.5 21.5 24 19.5 24 C17 24 16 25.5 16 27.5 C16 29.5 15 30.5 13.5 30.5 C12 30.5 11 29.5 11 27.5 C11 24 8 22 8 17 Z"
            fill="url(#cur-butter)"
          />
          <path d="M13 13.5 C16 12 21 11.6 25 12.2" stroke="#fff6d6" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <circle cx="26" cy="37" r="1.8" className="cursor-dot__drop" fill="#e8ad4a" />
        </svg>
      </div>
    </>
  );
}
